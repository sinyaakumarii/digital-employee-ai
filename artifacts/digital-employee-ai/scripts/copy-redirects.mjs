import { copyFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDir, "..");
const sourcePath = resolve(appRoot, "public", "_redirects");
const targetDir = resolve(appRoot, "dist");
const nestedPublicDir = resolve(targetDir, "public");

if (!existsSync(sourcePath)) {
  console.warn(`Redirect file not found at ${sourcePath}`);
  process.exit(0);
}

if (existsSync(nestedPublicDir)) {
  rmSync(nestedPublicDir, { recursive: true, force: true });
}

mkdirSync(targetDir, { recursive: true });
copyFileSync(sourcePath, resolve(targetDir, "_redirects"));

console.log(`Copied _redirects to ${resolve(targetDir, "_redirects")}`);
