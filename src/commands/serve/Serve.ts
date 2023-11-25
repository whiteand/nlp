import { readableStreamToText } from "bun";
import { join } from "path";
import { ICommand } from "../../App/types";
import { TextBuilder } from "../../TextBuilder";
import { loadUkrainianDictionary } from "../parse/ukrainianDictionary";

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
          const m = JSON.parse(text);

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
