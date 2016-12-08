"use strict";
var configYmlPath = "docs/_config.yml";
var UTF8 = "utf8";

var fs = require("fs");
var yaml = require("js-yaml");
var releaseId = "v" + require("../package.json").version;

var isNextRelease = releaseId.includes("pre");
var releaseKey = isNextRelease ? "next_release" : "current_release";

var config = yaml.safeLoad(fs.readFileSync(configYmlPath, UTF8));

config.sinon[releaseKey] = releaseId;

fs.writeFileSync(configYmlPath, yaml.safeDump(config), UTF8);
