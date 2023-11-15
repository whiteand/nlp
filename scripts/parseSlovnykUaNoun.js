copy(
  [...$0.querySelectorAll("tbody")[0].children]
    .map((e) => [...e.children].map((e) => e.textContent))
    .flatMap((tripple, i, arr) => {
      const uaCase = tripple[0];
      const singularOptions = tripple[1]
        .split(", ")
        .map((x) => (x.startsWith("на/у ") ? x.slice(5) : x));
      const pluralOptions = tripple[2]
        .split(", ")
        .map((x) => (x.startsWith("на/у ") ? x.slice(5) : x));
      const cs =
        uaCase === "Називний"
          ? "nominative"
          : uaCase === "Родовий"
          ? "genitive"
          : uaCase === "Давальний"
          ? "dative"
          : uaCase === "Знахідний"
          ? "accusative"
          : uaCase === "Орудний"
          ? "instrumental"
          : uaCase === "Місцевий"
          ? "locative"
          : uaCase === "Кличний"
          ? "vocative"
          : null;
      return [
        ...singularOptions.map(
          (singleOption) =>
            `${singleOption},${arr[0][1]},noun,${cs},singular,masculine,,,`
        ),
        ...pluralOptions.map(
          (pluralOption) =>
            `${pluralOption},${arr[0][1]},noun,${cs},plural,masculine,,,`
        ),
      ];
    })
    .join("\n")
);
