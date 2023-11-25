import { execSync } from "child_process";
import { join } from "path";
import "./src/index.tsx";

export async function build() {
  const output = execSync(
    "bun tailwindcss -i " +
      join(import.meta.dir, "src/main.scss") +
      " -o " +
      join(import.meta.dir, "public/dist/main.css"),
    {
      cwd: join(import.meta.dir),
    }
  );

  console.log("Css is built");

  await Bun.build({
    entrypoints: [join(import.meta.dir, "src/index.tsx")],
    outdir: join(import.meta.dir, "public/dist"),
    target: "browser",
    format: "esm",
  });
  console.log("UI is built");

  const server = Bun.serve({
    async fetch(req) {
      const url = new URL(req.url);

      const pathname = /.*\.\w+$/.test(url.pathname)
        ? url.pathname
        : "/index.html";

      const file = Bun.file(join(import.meta.dir, "public", pathname));
      if (!(await file.exists())) {
        return new Response("not found", { status: 404 });
      }
      return new Response(file, { status: 200 });
    },
    port: 3000,
  });

  console.log("Listening at " + server.hostname + ":" + server.port);
}

if (import.meta.main) {
  console.log("Building UI...");
  build();
}
