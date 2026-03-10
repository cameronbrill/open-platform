import { spawnSync } from "node:child_process";

const mode = process.argv[2];

if (!mode) {
  console.error("usage: node scripts/run-go-task.mjs <fmt|fmt:check|lint|build|test>");
  process.exit(2);
}

const cwd = process.cwd();

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: options.stdio ?? "inherit",
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

function tracked(pattern) {
  const result = spawnSync("git", ["ls-files", "--", pattern, `**/${pattern}`], {
    cwd,
    encoding: "utf8",
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  if (typeof result.status === "number" && result.status !== 0) {
    process.exit(result.status);
  }

  return result.stdout
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

const goFiles = tracked("*.go");
const goModules = tracked("go.mod");

if (goFiles.length === 0) {
  console.log(`Skipping ${mode}; no tracked Go files found.`);
  process.exit(0);
}

if (mode === "fmt") {
  run("gofmt", ["-w", ...goFiles]);
  process.exit(0);
}

if (mode === "fmt:check") {
  const result = run("gofmt", ["-l", ...goFiles], { stdio: ["inherit", "pipe", "inherit"] });
  const dirty = result.stdout.trim();

  if (dirty.length > 0) {
    console.error("Go formatting check failed for:");
    console.error(dirty);
    process.exit(1);
  }

  process.exit(0);
}

if (goModules.length === 0) {
  console.log(`Skipping ${mode}; no tracked Go modules found.`);
  process.exit(0);
}

if (mode === "lint") {
  run("golangci-lint", ["run", "./..."]);
  process.exit(0);
}

if (mode === "build") {
  run("go", ["build", "./..."]);
  process.exit(0);
}

if (mode === "test") {
  run("go", ["test", "./..."]);
  process.exit(0);
}

console.error(`unsupported go task mode: ${mode}`);
process.exit(2);
