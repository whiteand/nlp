import { readableStreamToText } from "bun";
import { join } from "path";
import { ICommand } from "../../App/types";
import { TextBuilder } from "../../TextBuilder";
import { loadUkrainianDictionary } from "../parse/ukrainianDictionary";
import { ZrozumiloWebsocketMessage } from "./app/src/packages/be/ZrozumiloWebsocketMessage";
import { getUkrainianWordId } from "../parse/ukrainian-types";

export const SERVE_COMMAND: ICommand = {
  name: "serve",
  help() {
    return {
      message: new TextBuilder({ width: 80 })
        .write(`<stdin> | ${this.name}`)
        .space()
        .gray("-")
        .space()
        .pushCurrentAsTab()
        .gray(
          "starts server that will read everything from the standard input and will try to parse it as a list of lexems. It will provide with possible jobs that you will be able to fulfill to get the better parsing result."
        )
        .popTab()
        .build(),
    };
  },
  async run() {
    const text = await readableStreamToText(Bun.stdin.stream());
    let uaDictionary = await loadUkrainianDictionary();

    const server = Bun.serve({
      async fetch(req) {
        const success = server.upgrade(req);
        if (success) {
          // Bun automatically returns a 101 Switching Protocols
          // if the upgrade succeeds
          return undefined;
        }

        const url = new URL(req.url);
        const filePath = url.pathname === "/" ? "/index.html" : url.pathname;
        const dirName = import.meta.dir;
        const absPath = join(dirName, "app/public", filePath);
        const file = Bun.file(absPath);
        if (!(await file.exists())) {
          return new Response("file not found", { status: 404 });
        }
        return new Response(file, { status: 200 });
      },
      websocket: {
        message(ws, message) {
          const text = message.toString();
          const m = JSON.parse(text) as ZrozumiloWebsocketMessage;

          if (m.type === "get") {
            if (m.resource === "dictionary") {
              const res: ZrozumiloWebsocketMessage & {
                type: "dictionary-response";
              } = {
                requestId: m.id,
                type: "dictionary-response",
                words: [],
              };
              for (const entry of uaDictionary.values(
                m.params.skip,
                m.params.take
              )) {
                if (entry.type !== "ukrainian-word") continue;
                res.words.push({
                  id: getUkrainianWordId(entry.details),
                  base: entry.details.base,
                  text: entry.details.text,
                });
              }
              ws.send(JSON.stringify(res));
              return;
            }
          }

          ws.send(JSON.stringify({ message: m }));
        },
      },
      port: 8080,
    });
    console.log(
      "Server started listening at " + server.hostname + ":" + server.port
    );
  },
  shortHelpInGlobalHelp(b) {
    b.write(this.name)
      .gray(" - ")
      .pushCurrentAsTab()
      .gray("starts a UI for ukrainian parsing")
      .popTab();
  },
};
