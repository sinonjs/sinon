"use strict";

var fakeServer = require("./fake_server");
var fakeTimers = require("./fake_timers");

function Server() {}
Server.prototype = fakeServer;

var fakeServerWithClock = new Server();

fakeServerWithClock.addRequest = function addRequest(xhr) {
    if (xhr.async) {
        if (typeof setTimeout.clock === "object") {
            this.clock = setTimeout.clock;
        } else {
            this.clock = fakeTimers.useFakeTimers();
            this.resetClock = true;
        }

        if (!this.longestTimeout) {
            var clockSetTimeout = this.clock.setTimeout;
            var clockSetInterval = this.clock.setInterval;
            var server = this;

            this.clock.setTimeout = function (fn, timeout) {
                server.longestTimeout = Math.max(timeout, server.longestTimeout || 0);

                return clockSetTimeout.apply(this, arguments);
            };

            this.clock.setInterval = function (fn, timeout) {
                server.longestTimeout = Math.max(timeout, server.longestTimeout || 0);

                return clockSetInterval.apply(this, arguments);
            };
        }
    }

    return fakeServer.addRequest.call(this, xhr);
};

fakeServerWithClock.respond = function respond() {
    var returnVal = fakeServer.respond.apply(this, arguments);

    if (this.clock) {
        this.clock.tick(this.longestTimeout || 0);
        this.longestTimeout = 0;

        if (this.resetClock) {
            this.clock.restore();
            this.resetClock = false;
        }
    }

    return returnVal;
};

fakeServerWithClock.restore = function restore() {
    if (this.clock) {
        this.clock.restore();
    }

    return fakeServer.restore.apply(this, arguments);
};

module.exports = fakeServerWithClock;
