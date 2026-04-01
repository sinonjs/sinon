import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default {
    input: [
        "src/sinon.js",
        "src/sinon-esm.js",
        "src/create-sinon-api.js",
    ],
    output: {
        dir: "lib",
        format: "cjs",
        preserveModules: true,
        preserveModulesRoot: "src",
        exports: "auto",
        interop: "auto",
    },
    plugins: [
        nodeResolve(),
        commonjs(),
        json(),
    ],
    external: (id) => {
        if (id.includes("src/sinon.js") || id.includes("src/sinon-esm.js") || id.includes("src/create-sinon-api.js")) {
            return false;
        }
        // Mark dependencies as external in the CJS build
        // to keep them as require() calls in lib/
        return !id.startsWith(".") && !id.startsWith("/");
    },
};
