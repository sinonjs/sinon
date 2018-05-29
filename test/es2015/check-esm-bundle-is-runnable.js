/* eslint-disable no-process-exit */
const puppeteer = require("puppeteer");

const http = require("http");
const fs = require("fs");
const port = 3876;

const htmlWithModuleScript = `
<script type="module">
import sinon from '/sinon-esm.js';

const assert = (result) => { if(!result) throw new Error(); };

try {
    const stub = sinon.stub().returns(42);
    assert(42 === stub());
    console.log('sinon-result:works');
} catch(err) {
    console.log('sinon-result:fails');
}
</script>
`;

// start server where our built sinon esm bundle resides
process.chdir(`${__dirname}/../../pkg/`);
const sinonModule = fs.readFileSync("./sinon-esm.js");

async function evaluatePageContent() {
    // https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-on-travis-ci
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
    const page = await browser.newPage();

    page.on("error", function (err) {
        throw err;
    });

    // our "assertion framework" :)
    page.on("console", function (msg) {
        var text = msg.text();

        if (text.startsWith("sinon-result:works")) {
            browser.close();
            process.exit(0);
        } else if (text.startsWith("sinon-result:fails")) {
            browser.close();
            process.exit(1);
        }
    });

    await page.goto("http://localhost:3876");
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
        "Content-Type": type
    };
    res.writeHead(200, headers);
    res.end(body);
});

app.listen(port, evaluatePageContent);
