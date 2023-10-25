"use strict";

const arrayProto = require("@sinonjs/commons").prototypes.array;
const Sandbox = require("./sandbox");

const forEach = arrayProto.forEach;
const push = arrayProto.push;

function prepareSandboxFromConfig(config) {
    const sandbox = new Sandbox({ assertOptions: config.assertOptions });

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

/**
 * Customize the sandbox.
 * This is mostly an integration feature most users will not need
 *
 * @typedef {object} SandboxConfig
 * @property {string[]} properties The properties of the API to expose on the sandbox. Examples: ['spy', 'fake', 'restore']
 * @property {(object|null)} injectInto TBD
 * @property {boolean} useFakeTimers  whether timers are faked by default
 * @property {boolean} useFakeServer  whether XHR's are faked and the server feature enabled by default
 * @property {object} [assertOptions] see CreateAssertOptions in ./assert
 */
// This type def is really suffering from JSDoc not being
// able to reference types in other modules

/**
 * A configured sinon sandbox.
 *
 * @typedef {object} ConfiguredSinonSandboxType
 * @augments Sandbox
 * @property {string[]} injectedKeys the keys that have been injected (from config.injectInto)
 * @property {*} injectInto TBD
 * @property {*[]} args the arguments for the sandbox
 */

/**
 * @param config {SandboxConfig}
 * @returns {Sandbox}
 */
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
