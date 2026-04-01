import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function run(command, args, cwd) {
    execFileSync(command, args, {
        cwd,
        stdio: "inherit",
        env: process.env,
    });
}

console.log("Building Sinon...");
run("npm", ["run", "build"], repoRoot);

console.log("Packing Sinon...");
const packJson = execFileSync("npm", ["pack", "--json"], { cwd: repoRoot });
const [{ filename }] = JSON.parse(packJson.toString("utf8"));
const tarballPath = path.join(repoRoot, filename);

console.log(`Packed tarball: ${tarballPath}`);

const fixtures = [
    // To be populated in Task 2
];

if (fixtures.length === 0) {
    console.error("No fixtures found to run.");
    process.exit(1);
}

let failed = false;
for (const fixture of fixtures) {
    console.log(`RUNNING fixture: ${fixture}`);
    try {
        // runFixture logic will go here or be imported
        console.log(`PASS ${fixture}`);
    } catch (err) {
        console.error(`FAIL ${fixture}`);
        console.error(err);
        failed = true;
        break;
    }
}

// Cleanup tarball
fs.unlinkSync(tarballPath);

if (failed) {
    process.exit(1);
}
