/*jslint */
/*global module, require*/
/**
 * Sinon API.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

var sinon = require("./sinon/sinon");

sinon.spy = require("./sinon/spy");
sinon.spyCall = require("./sinon/call");
//sinon.behavior = require("./sinon/behavior");
sinon.expectation = require("./sinon/expectation")();
sinon.stub = require("./sinon/stub");
sinon.mock = require("./sinon/mock")(sinon.expectation);
sinon.assert = require("./sinon/assert");
sinon.match = require("./sinon/match");

var fakeTimers = require("./sinon/util/fake_timers");
sinon.clock = fakeTimers.clock;
sinon.useFakeTimers = fakeTimers.useFakeTimers;
sinon.timers = fakeTimers.timers;

sinon.collection = require("./sinon/collection")(sinon);
sinon.sandbox = require("./sinon/sandbox")(sinon);
sinon.test = require("./sinon/test")(sinon.sandbox);
sinon.testCase = require("./sinon/test_case")(sinon);

var fakeXHR = require("./sinon/util/fake_xml_http_request");
sinon.xhr = fakeXHR.xhr;
sinon.FakeXMLHttpRequest = fakeXHR.FakeXMLHttpRequest;
sinon.useFakeXMLHttpRequest = fakeXHR.useFakeXMLHttpRequest;

sinon.fakeServer = require("./sinon/util/fake_server");
sinon.fakeServerWithClock = require("./sinon/util/fake_server_with_clock");

sinon.createStubInstance = function (constructor) {
    if (typeof constructor !== "function") {
        throw new TypeError("The constructor should be a function.");
    }
    return sinon.stub(sinon.create(constructor.prototype));
};

function isRestorable(obj) {
    return typeof obj === "function" && typeof obj.restore === "function" && obj.restore.sinon;
}

sinon.restore = function (object) {
    if (object !== null && typeof object === "object") {
        for (var prop in object) {
            if (isRestorable(object[prop])) {
                object[prop].restore();
            }
        }
    }
    else if (isRestorable(object)) {
        object.restore();
    }
};

module.exports = sinon;
