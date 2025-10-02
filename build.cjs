#!/usr/bin/env node
"use strict";
/* eslint-disable @sinonjs/no-prototype-methods/no-prototype-methods */
const fs = require("node:fs");
const esbuild = require("esbuild");
const { umdWrapper } = require("esbuild-plugin-umd-wrapper");
const pkg = require("./package.json");
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

makeBundle(
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

makeBundle(
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

makeBundle(
    "./lib/sinon-esm.js",
    {
        format: "esm",
    },
    function (bundle) {
        var intro = "let sinon;";
        var outro = `\n${Object.keys(sinon)
            .map(function (key) {
                return `const _${key} = require_sinon().${key};\nexport { _${key} as ${key} };`;
            })
            .join("\n")}`;

        var script = intro + bundle + outro;
        fs.writeFileSync("pkg/sinon-esm.js", script);
    },
);
