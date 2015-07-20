(function (root) {
    "use strict";

    var buster = root.buster || require("buster"),
        sinon = root.sinon || require("../lib/sinon"),
        assert = buster.assert,
        refute = buster.refute;

    buster.testCase("sinon.fakeServer", {
        ".create": {
            "allows valid init settings" : function () {
                var server = sinon.fakeServer.create({
                    autoRespond: true
                });
                assert(
                    server.autoRespond,
                    "serve.create should accept whitelisted settings"
                );
            },
            "does not assign invalid settings": function () {
                var server = sinon.fakeServer.create({
                    foo: true
                });
                refute(
                    server.foo,
                    "server should not accept non-whitelisted settings"
                );
            }
        }
    });
}(this));
