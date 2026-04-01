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

console.log("Packing Sinon...");
const packJson = execFileSync("npm", ["pack", "--json"], { cwd: repoRoot });
const [{ filename }] = JSON.parse(packJson.toString("utf8"));
const tarballPath = path.join(repoRoot, filename);

console.log(`Packed tarball: ${tarballPath}`);

let failed = false;

console.log("Verifying public API manifest...");
const manifestPath = path.join(repoRoot, "test/distribution/public-api-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "sinon-dist-manifest-"));
try {
    fs.writeFileSync(path.join(tempRoot, "package.json"), JSON.stringify({ name: "manifest-check", version: "1.0.0" }));
    execFileSync("npm", ["install", "--no-package-lock", "--no-save", tarballPath], {
        cwd: tempRoot,
        stdio: "ignore",
    });

    const extractorSource = fs.readFileSync(path.join(repoRoot, "test/distribution/helpers/read-public-api.cjs"), "utf8");
    fs.writeFileSync(path.join(tempRoot, "extract.cjs"), extractorSource);

    const actualManifestJson = execFileSync("node", ["-e", "console.log(JSON.stringify(require('./extract.cjs')))\n"], {
        cwd: tempRoot,
    }).toString("utf8");
    const actualManifest = JSON.parse(actualManifestJson);

    // Simple comparison
    const expectedKeys = JSON.stringify(manifest.topLevelKeys);
    const actualKeys = JSON.stringify(actualManifest.topLevelKeys);
    if (expectedKeys !== actualKeys) {
        console.error("Public API manifest mismatch: topLevelKeys");
        console.error(`Expected: ${expectedKeys}`);
        console.error(`Actual:   ${actualKeys}`);
        failed = true;
    }

    for (const [fnName, expected] of Object.entries(manifest.functions)) {
        const actual = actualManifest.functions[fnName];
        if (JSON.stringify(expected) !== JSON.stringify(actual)) {
            console.error(`Public API manifest mismatch: functions.${fnName}`);
            console.error(`Expected: ${JSON.stringify(expected)}`);
            console.error(`Actual:   ${JSON.stringify(actual)}`);
            failed = true;
        }
    }

    if (manifest.hasTimers !== actualManifest.hasTimers) {
        console.error(`Public API manifest mismatch: hasTimers. Expected ${manifest.hasTimers}, got ${actualManifest.hasTimers}`);
        failed = true;
    }
    if (manifest.hasPromise !== actualManifest.hasPromise) {
        console.error(`Public API manifest mismatch: hasPromise. Expected ${manifest.hasPromise}, got ${actualManifest.hasPromise}`);
        failed = true;
    }
    if (manifest.hasMatch !== actualManifest.hasMatch) {
        console.error(`Public API manifest mismatch: hasMatch. Expected ${manifest.hasMatch}, got ${actualManifest.hasMatch}`);
        failed = true;
    }

    if (!failed) {
        console.log("PASS public API manifest");
    }
} catch (err) {
    console.error("Failed to verify public API manifest:");
    console.error(err);
    failed = true;
} finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
}

if (!failed) {
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
        {
            name: "require-fake-timers-sync",
            dir: "test/distribution/fixtures/require-fake-timers-sync",
            entry: "index.cjs",
        },
        {
            name: "import-default-and-named",
            dir: "test/distribution/fixtures/import-default-and-named",
            entry: "index.mjs",
        },
    ];

    if (fixtures.length === 0) {
        console.error("No fixtures found to run.");
        failed = true;
    } else {
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
    }
}

// Cleanup tarball
if (fs.existsSync(tarballPath)) {
    fs.unlinkSync(tarballPath);
}

if (failed) {
    process.exit(1);
}
