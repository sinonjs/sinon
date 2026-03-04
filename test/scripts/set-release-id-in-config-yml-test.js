"use strict";

const assert = require("@sinonjs/referee").assert;
const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

describe("set-release-id-in-config-yml", function () {
    it("updates current release and major version in a config file", function () {
        const fixtureDir = fs.mkdtempSync(
            path.join(os.tmpdir(), "sinon-release-config-"),
        );
        const configPath = path.join(fixtureDir, "_config.yml");

        fs.writeFileSync(
            configPath,
            [
                "sinon:",
                "  current_release: v0.0.0",
                "  current_major_version: 0",
                "",
            ].join("\n"),
            "utf8",
        );

        childProcess.execFileSync(
            process.execPath,
            [
                path.resolve(
                    __dirname,
                    "../../scripts/set-release-id-in-config-yml.cjs",
                ),
            ],
            {
                cwd: path.resolve(__dirname, "../.."),
                env: {
                    ...process.env,
                    SINON_DOCS_CONFIG_PATH: configPath,
                },
            },
        );

        const written = fs.readFileSync(configPath, "utf8");

        assert.match(written, /current_release: v21\.0\.2/);
        assert.match(written, /current_major_version: 21/);
    });
});
