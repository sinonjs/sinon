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
    var toCall = [];
    var timer, callAt;

    for (var prop in timeouts) {
      if (timeouts.hasOwnProperty(prop)) {
        timer = timeouts[prop];

        if (timer.callAt >= from && timer.callAt <= to) {
          toCall.push(timer);

          if (typeof timer.interval == "number") {
            timer.callAt += timer.interval;
          } else {
            delete timeouts[prop];
          }
        }
      }
    }

    for (var i = 0, l = toCall.length; i < l; i++) {
      try {
        toCall[i].func.call(null);
      } catch (e) {}
    }

    if (toCall.length > 0) {
      runTimers(from, to);
    }
  }

  return {
    now: 0,

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
