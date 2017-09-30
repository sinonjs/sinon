"use strict";

var Sandbox = require("./sandbox");
var push = [].push;

function prepareSandboxFromConfig(config) {
    var sandbox = new Sandbox();

    if (config.useFakeServer) {
        if (typeof config.useFakeServer === "object") {
            sandbox.serverPrototype = config.useFakeServer;
        }

        sandbox.useFakeServer();
    }

    if (config.useFakeTimers) {
        if (typeof config.useFakeTimers === "object") {
            sandbox.useFakeTimers.call(sandbox, config.useFakeTimers);
        } else {
            sandbox.useFakeTimers();
        }
    }

    return sandbox;
}

function exposeValue(sandbox, config, key, value) {
    if (!value) {
        return;
    }

    if (config.injectInto && !(key in config.injectInto)) {
        config.injectInto[key] = value;
        sandbox.injectedKeys.push(key);
    } else {
        push.call(sandbox.args, value);
    }
}

function createSandbox(config) {
    if (!config) {
        return new Sandbox();
    }

    var configuredSandbox = prepareSandboxFromConfig(config);
    configuredSandbox.args = configuredSandbox.args || [];
    configuredSandbox.injectedKeys = [];
    configuredSandbox.injectInto = config.injectInto;
    var exposed = configuredSandbox.inject({});

    if (config.properties) {
        config.properties.forEach(function (prop) {
            var value = exposed[prop] || prop === "sandbox" && configuredSandbox;
            exposeValue(configuredSandbox, config, prop, value);
        });
    } else {
        exposeValue(configuredSandbox, config, "sandbox");
    }

    return configuredSandbox;
}

module.exports = createSandbox;
