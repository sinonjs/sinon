/*jslint eqeqeq: false, onevar: false, plusplus: false*/
/*global require, module*/
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

var sinon = require("./sinon");
var fakeServer = require("./util/fake_server");
//sinon.extend(sinon, require("./util/fake_timers"));

function exposeValue(sandbox, config, key, value) {
    if (!value) {
        return;
    }

    if (config.injectInto) {
        config.injectInto[key] = value;
    } else {
        sandbox.args.push(value);
    }
}

function prepareSandboxFromConfig(proto, config) {
    var sandbox = sinon.create(proto);

    if (config.useFakeServer) {
        if (typeof config.useFakeServer == "object") {
            sandbox.serverPrototype = config.useFakeServer;
        }

        sandbox.useFakeServer();
    }

    if (config.useFakeTimers) {
        if (typeof config.useFakeTimers == "object") {
            sandbox.useFakeTimers.apply(sandbox, config.useFakeTimers);
        } else {
            sandbox.useFakeTimers();
        }
    }

    return sandbox;
}

module.exports = function (globalSinon) {

    var proto = sinon.extend(sinon.create(globalSinon.collection), {

        useFakeTimers: function useFakeTimers() {
            this.clock = globalSinon.useFakeTimers.apply(null, arguments);

            return this.add(this.clock);
        },

        serverPrototype: fakeServer,

        useFakeServer: function useFakeServer() {
            var proto = this.serverPrototype || fakeServer;

            if (!proto || !proto.create) {
                return null;
            }

            this.server = proto.create();
            return this.add(this.server);
        },

        inject: function (obj) {
            globalSinon.collection.inject.call(this, obj);

            if (this.clock) {
                obj.clock = this.clock;
            }

            if (this.server) {
                obj.server = this.server;
                obj.requests = this.server.requests;
            }

            return obj;
        },

        create: function (config) {
            if (!config) {
                return sinon.create(proto);
            }

            var sandbox = prepareSandboxFromConfig(this, config);
            sandbox.args = sandbox.args || [];
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
        }

    });

    proto.useFakeXMLHttpRequest = proto.useFakeServer;

    return proto;
};
