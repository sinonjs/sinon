(function (root) {
    "use strict";

    var buster = root.buster || require("buster"),
        sinon = root.sinon || require("../lib/sinon"),
        assert = buster.assert,
        refute = buster.refute;

    buster.testCase("sinon.fakeServer", {
        ".create": {
            "allows the 'autoRespond' setting" : function () {
                var server = sinon.fakeServer.create({
                    autoRespond: true
                });
                assert(
                    server.autoRespond,
                    "fakeServer.create should accept 'autoRespond' setting"
                );
            },
            "allows the 'autoRespondAfter' setting" : function () {
                var server = sinon.fakeServer.create({
                    autoRespond: true
                });
                assert(
                    server.autoRespond,
                    "fakeServer.create should accept 'autoRespondAfter' setting"
                );
            },
            "allows the 'respondImmediately' setting" : function () {
                var server = sinon.fakeServer.create({
                    autoRespond: true
                });
                assert(
                    server.autoRespond,
                    "fakeServer.create should accept 'respondImmediately' setting"
                );
            },
            "allows the 'fakeHTTPMethods' setting" : function () {
                var server = sinon.fakeServer.create({
                    autoRespond: true
                });
                assert(
                    server.autoRespond,
                    "fakeServer.create should accept 'fakeHTTPMethods' setting"
                );
            },
            "does not assign a non-whitelisted setting": function () {
                var server = sinon.fakeServer.create({
                    foo: true
                });
                refute(
                    server.foo,
                    "fakeServer.create should not accept 'foo' settings"
                );
            }
        }
    });
}(this));
