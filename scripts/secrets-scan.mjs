import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: options.stdio ?? "inherit",
    input: options.input,
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  if (typeof result.status === "number" && result.status !== 0) {
    process.exit(result.status);
  }

  return result;
}

const stagedFilesResult = run("git", ["diff", "--cached", "--name-only", "--diff-filter=ACMR"], {
  stdio: ["inherit", "pipe", "inherit"],
});

const stagedFiles = stagedFilesResult.stdout
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

if (stagedFiles.length > 0) {
  console.log("Running Infisical staged file scan.");

  const tempRoot = mkdtempSync(join(tmpdir(), "open-platform-secrets-"));

  try {
    for (const file of stagedFiles) {
      const fileResult = run("git", ["show", `:${file}`], {
        stdio: ["inherit", "pipe", "inherit"],
      });
      const targetPath = join(tempRoot, file);

      mkdirSync(dirname(targetPath), { recursive: true });
      writeFileSync(targetPath, fileResult.stdout, "utf8");
    }

    run("infisical", [
      "scan",
      "--no-git",
      "--source",
      tempRoot,
      "--redact",
      "--config",
      ".infisical-scan.toml",
    ]);
  } finally {
    rmSync(tempRoot, { force: true, recursive: true });
  }

  process.exit(0);
}

console.log("No staged changes found; running Infisical working tree scan.");
run("infisical", [
  "scan",
  "--no-git",
  "--source",
  ".",
  "--redact",
  "--config",
  ".infisical-scan.toml",
]);
