const task = process.argv[2];
const mode = process.argv[3];

if (!task || !mode) {
  console.error("usage: node scripts/task-status.mjs <task> <success|fail>");
  process.exit(2);
}

const messages = {
  "build:ts":
    "No TypeScript build targets exist yet; this placeholder keeps the Phase 1 task surface stable.",
  "cluster:smoke":
    "Reserved for a later milestone; cluster smoke validation is not implemented yet.",
  "dev:tilt": "Reserved for a later milestone; Tilt remains optional and is not implemented yet.",
  "obs:smoke":
    "Reserved for a later milestone; observability smoke validation is not implemented yet.",
  "security:smoke":
    "Reserved for a later milestone; security smoke validation is not implemented yet.",
  "test:contract":
    "No contract test suites exist yet; this placeholder keeps the Phase 1 task surface stable.",
  "test:e2e": "Reserved for a later milestone; end-to-end tests are not implemented yet.",
  "test:integration": "Reserved for a later milestone; integration tests are not implemented yet.",
  "test:ts":
    "No TypeScript test suites exist yet; this placeholder keeps the Phase 1 task surface stable.",
};

const message = messages[task] ?? "Task placeholder executed.";

if (mode === "success") {
  console.log(`${task}: ${message}`);
  process.exit(0);
}

if (mode === "fail") {
  console.error(`${task}: ${message}`);
  process.exit(1);
}

console.error(`unsupported mode: ${mode}`);
process.exit(2);
