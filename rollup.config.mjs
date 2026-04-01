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
    plugins: [
        nodeResolve(),
        commonjs(),
        json(),
    ],
    external: (id, parentId, isResolved) => {
        if (id.startsWith("src/") || path.isAbsolute(id)) {
            return false;
        }
        if (parentId && (id.startsWith(".") || id.startsWith("/"))) {
            let resolvedPath = path.resolve(path.dirname(parentId), id);
            if (!resolvedPath.endsWith(".js")) resolvedPath += ".js";
            if (!fs.existsSync(resolvedPath)) {
                return true;
            }
            return false;
        }
        return true;
    },
};
