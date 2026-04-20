import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const workspaceRoot = new URL("../", import.meta.url);

const publishOrder = [
  "packages/core",
  "packages/editor",
  "packages/local",
  "packages/adapter-next",
  "packages/adapter-supabase",
  "packages/blog-kit"
];

function readPackageJson(relativeDirectory) {
  const packageJsonPath = new URL(`${relativeDirectory}/package.json`, workspaceRoot);
  return JSON.parse(readFileSync(packageJsonPath, "utf8"));
}

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    stdio: "pipe",
    encoding: "utf8",
    ...options
  });
}

function versionExistsOnNpm(name, version) {
  try {
    const output = run(
      "npm",
      ["view", `${name}@${version}`, "version", "--registry", "https://registry.npmjs.org"],
      { cwd: new URL(".", workspaceRoot) }
    ).trim();

    return output === version;
  } catch (error) {
    const stderr =
      typeof error === "object" &&
      error !== null &&
      "stderr" in error &&
      typeof error.stderr === "string"
        ? error.stderr
        : "";

    if (stderr.includes("E404") || stderr.includes("404")) {
      return false;
    }

    throw error;
  }
}

for (const relativeDirectory of publishOrder) {
  const packageJson = readPackageJson(relativeDirectory);

  if (packageJson.private) {
    console.log(`Skipping private package in ${relativeDirectory}`);
    continue;
  }

  const { name, version } = packageJson;

  if (versionExistsOnNpm(name, version)) {
    console.log(`Skipping ${name}@${version}; version already exists on npm.`);
    continue;
  }

  console.log(`Publishing ${name}@${version} from ${relativeDirectory}...`);

  execFileSync(
    "pnpm",
    ["publish", "--access", "public", "--no-git-checks", "--provenance"],
    {
      stdio: "inherit",
      cwd: new URL(`${relativeDirectory}/`, workspaceRoot)
    }
  );
}
