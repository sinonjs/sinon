 
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgDir = path.resolve(__dirname, "../../pkg/");
const sinonModule = fs.readFileSync(path.join(pkgDir, "sinon-esm.js"), "utf8");

const assert = (condition, message) => {
    if (!condition) {
        throw new Error(`Assertion failed: ${message || "unspecified"}`);
    }
};

const moduleUrl = `data:text/javascript;charset=utf-8,${encodeURIComponent(sinonModule)}`;
const module = await import(moduleUrl);
const sinon = module.default;
const { spy, stub, createSandbox } = module;

// Default and named imports agree
assert(sinon.spy === spy, "default and named spy should be identical");
assert(sinon.stub === stub, "default and named stub should be identical");
assert(
    sinon.createSandbox === createSandbox,
    "default and named createSandbox should be identical",
);

// Default import works
assert(typeof sinon === "object", "sinon should be an object");
assert(typeof sinon.stub === "function", "sinon.stub should be a function");

// Named imports work
assert(typeof spy === "function", "spy named import should be a function");
assert(typeof stub === "function", "stub named import should be a function");
assert(
    typeof createSandbox === "function",
    "createSandbox named import should be a function",
);

// Basic behavior
const s = stub().returns(42);
assert(s() === 42, "stub behavior check");

const sp = spy();
sp();
assert(sp.callCount === 1, "spy behavior check");

// Sandbox behavior
const sandbox = createSandbox();
const fake = sandbox.stub().returns(7);
assert(fake() === 7, "sandbox stub behavior check");
sandbox.restore();
