/*jslint eqeqeq: false, onevar: false*/
/*global module, require*/
/**
 * Minimal Event interface implementation
 *
 * Original implementation by Sven Fuchs: https://gist.github.com/995028
 * Modifications and tests by Christian Johansen.
 *
 * @author Sven Fuchs (svenfuchs@artweb-design.de)
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2011 Sven Fuchs, Christian Johansen
 */
"use strict";

function Event(type, bubbles, cancelable, target) {
    this.initEvent(type, bubbles, cancelable, target);
};

Event.prototype = {
    initEvent: function(type, bubbles, cancelable, target) {
        this.type = type;
        this.bubbles = bubbles;
        this.cancelable = cancelable;
        this.target = target;
    },

    stopPropagation: function () {},

    preventDefault: function () {
        this.defaultPrevented = true;
    }
};

var EventTarget = {
    addEventListener: function addEventListener(event, listener, useCapture) {
        this.eventListeners = this.eventListeners || {};
        this.eventListeners[event] = this.eventListeners[event] || [];
        this.eventListeners[event].push(listener);
    },

    removeEventListener: function removeEventListener(event, listener, useCapture) {
        var listeners = this.eventListeners && this.eventListeners[event] || [];

        for (var i = 0, l = listeners.length; i < l; ++i) {
            if (listeners[i] == listener) {
                return listeners.splice(i, 1);
            }
        }
    },

    dispatchEvent: function dispatchEvent(event) {
        var type = event.type;
        var listeners = this.eventListeners && this.eventListeners[type] || [];

        for (var i = 0; i < listeners.length; i++) {
            if (typeof listeners[i] == "function") {
                listeners[i].call(this, event);
            } else {
                listeners[i].handleEvent(event);
            }
        }

        return !!event.defaultPrevented;
    }
};

exports.Event = Event;
exports.EventTarget = EventTarget;
