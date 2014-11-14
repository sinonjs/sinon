"use strict";
exports.getName = function functionName(func) {
    var name = func.displayName || func.name;

    // Use function decomposition as a last resort to get function
    // name. Does not rely on function decomposition to work - if it
    // doesn't debugging will be slightly less informative
    // (i.e. toString will say 'spy' rather than 'myFunc').
    if (!name) {
        var matches = func.toString().match(/function ([^\s\(]+)/);
        name = matches && matches[1];
    }

    return name;
};

exports.toString = function toString() {
    if (this.getCall && this.callCount) {
        var thisValue, prop, i = this.callCount;

        while (i--) {
            thisValue = this.getCall(i).thisValue;

            for (prop in thisValue) {
                if (thisValue[prop] === this) {
                    return prop;
                }
            }
        }
    }

    return this.displayName || "sinon fake";
};

exports.create = function create(proto) {
    var F = function () {};
    F.prototype = proto;
    return new F();
};
