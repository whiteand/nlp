/**
 * @param {any} condition
 * @param {any} message
 * @param {any} result
 * @param {any} element
 * @returns {asserts condition}
 */
function assert(condition, message, result, element) {
  if (condition) return;
  console.error(message, element);
  console.log("current result", result);
  throw new Error("not handled yet: " + message);
}

/**
 * @param {import('./telegram').IMessage} result
 * @param {Node} child
 */
function consumeReactionElement(result, element) {
  const reactionSticker = element.querySelector(".reaction-sticker");
  assert(reactionSticker, "absent reaction sticker", result, element);
  const docId = reactionSticker.dataset.docId;
  assert(docId, "absent doc id", result, element);
  const counter = element.querySelector(".reaction-counter");
  assert(counter, "absent reaction counter", result, element);
  const count = counter.textContent;
  assert(count, "absent count", result, element);
  result.reactions.push({ id: docId, count });
}
/**
 * @param {import('./telegram').IMessage} result
 * @param {Node} child
 */
function consumeReactionsElement(result, element) {
  for (let child = element.firstChild; child; child = child.nextSibling) {
    if (child.nodeName.toUpperCase() === "REACTION-ELEMENT") {
      consumeReactionElement(result, child);
      continue;
    }
    if (child.classList.contains("time")) {
      const timeInner = child.querySelector(".time-inner");
      assert(timeInner, "absent time inner", result, child);
      consumeTimeElement(result, timeInner);
      return;
    }

    assert(false, "unexpected child in reactions element", result, child);
  }
}

/**
 * @param {import('./telegram').IMessage} result
 * @param {Node} messageChild
 */
function consumeTimeElement(result, timeElement) {
  const timeAttr = timeElement.getAttribute("title");
  assert(timeAttr, "absent inner-time[title]", result, timeElement);
  result.time = timeAttr;

  for (let child = timeElement.firstChild; child; child = child.nextSibling) {
    if (child.classList.contains("post-views")) {
      result.views = child.textContent;
      continue;
    }
    if (child.classList.contains("time-icon")) continue;
    if (child.classList.contains("i18n")) continue;
    assert(false, "failed to handle time element child", result, child);
  }
}
/**
 * @param {import('./telegram').IMessage} result
 * @param {Node} messageChild
 */
function consumeChild(result, messageChild) {
  // if child is a text node we should add { text: string } to result.content
  if (messageChild.nodeType === Node.TEXT_NODE) {
    result.content.push({ text: messageChild.textContent });
    return;
  }
  if (messageChild.nodeName.toUpperCase() === "REACTIONS-ELEMENT") {
    consumeReactionsElement(result, messageChild);
    return;
  }
  if (messageChild.classList.contains("emoji")) {
    result.content.push({ type: "emoji", emoji: messageChild.textContent });
    return;
  }
  if (messageChild.classList.contains("anchor-url")) {
    const text = messageChild.textContent;
    const href = messageChild.getAttribute("href");
    result.content.push({ type: "anchor", text, href });
    return;
  }
  if (messageChild.classList.contains("anchor-hashtag")) {
    const hashtag = messageChild.textContent;
    result.content.push({ type: "hashtag", hashtag });
    return;
  }
  if (messageChild.nodeName.toUpperCase() === "STRONG") {
    const text = messageChild.textContent;
    result.content.push({ type: "strong", text });
    return;
  }
  if (messageChild.nodeName.toUpperCase() === "EM") {
    const text = messageChild.textContent;
    result.content.push({ type: "em", text });
    return;
  }
  if (
    messageChild.classList.contains("mention") &&
    messageChild.nodeName.toUpperCase() === "A"
  ) {
    const href = messageChild.getAttribute("href");
    assert(href, "absent href in mention", result, messageChild);
    const text = messageChild.textContent;
    result.content.push({ type: "mention", href, text });
    return;
  }

  if (messageChild.classList.contains("time")) {
    const timeInner = messageChild.querySelector(".time-inner");
    assert(timeInner, "absent time inner", result, messageChild);
    consumeTimeElement(result, timeInner);
    return;
  }
  if (messageChild.classList.contains("web")) {
    console.warn("Not implemented .web parser");
    return;
  }

  console.error("cannot handle message child", messageChild);
  console.log("current result", result);
  throw new Error("not handled yet");
}

function getAllMessages() {
  const bubbles = [...document.querySelectorAll(".bubble")].filter(
    (bubble) => bubble?.dataset?.mid
  );

  const bubblesWithMessages = bubbles
    .map((bubble) => {
      /**
       * @type {HTMLDivElement}
       */
      const message = bubble.querySelector(".message");
      return {
        id: bubble.dataset.mid,
        bubble,
        message,
      };
    })
    .filter(({ message }) => message);

  /**
   * @type {Message[]}
   */
  const res = [];
  for (const { message, id } of bubblesWithMessages) {
    /**
     * @type {import('./telegram').IMessage}
     */
    const result = {
      content: [],
      views: null,
      reactions: [],
      id: id,
      time: null,
    };
    let child = message.firstChild;
    while (child) {
      consumeChild(result, child);
      child = child.nextSibling;
    }
    res.push(result);
  }
  return res;
}

let res = Object.assign({}, window.res || {});
function tick() {
  let previousN = Object.keys(res).length;
  const messages = getAllMessages();
  const messagesDict = {};
  for (const message of messages) {
    messagesDict[message.id] = message;
  }
  Object.assign(res, messagesDict);
  let currentN = Object.keys(res).length;
  if (currentN > previousN) {
    console.log("new messages", currentN - previousN, "total", currentN);
  }
}

let int = setInterval(() => tick(), 100);
function stop() {
  if (int == null) return;
  clearInterval(int);
  int = null;
}
