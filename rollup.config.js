import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import builtins from "rollup-plugin-node-builtins";

export default {
    input: "./lib/sinon.js",
    output: {
        file: "pkg/sinon-esm.js",
        format: "es"
    },
    plugins: [
        builtins(),
        nodeResolve({
            jsnext: true,
            main: true
        }),

        commonjs({
            // if false then skip sourceMap generation for CommonJS modules
            sourceMap: true // Default: true
        })
    ]
};
