"use strict";

const arrayProto = require("@sinonjs/commons").prototypes.array;
const Sandbox = require("./sandbox");

const forEach = arrayProto.forEach;
const push = arrayProto.push;

function prepareSandboxFromConfig(config) {
    const sandbox = new Sandbox();

    if (config.useFakeServer) {
        if (typeof config.useFakeServer === "object") {
            sandbox.serverPrototype = config.useFakeServer;
        }

        sandbox.useFakeServer();
    }

    if (config.useFakeTimers) {
        if (typeof config.useFakeTimers === "object") {
            sandbox.useFakeTimers(config.useFakeTimers);
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
        push(sandbox.injectedKeys, key);
    } else {
        push(sandbox.args, value);
    }
}

function createSandbox(config) {
    if (!config) {
        return new Sandbox();
    }

    const configuredSandbox = prepareSandboxFromConfig(config);
    configuredSandbox.args = configuredSandbox.args || [];
    configuredSandbox.injectedKeys = [];
    configuredSandbox.injectInto = config.injectInto;
    const exposed = configuredSandbox.inject({});

    if (config.properties) {
        forEach(config.properties, function (prop) {
            const value =
                exposed[prop] || (prop === "sandbox" && configuredSandbox);
            exposeValue(configuredSandbox, config, prop, value);
        });
    } else {
        exposeValue(configuredSandbox, config, "sandbox");
    }

    return configuredSandbox;
}

module.exports = createSandbox;
