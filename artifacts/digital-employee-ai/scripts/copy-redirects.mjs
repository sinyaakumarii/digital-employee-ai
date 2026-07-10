import { cpSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDir, "..");
const sourcePath = resolve(appRoot, "public", "_redirects");
const targetDirs = [resolve(appRoot, "dist"), resolve(appRoot, "dist", "public")];

if (!existsSync(sourcePath)) {
  console.warn(`Redirect file not found at ${sourcePath}`);
  process.exit(0);
}

for (const targetDir of targetDirs) {
  mkdirSync(targetDir, { recursive: true });
  cpSync(sourcePath, join(targetDir, "_redirects"));
}

console.log(`Copied _redirects to ${targetDirs.join(", ")}`);
