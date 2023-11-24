import { readableStreamToText } from "bun";
import { ICommand } from "../../App/types";
import { TextBuilder } from "../../TextBuilder";
import { CharIter } from "../../CharIter";
import { Lexer } from "../../lexer/Lexer";
import { LexerStats } from "../parse/LexerStats";
import { AdvancedLexer } from "../parse/AdvancedLexer";
import { loadUkrainianDictionary } from "../parse/ukrainianDictionary";
import { join } from "path";

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
    await Bun.build({
      entrypoints: [join(import.meta.dir, "app/src/index.tsx")],
      outdir: join(import.meta.dir, "app/public/dist"),
      target: "browser",
      format: "esm",
    });
    const text = await readableStreamToText(Bun.stdin.stream());
    let uaDictionary = await loadUkrainianDictionary();

    const server = Bun.serve({
      async fetch(req) {
        const url = new URL(req.url);
        const filePath = url.pathname === "/" ? "/index.html" : url.pathname;
        const dirName = import.meta.dir;
        const absPath = join(dirName, "app/public", filePath);
        console.log({ absPath, dirName, filePath });
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
