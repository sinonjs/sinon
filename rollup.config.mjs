import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import fs from "node:fs";
import path from "node:path";

function getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllFiles(filePath, fileList);
        } else if (filePath.endsWith(".js")) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

export default {
    input: getAllFiles("src"),
    output: {
        dir: "lib",
        format: "cjs",
        preserveModules: true,
        preserveModulesRoot: "src",
        exports: "auto",
        interop: "auto",
    },
    plugins: [nodeResolve(), commonjs(), json()],
    external: (id, parentId) => {
        if (id.startsWith("node:")) {
            return true;
        }

        // Resolve the path if possible
        let resolvedPath;
        if (id.startsWith("src/")) {
            resolvedPath = path.resolve(process.cwd(), id);
        } else if (path.isAbsolute(id)) {
            resolvedPath = id;
        } else if (id.startsWith(".")) {
            resolvedPath = path.resolve(
                parentId ? path.dirname(parentId) : ".",
                id,
            );
        } else {
            // Named imports (node_modules) are external
            return true;
        }

        const srcPath = path.resolve(process.cwd(), "src");
        if (resolvedPath.startsWith(srcPath)) {
            // It's inside src/.
            // If it's an entry point (no parentId), we must treat it as NOT external.
            if (!parentId) {
                return false;
            }

            // For other files, check if they exist in src/
            const exists =
                fs.existsSync(resolvedPath) ||
                fs.existsSync(`${resolvedPath}.js`) ||
                fs.existsSync(`${resolvedPath}.mjs`);

            if (exists) {
                return false;
            } // Exists in src/, so transpile it

            // Doesn't exist in src/, so it must be a relative import to a file
            // that we haven't ported yet, but will exist in lib/.
            return true;
        }

        // Everything else (outside src/) is external
        return true;
    },
};
