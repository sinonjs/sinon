/* eslint-disable no-process-exit, jsdoc/require-jsdoc */
import puppeteer from "puppeteer";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = 3876;

const htmlWithModuleScript = `
<script type="module">
import sinon, { spy, stub, createSandbox } from '/sinon-esm.js';

const assert = (condition, message) => {
    if (!condition) {
        throw new Error("Assertion failed: " + (message || "unspecified"));
    }
};

try {
    // Default and named imports agree
    assert(sinon.spy === spy, "default and named spy should be identical");
    assert(sinon.stub === stub, "default and named stub should be identical");
    assert(sinon.createSandbox === createSandbox, "default and named createSandbox should be identical");

    // Default import works
    assert(typeof sinon === "object", "sinon should be an object");
    assert(typeof sinon.stub === "function", "sinon.stub should be a function");

    // Named imports work
    assert(typeof spy === "function", "spy named import should be a function");
    assert(typeof stub === "function", "stub named import should be a function");
    assert(typeof createSandbox === "function", "createSandbox named import should be a function");

    // Basic behavior
    const s = stub().returns(42);
    assert(s() === 42, "stub behavior check");

    const sp = spy();
    sp();
    assert(sp.callCount === 1, "spy behavior check");

    // Sandbox behavior
    const sandbox = createSandbox();
    const fake = sandbox.stub().returns(7);
    assert(7 === fake(), "sandbox stub behavior check");
    sandbox.restore();

    console.log('sinon-result:works');
} catch(err) {
    console.log('sinon-result:fails ' + err.message);
}
</script>
`;

const pkgDir = path.resolve(__dirname, "../../pkg/");
const sinonModule = fs.readFileSync(path.join(pkgDir, "sinon-esm.js"));

async function evaluatePageContent() {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox"],
        executablePath: process.env.SINON_CHROME_BIN || null,
        headless: "new",
    });
    const page = await browser.newPage();

    function die(reason) {
        if (reason) {
            /* eslint-disable-next-line no-console */
            console.error(reason);
        }

        browser.close();
        process.exit(1);
    }

    page.on("pageerror", function (err) {
        die(err.message);
    });

    page.on("error", function (err) {
        die(err.message);
    });

    page.on("console", function (msg) {
        const text = msg.text();

        if (text.startsWith("sinon-result:works")) {
            browser.close();
            process.exit(0);
        } else if (text.startsWith("sinon-result:fails")) {
            die(text);
        }
    });

    await page.goto("http://localhost:3876");

    setTimeout(() => die("No result within timeout."), 5000);
}

const app = http.createServer((req, res) => {
    let body, type;

    if (req.url.match(/sinon-esm\.js/)) {
        body = sinonModule;
        type = "application/javascript";
    } else {
        body = htmlWithModuleScript;
        type = "text/html";
    }

    const headers = {
        "Content-Length": Buffer.byteLength(body),
        "Content-Type": type,
    };
    res.writeHead(200, headers);
    res.end(body);
});

app.listen(port, evaluatePageContent);
