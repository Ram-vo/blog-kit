import { rename } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const env = {
  ...process.env,
  STARTER_OUTPUT_MODE: "export",
  STARTER_DATA_MODE: process.env.STARTER_DATA_MODE ?? "sample"
};

for (const arg of args) {
  if (arg.startsWith("--base-path=")) {
    env.STARTER_BASE_PATH = arg.slice("--base-path=".length);
  }

  if (arg.startsWith("--site-url=")) {
    env.STARTER_SITE_URL = arg.slice("--site-url=".length);
  }
}

const starterRoot = fileURLToPath(new URL("..", import.meta.url));
const hiddenRoutes = [
  ["app/editor", "app/__editor-disabled-for-export"],
  ["app/api/editor", "app/api/__editor-disabled-for-export"]
];

async function moveRoutes(targets) {
  for (const [from, to] of targets) {
    await rename(join(starterRoot, from), join(starterRoot, to));
  }
}

await moveRoutes(hiddenRoutes);

const child = spawn("next", ["build"], {
  cwd: starterRoot,
  env,
  stdio: "inherit",
  shell: process.platform === "win32"
});

child.on("exit", async (code) => {
  await moveRoutes(hiddenRoutes.map(([from, to]) => [to, from]));
  process.exit(code ?? 1);
});
