import { error } from "console";
import { mkdir, writeFile } from "fs/promises";
import { packageDirectory } from "package-directory";
import { join } from "path";
import { exit } from "process";
import { CoreCardOptions, CoreEffectOptions, CoreEventOptions } from "../src/index.ts";

const PACKAGE_DIR = await packageDirectory();

if (!PACKAGE_DIR) {
  error("Could not find package directory");
  exit(1);
}

const SCHEMAS_DIR = join(PACKAGE_DIR, "dist", "schemas");
await mkdir(SCHEMAS_DIR, { recursive: true });
const OPTIONS_DIR = join(SCHEMAS_DIR, "options");
await mkdir(OPTIONS_DIR, { recursive: true });
await Promise.all([
  writeFile(
    join(OPTIONS_DIR, "card.schema.json"),
    JSON.stringify(CoreCardOptions, void 0, 2),
    "utf-8",
  ),
  writeFile(
    join(OPTIONS_DIR, "effect.schema.json"),
    JSON.stringify(CoreEffectOptions, void 0, 2),
    "utf-8",
  ),
  writeFile(
    join(OPTIONS_DIR, "event.schema.json"),
    JSON.stringify(CoreEventOptions, void 0, 2),
    "utf-8",
  ),
]);
