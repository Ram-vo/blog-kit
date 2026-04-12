import { spawn } from "node:child_process";

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

const child = spawn("next", ["build"], {
  cwd: new URL("..", import.meta.url),
  env,
  stdio: "inherit",
  shell: process.platform === "win32"
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
