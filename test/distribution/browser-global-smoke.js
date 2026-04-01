/* eslint-disable no-process-exit, jsdoc/require-jsdoc */
const puppeteer = require("puppeteer");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const port = 3877;

const htmlWithGlobalScript = `
<!DOCTYPE html>
<html>
<head>
    <script src="/sinon.js"></script>
    <script>
    const assert = (condition, message) => {
        if (!condition) {
            throw new Error("Assertion failed: " + (message || "unspecified"));
        }
    };

    try {
        assert(typeof window.sinon === "object", "window.sinon should exist");
        assert(typeof window.sinon.spy === "function", "sinon.spy should be a function");
        assert(typeof window.sinon.stub === "function", "sinon.stub should be a function");
        assert(typeof window.sinon.createSandbox === "function", "sinon.createSandbox should be a function");

        const stub = window.sinon.stub().returns(10);
        assert(stub() === 10, "stub behavior check");

        const spy = window.sinon.spy();
        spy();
        assert(spy.callCount === 1, "spy behavior check");

        const sandbox = window.sinon.createSandbox();
        const fake = sandbox.stub().returns(7);
        assert(7 === fake(), "sandbox stub behavior check");
        sandbox.restore();

        console.log('sinon-result:works');
    } catch(err) {
        console.log('sinon-result:fails ' + err.message);
    }
    </script>
</head>
<body>
</body>
</html>
`;

const pkgDir = path.resolve(__dirname, "../../pkg/");
const sinonGlobal = fs.readFileSync(path.join(pkgDir, "sinon.js"));

async function evaluatePageContent() {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox"],
        executablePath: process.env.SINON_CHROME_BIN || null,
        headless: true,
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

    await page.goto("http://localhost:3877");
    setTimeout(() => die("No result within timeout."), 5000);
}

const app = http.createServer((req, res) => {
    let body, type;
    if (req.url === "/sinon.js") {
        body = sinonGlobal;
        type = "application/javascript";
    } else {
        body = htmlWithGlobalScript;
        type = "text/html";
    }
    res.writeHead(200, {
        "Content-Length": Buffer.byteLength(body),
        "Content-Type": type,
    });
    res.end(body);
});

app.listen(port, evaluatePageContent);
