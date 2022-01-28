"use strict";
const configYmlPath = "docs/_config.yml";
const UTF8 = "utf8";

const fs = require("fs");
const yaml = require("js-yaml");
const semver = require("semver");
const releaseId = `v${require("../package.json").version}`;
const config = yaml.safeLoad(fs.readFileSync(configYmlPath, UTF8));

config.sinon.current_release = releaseId; // eslint-disable-line camelcase
config.sinon.current_major_version = semver.major(releaseId); // eslint-disable-line camelcase

fs.writeFileSync(configYmlPath, yaml.safeDump(config), UTF8);
