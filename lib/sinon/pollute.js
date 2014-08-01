/**
 * @depend ../sinon.js
 * @depend spy.js
 * @depend stub.js
 */
/*jslint eqeqeq: false, onevar: false*/
/*global module, require, sinon*/
/**
 * Pollute Object.prototype with stub and spy
 *
 * @author Mark Wise (markmediadude@gmail.com)
 * @license BSD
 *
 * Copyright (c) 2014 Mark Wise
 * Sinon.JS - Copyright (c) 2010-2013 Christian Johansen
 */
"use strict";

(function (sinon) {
    var commonJSModule = typeof module !== "undefined" && module.exports && typeof require == "function";

    if (!sinon && commonJSModule) {
        sinon = require("../sinon");
    }

    if (!sinon) {
        return;
    }

    function pollute() {
        if (!Object.prototype.hasOwnProperty("stub")) {
            Object.defineProperty(Object.prototype, "stub", {
                value: function(opts){
                    switch (typeof opts) {
                        case "string":
                            sinon.stub(this, opts);
                            break;
                        case "object":
                            for (method in opts) {
                                sinon.stub(this, method).returns(opts[method]);
                            }
                            break;
                    }
                    return null;
                },
                enumerable: false,
                configurable: true
            });
        }

        if (!Object.prototype.hasOwnProperty("spy")) {
            Object.defineProperty(Object.prototype, "spy", {
                value: function(method){
                    sinon.spy(this, method);
                    return null;
                },
                enumerable: false,
                configurable: true
            });
        }
    }


    function purify () {
        if (Object.prototype.hasOwnProperty("stub")) {
            delete Object.prototype.stub;
        }
        if (Object.prototype.hasOwnProperty("spy")) {
            delete Object.prototype.spy;
        }
    }


    sinon.pollute = pollute;
    sinon.pollute.purify = purify;

    if (typeof define === "function" && define.amd) {
        define(["module"], function(module) { module.exports = pollute; });
    } else if (commonJSModule) {
        module.exports = pollute;
    }
}(typeof sinon == "object" && sinon || null));
