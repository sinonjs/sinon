/**
 * @depend ../sinon.js
 * @depend spy.js
 */
/*jslint eqeqeq: false, onevar: false, plusplus: false*/
/*global module, require, sinon*/
/**
 * Spy functions
 *
 * @author Shawn Krisman
 * @license BSD
 *
 * Copyright (c) 2012 Shawn Krisman
 */
"use strict";

(function (sinon) {
    var commonJSModule = typeof module == "object" && typeof require == "function";

    if (!sinon && commonJSModule) {
        sinon = require("../sinon");
    }

    if (!sinon) {
        return;
    }

    function spec(speccable) {
	var model = typeof speccable === "function" ? new speccable : speccable;
	var SpecClass = function () {};
	SpecClass.prototype = model;
	var specObj = new SpecClass();
	for (var prop in model) {
	    if (typeof specObj[prop] === "function") {
		specObj[prop] = sinon.spy();
	    }
	}
	return specObj;
    }

    if (commonJSModule) {
        module.exports = spec;
    } else {
        sinon.spec = spec;
    }
}(typeof sinon == "object" && sinon || null));
