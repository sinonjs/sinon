import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../");
const nodeEnv = {
    ...process.env,
    NODE_PATH: path.join(repoRoot, "node_modules"),
};

function unpackTarball(tarballPath, tempRoot) {
    const nodeModulesDir = path.join(tempRoot, "node_modules");
    const packageDir = path.join(nodeModulesDir, "sinon");

    fs.mkdirSync(nodeModulesDir, { recursive: true });
    execFileSync("tar", ["-xzf", tarballPath, "-C", nodeModulesDir], { stdio: "ignore" });
    fs.renameSync(path.join(nodeModulesDir, "package"), packageDir);
}

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

        // Unpack tarball directly into node_modules.
        unpackTarball(tarballPath, tempRoot);

        // Run the entry file
        execFileSync("node", [...nodeArgs, entryFile], {
            cwd: tempRoot,
            env: nodeEnv,
            stdio: "inherit",
        });
    } finally {
        fs.rmSync(tempRoot, { recursive: true, force: true });
    }
}
