'use strict';

var walkObject = require('./util/core/walk-object.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var walkObject__default = /*#__PURE__*/_interopDefault(walkObject);

function filter(object, property) {
    return object[property].restore && object[property].restore.sinon;
}

function restore(object, property) {
    object[property].restore();
}

function restoreObject(object) {
    return walkObject__default.default(restore, object, filter);
}

module.exports = restoreObject;
