import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import builtins from "rollup-plugin-node-builtins";
import globals from "rollup-plugin-node-globals";

const sinon = require("./lib/sinon.js");

export default {
    input: "./lib/sinon.js",
    output: {
        file: "pkg/sinon-esm.js",
        format: "es",
        outro: Object.keys(sinon).map((key) => `const _${key} = sinon.${key};\nexport { _${key} as ${key} };`).join('\n')
    },
    plugins: [
        nodeResolve({
            jsnext: true,
            main: true
        }),

        commonjs({
            // if false then skip sourceMap generation for CommonJS modules
            sourceMap: true // Default: true
        }),

        builtins(),
        globals()
    ]
};
