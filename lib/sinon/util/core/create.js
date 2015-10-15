"use strict";

var Klass = function () {};

module.exports = function create(proto) {
    Klass.prototype = proto;
    return new Klass();
};
