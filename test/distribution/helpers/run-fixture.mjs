import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export function runFixture({
    fixtureDir,
    tarballPath,
    entryFile,
    nodeArgs = [],
}) {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "sinon-dist-"));
    const fixtureSource = path.join(fixtureDir);

    try {
        // Copy fixture files
        fs.cpSync(fixtureSource, tempRoot, { recursive: true });

        // Ensure minimal package.json if it doesn't exist
        const pkgPath = path.join(tempRoot, "package.json");
        if (!fs.existsSync(pkgPath)) {
            fs.writeFileSync(pkgPath, JSON.stringify({ name: "fixture", version: "1.0.0" }));
        }

        // Install tarball
        execFileSync("npm", ["install", "--no-package-lock", "--no-save", tarballPath], {
            cwd: tempRoot,
            stdio: "ignore",
        });

        // Run the entry file
        execFileSync("node", [...nodeArgs, entryFile], {
            cwd: tempRoot,
            stdio: "inherit",
        });
    } finally {
        fs.rmSync(tempRoot, { recursive: true, force: true });
    }
}
