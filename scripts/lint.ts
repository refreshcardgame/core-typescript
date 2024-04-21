import { execSync } from "child_process";
import { exit } from "process";

try {
  execSync("npx oxlint", { stdio: "inherit" });
} catch {
  exit(1);
}
