(function (root) {
    "use strict";

    var buster = root.buster || require("buster");
    var sinon = root.sinon || require("../../../lib/sinon");
    var assert = buster.assert;

    buster.testCase("sinon.functionToString", {
        "returns function's displayName property": function () {
            var fn = function () {};
            fn.displayName = "Larry";

            assert.equals(sinon.functionToString.call(fn), "Larry");
        },

        "guesses name from last call's this object": function () {
            var obj = {};
            obj.doStuff = sinon.spy();
            obj.doStuff.call({});
            obj.doStuff();

            assert.equals(sinon.functionToString.call(obj.doStuff), "doStuff");
        },

        "guesses name from any call where property can be located": function () {
            var obj = {};
            var otherObj = { id: 42 };

            obj.doStuff = sinon.spy();
            obj.doStuff.call({});
            obj.doStuff();
            obj.doStuff.call(otherObj);

            assert.equals(sinon.functionToString.call(obj.doStuff), "doStuff");
        }
    });
}(this));
