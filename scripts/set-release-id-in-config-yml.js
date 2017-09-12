"use strict";
var configYmlPath = "docs/_config.yml";
var UTF8 = "utf8";

var fs = require("fs");
var yaml = require("js-yaml");
var releaseId = "v" + require("../package.json").version;
var config = yaml.safeLoad(fs.readFileSync(configYmlPath, UTF8));

config.sinon.current_release = releaseId; // eslint-disable-line camelcase

fs.writeFileSync(configYmlPath, yaml.safeDump(config), UTF8);
