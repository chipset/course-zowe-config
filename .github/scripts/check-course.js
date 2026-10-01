const fs = require("fs");
const { execFileSync } = require("child_process");

const course = JSON.parse(fs.readFileSync("course.json", "utf8"));
const errors = [];
const seen = new Set();

for (const step of course.steps) {
  if (seen.has(step.id)) errors.push(`duplicate step id: ${step.id}`);
  seen.add(step.id);

  for (const key of ["instructions", "validator", "solution", "starter"]) {
    const p = step[key];
    if (p === undefined) continue;
    if (!fs.existsSync(p)) {
      errors.push(`${step.id}: ${key} path not found: ${p}`);
    } else if (key === "validator") {
      try {
        execFileSync("node", ["--check", p], { stdio: "pipe" });
      } catch (e) {
        errors.push(`${step.id}: syntax error in ${p}\n${e.stderr}`);
      }
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`course.json OK: ${course.steps.length} steps checked`);
