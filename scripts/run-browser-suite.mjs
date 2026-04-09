import { execFileSync } from "node:child_process";
import puppeteer from "puppeteer";

const mode = process.argv[2];
const browserArgs = ["--no-sandbox"];

async function canLaunchBrowser() {
    const browser = await puppeteer.launch({
        args: browserArgs,
        headless: "new",
    });

    await browser.close();
}

try {
    await canLaunchBrowser();
} catch (err) {
    console.warn(`Skipping ${mode} browser suite: ${err.message}`);
    process.exit(0);
}

const mochifyArgs =
    mode === "webworker"
        ? [
              "mochify",
              "--driver",
              "puppeteer",
              "--serve",
              ".",
              "test/webworker/webworker-support-assessment.js",
          ]
        : ["mochify", "--driver", "puppeteer"];

execFileSync("npx", mochifyArgs, {
    stdio: "inherit",
});
