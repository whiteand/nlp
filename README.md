# Natural Language Processing

To install dependencies:

```bash
bun install
cd ./src/commands/serve/app
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.0.6. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.


# Usage Examples:

```bash
bun run ./src/index.ts telegram-print ./data/zelensky.json | bun run './src/index.ts' language-stats
```

to start UI server:

```bash
bun src/index.ts telegram-print data/zelensky.json | bun run --watch src/index.ts serve
```