import { error } from "console";
import { build } from "esbuild";
import { copyFile, mkdir, readdir, stat } from "fs/promises";
import { packageDirectory } from "package-directory";
import { join, relative } from "path";
import { exit } from "process";
import { esbuildOptions } from "./options.ts";

const PACKAGE_DIR = await packageDirectory();

if (!PACKAGE_DIR) {
  error("Could not find package directory");
  exit(1);
}

/**
 * Get all TypeScript files in a directory recursively
 * @param dir - Directory to scan
 * @param baseDir - Base directory for relative path calculation
 * @returns Array of relative file paths
 */
async function getTypeScriptFiles(dir: string, baseDir = dir): Promise<string[]> {
  const files = [];
  const items = await readdir(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    if ((await stat(fullPath)).isDirectory())
      // Recursively get files from subdirectories
      files.push(...(await getTypeScriptFiles(fullPath, baseDir)));
    else if (
      item.endsWith(".ts") &&
      !item.endsWith(".d.ts") &&
      !relative(baseDir, fullPath).startsWith("types")
    )
      files.push(fullPath);
  }

  return files;
}

async function getJsonFiles(dir: string, baseDir = dir): Promise<string[]> {
  const files = [];
  const items = await readdir(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    if ((await stat(fullPath)).isDirectory())
      files.push(...(await getJsonFiles(fullPath, baseDir)));
    else if (item.endsWith(".json")) files.push(fullPath);
  }

  return files;
}

async function copyJsonAssets(srcDir: string, outDir: string): Promise<void> {
  const files = await getJsonFiles(srcDir);

  await Promise.all(
    files.map(async (file) => {
      const relativePath = relative(srcDir, file);
      const targetPath = join(outDir, relativePath);

      await mkdir(join(targetPath, ".."), { recursive: true });
      await copyFile(file, targetPath);
    }),
  );
}

await Promise.all([import("./check.ts"), import("./clean.ts"), import("./lint.ts")]);
await Promise.all([
  build({
    ...esbuildOptions,
    entryPoints: await getTypeScriptFiles(join(PACKAGE_DIR, "src")),
  }),
  copyJsonAssets(join(PACKAGE_DIR, "src"), join(PACKAGE_DIR, "dist")),
  import("./schema.ts"),
]);
