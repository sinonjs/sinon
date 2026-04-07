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
    "-R",
    "dot",
    "test/**/*-test.js",
    "--ignore",
    "test/src/**/*-test.js",
]);

for (const file of [
    "test/src/behavior-test.js",
    "test/src/create-sandbox-test.js",
    "test/src/create-stub-instance-test.js",
    "test/src/extend-test.js",
    "test/src/fake-test.js",
    "test/src/fake-timers-test.js",
    "test/src/promise-test.js",
    "test/src/proxy-call-test.js",
    "test/src/proxy-test.js",
    "test/src/restore-object-test.js",
    "test/src/sinon-test.js",
    "test/src/spy-formatters-test.js",
    "test/src/util/core/color-test.js",
    "test/src/util/core/export-async-behaviors-test.js",
    "test/src/util/core/function-to-string-test.js",
    "test/src/util/core/get-next-tick-test.js",
    "test/src/util/core/next-tick-test.js",
    "test/src/util/core/times-in-words-test.js",
    "test/src/util/core/walk-object-test.js",
    "test/src/util/core/walk-test.js",
    "test/src/util/core/wrap-method-test.js",
]) {
    runMocha(["-R", "dot", file]);
}
