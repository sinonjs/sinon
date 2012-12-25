/*jslint onevar: false, eqeqeq: false*/
/*globals window sinon buster*/
/**
 * @author Shawn Krisman
 * @license BSD
 *
 * Copyright (c) 2012 Shawn Krisman
 */
"use strict";

if (typeof require === "function" && typeof module === "object") {
    var buster = require("../runner");
    var sinon = require("../../lib/sinon");
}

(function () {
    buster.testCase("sinon.spec", {
        "throws an exception for a bad method call": function () {
	    var obj = {'realMethod': function() {}};
	    var spec = sinon.spec(obj);
	    assert.exception(function() {
		spec.fakeMethod();
	    });
	},
	"normal methods are just spies": function () {
	    var obj = {'realMethod': function() {}};
	    var spec = sinon.spec(obj);
	    spec.realMethod(3, 4);
	    assert(spec.realMethod.calledWith(3, 4));
	},
	"can make specs from new-able constructors": function () {
	    var Class = function(a, b, c) {
		this.a = a;
		this.b = b;
		this.c = c;
	    };
	    Class.prototype.method = function () {};

	    var spec = sinon.spec(Class);
	    refute.exception(spec.method);
	},
	"non-function properties on the class exist on the spec": function() {
	    var CONSTANT = "some constant";
	    var Class = function() {
		this.constant = CONSTANT;
	    };

	    var spec = sinon.spec(Class);
	    assert.equals(CONSTANT, spec.constant);
	},
    });
}());
