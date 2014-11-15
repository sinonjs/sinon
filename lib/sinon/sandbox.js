"use strict";
var fn = require("./functions");
var extend = require("./extend");
var collection = require("./collection");
var useFakeTimers = require("./util/fake_timers");
var match = require("./match");

var push = [].push;

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
    var sandbox = fn.create(module.exports);

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

module.exports = extend(fn.create(collection), {
    useFakeTimers: function () {
        this.clock = useFakeTimers.apply(null, arguments);

        return this.add(this.clock);
    },

    serverPrototype: {}, // TODO: sinon.fakeServer,

    useFakeServer: function useFakeServer() {
        var proto = this.serverPrototype || sinon.fakeServer;

        if (!proto || !proto.create) {
            return null;
        }

        this.server = proto.create();
        return this.add(this.server);
    },

    inject: function (obj) {
        collection.inject.call(this, obj);

        if (this.clock) {
            obj.clock = this.clock;
        }

        if (this.server) {
            obj.server = this.server;
            obj.requests = this.server.requests;
        }

        obj.match = match;

        return obj;
    },

    restore: function () {
        collection.restore.apply(this, arguments);
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
            return fn.create(module.exports);
        }

        var sandbox = prepareSandboxFromConfig(config);
        sandbox.args = sandbox.args || [];
        sandbox.injectedKeys = [];
        sandbox.injectInto = config.injectInto;
        var prop, value, exposed = sandbox.inject({});

        if (config.properties) {
            for (var i = 0, l = config.properties.length; i < l; i++) {
                prop = config.properties[i];
                value = exposed[prop] || prop == "sandbox" && sandbox;
                exposeValue(sandbox, config, prop, value);
            }
        } else {
            exposeValue(sandbox, config, "sandbox", value);
        }

        return sandbox;
    },

    match: match
});

// WHAAAA?
// sinon.sandbox.useFakeXMLHttpRequest = sinon.sandbox.useFakeServer;
