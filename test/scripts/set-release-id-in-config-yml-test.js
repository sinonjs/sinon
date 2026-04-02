const assert = require("@sinonjs/referee").assert;

describe("set-release-id-in-config-yml", function () {
    it("updates current release and major version in a config file", function () {
        if (typeof window !== "undefined") {
            this.skip();
        }

        const nodeRequire = module.require.bind(module);
        const childProcess = nodeRequire("child_process");
        const fs = nodeRequire("fs");
        const os = nodeRequire("os");
        const path = nodeRequire("path");
        const packageJsonPath = path.resolve(
            __dirname,
            "../..",
            "package.json",
        );
        const expectedRelease = `v${
            JSON.parse(fs.readFileSync(packageJsonPath, "utf8")).version
        }`;

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

        assert.match(written, `current_release: ${expectedRelease}`);
        assert.match(written, /current_major_version: 21/);
    });
});
