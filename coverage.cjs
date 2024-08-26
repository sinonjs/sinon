"use strict";

const esbuild = require("esbuild");
const { esbuildPluginIstanbul } = require("esbuild-plugin-istanbul");

(async function () {
    const { default: getStdin } = await import("get-stdin");
    const plugins = [
        esbuildPluginIstanbul({
            filter: /\.js$/,
            loader: "js",
            name: "istanbul-loader-js",
        }),
    ];
    const stdin = {
        contents: await getStdin(),
        resolveDir: process.cwd(),
        sourcefile: "tests.js",
        loader: "js",
    };

    const context = await esbuild.context({
        absWorkingDir: process.cwd(),
        entryPoints: [],
        write: false,
        bundle: true,
        sourcemap: "inline",
        sourcesContent: true,
        define: { global: "window", "process.env.NODE_DEBUG": '""' },
        external: ["fs"],
        target: "es2022",
        plugins,
        color: true,
        stdin,
    });

    const { outputFiles } = await context.rebuild();
    const js = outputFiles[0].text;

    context.dispose();

    process.stdout.write(js);
})();
