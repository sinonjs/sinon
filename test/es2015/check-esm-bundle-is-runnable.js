/* eslint-disable no-process-exit, jsdoc/require-jsdoc */
const puppeteer = require("puppeteer");

const http = require("node:http");
const fs = require("node:fs");
const port = 3876;

const htmlWithModuleScript = `
<script type="module">
import sinon, { spy } from '/sinon-esm.js';

const assert = (result) => { if(!result) throw new Error("Failed test"); };

try {
    const stub = sinon.stub().returns(42);
    assert(42 === stub());

    const calledSpy = spy();
    calledSpy();
    assert(1 === calledSpy.callCount);

    console.log('sinon-result:works');
} catch(err) {
    console.log('sinon-result:fails Assertion incorrect' );
}
</script>
`;

// start server where our built sinon esm bundle resides
process.chdir(`${__dirname}/../../pkg/`);
const sinonModule = fs.readFileSync("./sinon-esm.js");

async function evaluatePageContent() {
    const browser = await puppeteer.launch({
        // https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#setting-up-chrome-linux-sandbox
        args: ["--no-sandbox"],
        // allow overriding chrome path
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
        throw err;
    });

    page.on("error", function (err) {
        throw err;
    });

    // our "assertion framework" :)
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

    setTimeout(() => die("No result within timeout."), 1000);
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
