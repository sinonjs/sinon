#!/usr/bin/env nodejs
/*
 * Purpose: update/align our docs and our .browserlistrc file
 *      so that we do not spread out-of-date information
 * Background: https://github.com/sinonjs/sinon/pull/2366
 */

"use strict";

const shell = require("shelljs");
const readline = require("readline");
const fs = require("fs");
const root = `${__dirname}/..`;
const sourceFile = `${root}/node_modules/@sinonjs/eslint-config/.browserslistrc`;
const compatibilityPath = `${root}/COMPATIBILITY.md`;
const debug = require("debug")("update-compatibility");

debug(
    "Copy browserslistrc file to root for running our own linting using compat/compat"
);
shell.cp(sourceFile, root);

debug(
    `Inline browserslistrc file into ${compatibilityPath} to keep contents in-sync`
);
const rl = readline.createInterface({
    input: fs.createReadStream(compatibilityPath),
});

let changeLogData = "";

/* eslint-disable jsdoc/require-jsdoc, @sinonjs/no-prototype-methods/no-prototype-methods */
function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
}

const NOOP = {};
const processLine = (() => {
    let state;
    const STATES = {
        BEFORE: (line) => {
            if (line.search("browserslist start") > -1) {
                state = STATES.IN;
            }

            return line;
        },
        IN: (line) => {
            if (line.search("browserslist end") > -1) {
                state = STATES.AFTER;
                // newlines following Prettier's formatting
                return `\n\`\`\`\n${fs.readFileSync(
                    sourceFile
                )}\`\`\`\n\n${line}`;
            }
            return NOOP;
        },
        AFTER: (line) => line,
    };
    state = STATES.BEFORE;
    return (line) => {
        debug(`current state: ${getKeyByValue(STATES, state)}`);
        debug(`current line input:  '${line}'`);
        const val = state(line);
        debug(`current line output: '${val}'`);
        return val;
    };
})();

rl.on("line", (line) => {
    const output = processLine(line);
    changeLogData += output === NOOP ? "" : `${output}\n`;
});

rl.on("close", function () {
    debug(`Updated file content:\n${changeLogData}`);
    if (process.env.DRY_RUN) {
        return;
    }
    fs.writeFileSync(compatibilityPath, changeLogData);
});
