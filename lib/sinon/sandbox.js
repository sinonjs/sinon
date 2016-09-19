/**
 * Manages fake collections as well as fake utilities such as Sinon's
 * timers and fake XHR implementation in one convenient object.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

var extend = require("./extend");
var createInstance = require("./util/core/create");
var sinonCollection = require("./collection");
var sinonMatch = require("./match");
var sinonAssert = require("./assert");
var sinonClock = require("./util/fake_timers");
var fakeServer = require("./util/fake_server");
var fakeServerWithClock = require("./util/fake_server_with_clock");

var push = [].push;

var sinonSandbox = createInstance(sinonCollection);

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

function prepareSandboxFromConfig(config) {
    var sandbox = createInstance(sinonSandbox);

    if (config.useFakeServer) {
        if (typeof config.useFakeServer === "object") {
            sandbox.serverPrototype = config.useFakeServer;
        }

        sandbox.useFakeServer();
    }

    if (config.useFakeTimers) {
        if (typeof config.useFakeTimers === "object") {
            sandbox.useFakeTimers.apply(sandbox, config.useFakeTimers);
        } else {
            sandbox.useFakeTimers();
        }
    }

    return sandbox;
}

extend(sinonSandbox, {
    useFakeTimers: function useFakeTimers() {
        this.clock = sinonClock.useFakeTimers.apply(null, arguments);

        return this.add(this.clock);
    },

    serverPrototype: fakeServerWithClock,

    useFakeServer: function useFakeServer() {
        var proto = this.serverPrototype || fakeServer;

        if (!proto || !proto.create) {
            return null;
        }

        this.server = proto.create();
        return this.add(this.server);
    },

    inject: function (obj) {
        sinonCollection.inject.call(this, obj);

        if (this.clock) {
            obj.clock = this.clock;
        }

        if (this.server) {
            obj.server = this.server;
            obj.requests = this.server.requests;
        }

        obj.match = sinonMatch;

        return obj;
    },

    restore: function () {
        if (arguments.length) {
            throw new Error("sandbox.restore() does not take any parameters. Perhaps you meant stub.restore()");
        }

        sinonCollection.restore.apply(this, arguments);
        this.restoreContext();
    },

    restoreContext: function () {
        if (this.injectedKeys) {
            for (var i = 0, j = this.injectedKeys.length; i < j; i++) {
                delete this.injectInto[this.injectedKeys[i]];
            }
            this.injectedKeys = [];
        }
    },

    create: function (config) {
        if (!config) {
            return createInstance(sinonSandbox);
        }

        var sandbox = prepareSandboxFromConfig(config);
        sandbox.args = sandbox.args || [];
        sandbox.injectedKeys = [];
        sandbox.injectInto = config.injectInto;
        var prop,
            value;
        var exposed = sandbox.inject({});

        if (config.properties) {
            for (var i = 0, l = config.properties.length; i < l; i++) {
                prop = config.properties[i];
                value = exposed[prop] || prop === "sandbox" && sandbox;
                exposeValue(sandbox, config, prop, value);
            }
        } else {
            exposeValue(sandbox, config, "sandbox", value);
        }

        return sandbox;
    },

    match: sinonMatch,

    assert: sinonAssert
});

sinonSandbox.useFakeXMLHttpRequest = sinonSandbox.useFakeServer;

module.exports = sinonSandbox;
