"use strict";

var referee = require("@sinonjs/referee");
var createStub = require("../lib/sinon/stub");
var createStubInstance = require("../lib/sinon/create-stub-instance");
var assert = referee.assert;
var refute = referee.refute;

describe("createStubInstance", function () {
    it("stubs existing methods", function () {
        var Class = function () {
            return;
        };
        Class.prototype.method = function () {
            return;
        };

        var stub = createStubInstance(Class);
        stub.method.returns(3);
        assert.equals(3, stub.method());
    });

    it("throws with no methods to stub", function () {
        var Class = function () {
            return;
        };

        assert.exception(
            function () {
                createStubInstance(Class);
            },
            {
                message:
                    "Found no methods on object to which we could apply mutations",
            }
        );
    });

    it("doesn't call the constructor", function () {
        var Class = function (a, b) {
            var c = a + b;
            throw c;
        };
        Class.prototype.method = function () {
            return;
        };

        var stub = createStubInstance(Class);
        refute.exception(function () {
            stub.method(3);
        });
    });

    it("retains non function values", function () {
        var TYPE = "some-value";
        var Class = function () {
            return;
        };
        Class.prototype.method = function () {
            return;
        };
        Class.prototype.type = TYPE;

        var stub = createStubInstance(Class);
        assert.equals(TYPE, stub.type);
    });

    it("has no side effects on the prototype", function () {
        var proto = {
            method: function () {
                throw new Error("error");
            },
        };
        var Class = function () {
            return;
        };
        Class.prototype = proto;

        var stub = createStubInstance(Class);
        refute.exception(stub.method);
        assert.exception(proto.method);
    });

    it("throws exception for non function params", function () {
        var types = [{}, 3, "hi!"];

        for (var i = 0; i < types.length; i++) {
            // yes, it's silly to create functions in a loop, it's also a test
            // eslint-disable-next-line no-loop-func
            assert.exception(function () {
                createStubInstance(types[i]);
            });
        }
    });

    it("allows providing optional overrides", function () {
        var Class = function () {
            return;
        };
        Class.prototype.method = function () {
            return;
        };

        var stub = createStubInstance(Class, {
            method: createStub().returns(3),
        });

        assert.equals(3, stub.method());
    });

    it("allows providing optional returned values", function () {
        var Class = function () {
            return;
        };
        Class.prototype.method = function () {
            return;
        };

        var stub = createStubInstance(Class, {
            method: 3,
        });

        assert.equals(3, stub.method());
    });

    it("allows providing null as a return value", function () {
        var Class = function () {
            return;
        };
        Class.prototype.method = function () {
            return;
        };

        var stub = createStubInstance(Class, {
            method: null,
        });

        assert.equals(null, stub.method());
    });

    it("throws an exception when trying to override non-existing property", function () {
        var Class = function () {
            return;
        };
        Class.prototype.method = function () {
            return;
        };

        assert.exception(
            function () {
                createStubInstance(Class, {
                    foo: createStub().returns(3),
                });
            },
            { message: "Cannot stub foo. Property does not exist!" }
        );
    });
});
