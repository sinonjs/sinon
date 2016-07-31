/**
 * Sinon core utilities. For internal use only.
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

var match = require("./sinon/match");
var deepEqual = require("./sinon/util/core/deep-equal");
var deprecated = require("./sinon/util/core/deprecated");
var objectKeys = require("./sinon/util/core/object-keys");

function exposeCoreUtils(target, utils) {
    var keys = objectKeys(utils);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = utils[key];

        // allow deepEqual to check equality of matchers through dependency injection. Otherwise we get a circular
        // dependency
        if (key === "deepEqual") {
            value = deepEqual.use(match);
        }
        if (typeof value === "function") {
            value = deprecated.wrap(value, deprecated.defaultMsg(key));
        }
        target[key] = value;
    }
}

function exposeEventTarget(target, eventTarget) {
    var keys = objectKeys(eventTarget);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        target[key] = deprecated.wrap(eventTarget[key], deprecated.defaultMsg("EventTarget"));
    }
}

// Expose internal utilities on `sinon` global for backwards compatability.
exposeCoreUtils(exports, require("./sinon/util/core/index"));

// TODO move these two into util/core.
exports.extend = deprecated.wrap(require("./sinon/extend"), deprecated.defaultMsg("extend"));
exports.typeOf = deprecated.wrap(require("./sinon/typeOf"), deprecated.defaultMsg("typeOf"));

exports.assert = require("./sinon/assert");
exports.collection = require("./sinon/collection");
exports.match = match;
exports.spy = require("./sinon/spy");
exports.spyCall = require("./sinon/call");
exports.stub = require("./sinon/stub");
exports.mock = require("./sinon/mock");
exports.sandbox = require("./sinon/sandbox");
exports.expectation = require("./sinon/mock-expectation");
exports.createStubInstance = require("./sinon/stub").createStubInstance;

var fakeTimers = require("./sinon/util/fake_timers");
exports.useFakeTimers = fakeTimers.useFakeTimers;
exports.clock = fakeTimers.clock;
exports.timers = fakeTimers.timers;

var event = require("./sinon/util/event");
exports.Event = deprecated.wrap(event.Event, deprecated.defaultMsg("Event"));
exports.CustomEvent = deprecated.wrap(event.CustomEvent, deprecated.defaultMsg("CustomEvent"));
exports.ProgressEvent = deprecated.wrap(event.ProgressEvent, deprecated.defaultMsg("ProgressEvent"));
exports.EventTarget = {};
exposeEventTarget(exports.EventTarget, event.EventTarget);

var fakeXdr = require("./sinon/util/fake_xdomain_request");
exports.xdr = fakeXdr.xdr;
exports.FakeXDomainRequest = fakeXdr.FakeXDomainRequest;
exports.useFakeXDomainRequest = fakeXdr.useFakeXDomainRequest;

var fakeXhr = require("./sinon/util/fake_xml_http_request");
exports.xhr = fakeXhr.xhr;
exports.FakeXMLHttpRequest = fakeXhr.FakeXMLHttpRequest;
exports.useFakeXMLHttpRequest = fakeXhr.useFakeXMLHttpRequest;

exports.fakeServer = require("./sinon/util/fake_server");
exports.fakeServerWithClock = require("./sinon/util/fake_server_with_clock");

