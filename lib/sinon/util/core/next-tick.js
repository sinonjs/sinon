'use strict';

var commons = require('@sinonjs/commons');
var getNextTick = require('./get-next-tick.js');

/**
 * A platform-agnostic next-tick function.
 */
var nextTick = getNextTick(commons.global.process, commons.global.setImmediate);

module.exports = nextTick;
