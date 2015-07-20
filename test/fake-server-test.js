(function (root) {
    "use strict";

    var buster = root.buster || require("buster"),
        sinon = root.sinon || require("../lib/sinon"),
        assert = buster.assert,
        refute = buster.refute;

    buster.testCase("sinon.fakeServer", {
        ".create": {
            "allows 'autoRespond' init settings" : function () {
                var server = sinon.fakeServer.create({
                    autoRespond: true
                });
                assert(
                    server.autoRespond,
                    "fakeServer.create should accept 'autoRespond' setting"
                );
            },
            "allows 'autoRespondAfter' init settings" : function () {
                var server = sinon.fakeServer.create({
                    autoRespond: true
                });
                assert(
                    server.autoRespond,
                    "fakeServer.create should accept 'autoRespondAfter' setting"
                );
            },
            "allows 'respondImmediately' init settings" : function () {
                var server = sinon.fakeServer.create({
                    autoRespond: true
                });
                assert(
                    server.autoRespond,
                    "fakeServer.create should accept 'respondImmediately' setting"
                );
            },
            "allows 'fakeHTTPMethods' init settings" : function () {
                var server = sinon.fakeServer.create({
                    autoRespond: true
                });
                assert(
                    server.autoRespond,
                    "fakeServer.create should accept 'fakeHTTPMethods' setting"
                );
            },
            "does not assign non-whitelisted settings": function () {
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
