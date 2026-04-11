import noPrototypeMethods from "@sinonjs/eslint-plugin-no-prototype-methods";
import sinonConfig from "@sinonjs/eslint-config";

export default [
    {
        ignores: [
            "eslint.config.js",
            "coverage/**",
            ".worktrees/**",
            "**/.worktrees/**",
            "out/**",
            "pkg/**",
            "lib/**",
            "tmp/**",
            "**/node_modules/**",
            "docs/_site/**",
            "docs/js/**",
            "docs/releases/**",
            "docs/_releases/**",
            "docs/assets/js/**",
            "docs/vendor/**",
            "vendor/**",
            "docs/release-source/release/examples/**",
            "rollup.config.js",
        ],
    },
    ...sinonConfig,
    {
        plugins: {
            "@sinonjs/no-prototype-methods": noPrototypeMethods,
        },
        rules: {
            "@sinonjs/no-prototype-methods/no-prototype-methods": "error",
            "jsdoc/require-param-type": "off",
            "jsdoc/require-jsdoc": "off",
            "jsdoc/tag-lines": "off",
        },
    },
    {
        files: [
            "src/**/*.js",
            "test/src/**/*.js",
            "*.mjs",
            "**/*.mjs",
            "scripts/**/*.mjs",
            "test/distribution/browser-global-smoke.js",
            "test/es2015/check-esm-bundle-is-runnable.js",
        ],
        languageOptions: {
            sourceType: "module",
        },
        rules: {
            "no-underscore-dangle": [
                "error",
                {
                    allow: ["__dirname"],
                },
            ],
        },
    },
    {
        files: ["test/webworker/webworker-support-assessment.js"],
        languageOptions: {
            globals: {
                describe: false,
                it: false,
                Worker: false,
            },
        },
    },
    {
        files: ["test/webworker/webworker-script.js"],
        languageOptions: {
            globals: {
                importScripts: false,
                onmessage: false,
                postMessage: false,
                sinon: false,
            },
        },
    },
    {
        files: [
            "build.cjs",
            "scripts/**/*.mjs",
            "test/distribution/browser-global-smoke.js",
            "test/es2015/check-esm-bundle-is-runnable.js",
        ],
        rules: {
            "no-console": "off",
            "no-implicit-globals": "off",
        },
    },
    {
        files: ["*.cjs"],
        languageOptions: {
            sourceType: "script",
        },
    },
    {
        files: ["**/*-test.js", "test/**/*.js"],
        rules: {
            "@sinonjs/no-prototype-methods/no-prototype-methods": "off",
            "max-nested-callbacks": "off",
        },
    },
    {
        files: ["**/*-tests.*"],
        rules: {
            "@sinonjs/no-prototype-methods/no-prototype-methods": "off",
            "max-nested-callbacks": "off",
        },
    },
    {
        files: ["test/src/shared-spy-stub-everything-tests.js"],
        rules: {
            "mocha/no-exports": "off",
        },
    },
    {
        files: [
            "src/sinon/util/core/walk-object.js",
            "src/sinon/util/core/walk.js",
        ],
        rules: {
            "no-implicit-globals": "off",
        },
    },
];
