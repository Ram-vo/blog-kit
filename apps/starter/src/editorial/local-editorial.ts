import { createLocalAdapter } from "blog-kit-local";
import { join } from "node:path";

function getContentDirectory() {
  return join(process.cwd(), "content", "blog");
}

export function createStarterLocalAdapter() {
  return createLocalAdapter({
    contentDirectory: getContentDirectory()
  });
}
