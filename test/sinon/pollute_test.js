/*jslint onevar: false*/
/*globals sinon buster require assert*/
/**
 * @author Mark Wise (markmediadude@gmail.com)
 * @license BSD
 *
 * Copyright (c) 2014 Mark Wise
 * Sinon.JS - Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

if (typeof require === "function" && typeof module === "object") {
    var buster = require("../runner");
    var sinon = require("../../lib/sinon");
}

buster.testCase("sinon.pollute", {
    tearDown: function () {
        sinon.pollute.purify()
    },

    "is defined": function () {
        assert.isFunction(sinon.pollute);
    },

    "should create Object.prototype.stub": function() {
        sinon.pollute();

        assert.isFunction(Object.prototype.stub);
    },

     "should create Object.prototype.spy": function() {
        sinon.pollute();

        assert.isFunction(Object.prototype.spy);
    }
});

buster.testCase("sinon.pollute.purify", {
    "is defined": function () {
        assert.isFunction(sinon.pollute.purify);
    },

    "should remove Object.prototype.stub": function() {
        sinon.pollute();
        sinon.pollute.purify();

        refute.defined(Object.prototype.stub);
    },

     "should remove Object.prototype.spy": function() {
        sinon.pollute();
        sinon.pollute.purify();

        refute.defined(Object.prototype.spy);
    }
});
