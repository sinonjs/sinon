 
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgDir = path.resolve(__dirname, "../../pkg/");
const sinonGlobal = fs.readFileSync(path.join(pkgDir, "sinon.js"), "utf8");

const assert = (condition, message) => {
    if (!condition) {
        throw new Error(`Assertion failed: ${message || "unspecified"}`);
    }
};

const context = vm.createContext({
    console,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    window: null,
    self: null,
});

context.window = context;
context.self = context;

vm.runInContext(sinonGlobal, context, { filename: "sinon.js" });

assert(typeof context.sinon === "object", "window.sinon should exist");
assert(
    typeof context.sinon.spy === "function",
    "sinon.spy should be a function",
);
assert(
    typeof context.sinon.stub === "function",
    "sinon.stub should be a function",
);
assert(
    typeof context.sinon.createSandbox === "function",
    "sinon.createSandbox should be a function",
);

const stub = context.sinon.stub().returns(10);
assert(stub() === 10, "stub behavior check");

const spy = context.sinon.spy();
spy();
assert(spy.callCount === 1, "spy behavior check");

const sandbox = context.sinon.createSandbox();
const fake = sandbox.stub().returns(7);
assert(fake() === 7, "sandbox stub behavior check");
sandbox.restore();
