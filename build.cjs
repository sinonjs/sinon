#!/usr/bin/env node
 
const fs = require("node:fs");
const { execFileSync } = require("node:child_process");
const esbuild = require("esbuild");
const { umdWrapper } = require("esbuild-plugin-umd-wrapper");
const pkg = require("./package.json");

// Step 1: Run Rollup to generate lib/ from src/
console.log("Generating lib/ from src/ using Rollup...");
execFileSync("npx", ["rollup", "-c", "rollup.config.mjs"], {
    stdio: "inherit",
});

// Step 1b: Mark the generated lib tree as CommonJS for Node.
fs.writeFileSync(
    "lib/package.json",
    JSON.stringify({ type: "commonjs" }, null, 2),
);

// Step 2: Load sinon from the generated lib
const sinon = require("./lib/sinon");

// YYYY-MM-DD
const date = new Date().toISOString().split("T")[0];

// Keep the preamble on one line to retain source maps
const preamble = `/* Sinon.JS ${pkg.version}, ${date}, @license BSD-3 */`;

try {
    fs.mkdirSync("pkg");
} catch (ignore) {
    // We seem to have it already
}

/**
 * @param entryPoint
 * @param config
 * @param done
 */
async function makeBundle(entryPoint, config, done) {
    const plugins = config.standalone
        ? [umdWrapper({ libraryName: config.standalone })]
        : [];

    const context = await esbuild.context({
        absWorkingDir: process.cwd(),
        banner: {
            js: preamble,
        },
        bundle: true,
        color: true,
        define: { "process.env.NODE_DEBUG": '""' },
        entryPoints: [entryPoint],
        external: ["timers", "timers/promises", "fs"],
        format: config.format,
        minify: false,
        platform: config.platform || "browser",
        plugins,
        sourcemap: config.debug === true ? "inline" : false,
        // target: "es2022",
        write: false,
    });

    const { outputFiles } = await context.rebuild();
    const js = outputFiles[0].text;

    context.dispose();

    done(js);
}

async function buildAll() {
    await makeBundle(
        "./lib/sinon.js",
        {
            // Add inline source maps to the default bundle
            debug: true,
            format: "cjs",
            // Create a UMD wrapper and install the "sinon" global:
            standalone: "sinon",
        },
        function (bundle) {
            fs.writeFileSync("pkg/sinon.js", bundle); // WebWorker can only load js files
        },
    );

    await makeBundle(
        "./lib/sinon.js",
        {
            format: "cjs",
            // Create a UMD wrapper and install the "sinon" global:
            standalone: "sinon",
        },
        function (bundle) {
            fs.writeFileSync("pkg/sinon-no-sourcemaps.cjs", bundle);
        },
    );

    await makeBundle(
        "./lib/sinon-esm.js",
        {
            format: "esm",
        },
        function (bundle) {
            var intro = "let sinon;\n";
            // Replace the bundle's own "export default" with a simple assignment to sinon
            var baseScript = bundle.replace(
                /export default [^;]+;/,
                "sinon = require_sinon_esm();\nif (sinon.default) sinon = sinon.default;",
            );

            var outro = `\nexport default sinon;\n${Object.keys(sinon)
                .filter((key) => key !== "default")
                .map(function (key) {
                    return `const _${key} = sinon.${key};\nexport { _${key} as ${key} };`;
                })
                .join("\n")}`;

            var script = intro + baseScript + outro;
            fs.writeFileSync("pkg/sinon-esm.js", script);
        },
    );
}

buildAll().catch((err) => {
    console.error(err);
    process.exit(1);
});
