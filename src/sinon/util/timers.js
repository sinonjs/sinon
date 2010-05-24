/*jslint indent: 2, eqeqeq: false, plusplus: false*/
/*global sinon, module, require*/
/**
 * Fake timer API
 * setTimeout
 * setInterval
 * clearTimeout
 * clearInterval
 * tick
 * reset
 * Date
 *
 * Partially inspired by jsUnitMockTimeOut from JsUnit
 *
 * @author Christian Johansen (christian@cjohansen.no)
 * http://cjohansen.no/sinon/time/
 */
if (typeof sinon == "undefined") {
  this.sinon = {};
}

sinon.clock = (function () {
  var id = 0;
  var timeouts = {};

  function addTimer(args, recurring) {
    if (args.length === 0) {
      throw new Error("Function requires at least 1 parameter");
    }

    var toId = id++;
    var delay = args[1] || 0;

    timeouts[toId] = {
      func: args[0],
      callAt: this.now + delay
    };

    if (recurring === true) {
      timeouts[toId].interval = delay;
    }

    return toId;
  }

  function runTimers(from, to) {
    var found, timer, prop;

    while (found !== 0) {
      found = 0;

      for (prop in timeouts) {
        if (timeouts.hasOwnProperty(prop)) {
          timer = timeouts[prop];

          if (timer.callAt >= from && timer.callAt <= to) {
            try {
              timer.func.call(null);
            } catch (e) {}

            if (typeof timer.interval == "number") {
              found += 1;
              timer.callAt += timer.interval;
            } else {
              delete timeouts[prop];
            }
          }
        }
      }
    }
  }

  return {
    now: 0,

    create: function create() {
      return this;
    },

    setTimeout: function setTimeout(callback, timeout) {
      return addTimer.call(this, arguments, false);
    },

    clearTimeout: function clearTimeout(id) {
      delete timeouts[id];
    },

    setInterval: function setInterval(callback, timeout) {
      return addTimer.call(this, arguments, true);
    },

    clearInterval: function clearInterval(id) {
      delete timeouts[id];
    },

    tick: function tick(ms) {
      runTimers(this.now, this.now + ms);
      this.now += ms;
    },

    reset: function reset() {
      timeouts = {};
    }
  };
}());

if (typeof module == "object" && typeof require == "function") {
  module.exports = sinon;
}
