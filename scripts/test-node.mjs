import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mochaBin = path.resolve(__dirname, "../node_modules/mocha/bin/mocha.js");

function runMocha(args) {
    const result = spawnSync(process.execPath, [mochaBin, ...args], {
        encoding: "utf8",
        stdio: "inherit",
    });

    if (result.error) {
        throw result.error;
    }

    if (result.status !== 0) {
        process.exit(result.status ?? 1);
    }
}

runMocha([
    "--recursive",
    "--parallel",
    "-R",
    "dot",
    "test/**/*-test.js",
    "--ignore",
    "test/src/**/*-test.js",
]);

runMocha(["--recursive", "--parallel", "-R", "dot", "test/src/"]);
