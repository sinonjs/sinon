import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { runFixture } from "../test/distribution/helpers/run-fixture.mjs";

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
    {
        name: "require-default",
        dir: "test/distribution/fixtures/require-default",
        entry: "index.cjs",
    },
    {
        name: "import-default",
        dir: "test/distribution/fixtures/import-default",
        entry: "index.mjs",
    },
    {
        name: "import-named",
        dir: "test/distribution/fixtures/import-named",
        entry: "index.mjs",
    },
    {
        name: "require-package-exports",
        dir: "test/distribution/fixtures/require-package-exports",
        entry: "index.cjs",
    },
];

if (fixtures.length === 0) {
    console.error("No fixtures found to run.");
    process.exit(1);
}

let failed = false;
for (const fixture of fixtures) {
    console.log(`RUNNING fixture: ${fixture.name}`);
    try {
        await runFixture({
            fixtureDir: path.join(repoRoot, fixture.dir),
            tarballPath,
            entryFile: fixture.entry,
        });
        console.log(`PASS ${fixture.name}`);
    } catch (err) {
        console.error(`FAIL ${fixture.name}`);
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
