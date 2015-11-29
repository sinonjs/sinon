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

var push = [].push;

function Event(type, bubbles, cancelable, target) {
    this.initEvent(type, bubbles, cancelable, target);
}

Event.prototype = {
    initEvent: function (type, bubbles, cancelable, target) {
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

function ProgressEvent(type, progressEventRaw, target) {
    this.initEvent(type, false, false, target);
    this.loaded = typeof progressEventRaw.loaded === "number" ? progressEventRaw.loaded : null;
    this.total = typeof progressEventRaw.total === "number" ? progressEventRaw.total : null;
    this.lengthComputable = !!progressEventRaw.total;
}

ProgressEvent.prototype = new Event();

ProgressEvent.prototype.constructor = ProgressEvent;

function CustomEvent(type, customData, target) {
    this.initEvent(type, false, false, target);
    this.detail = customData.detail || null;
}

CustomEvent.prototype = new Event();

CustomEvent.prototype.constructor = CustomEvent;

var EventTarget = {
    addEventListener: function addEventListener(event, listener) {
        this.eventListeners = this.eventListeners || {};
        this.eventListeners[event] = this.eventListeners[event] || [];
        push.call(this.eventListeners[event], listener);
    },

    removeEventListener: function removeEventListener(event, listener) {
        var listeners = this.eventListeners && this.eventListeners[event] || [];

        for (var i = 0, l = listeners.length; i < l; ++i) {
            if (listeners[i] === listener) {
                return listeners.splice(i, 1);
            }
        }
    },

    dispatchEvent: function dispatchEvent(event) {
        var type = event.type;
        var listeners = this.eventListeners && this.eventListeners[type] || [];

        for (var i = 0; i < listeners.length; i++) {
            if (typeof listeners[i] === "function") {
                listeners[i].call(this, event);
            } else {
                listeners[i].handleEvent(event);
            }
        }

        return !!event.defaultPrevented;
    }
};

module.exports = {
    Event: Event,
    ProgressEvent: ProgressEvent,
    CustomEvent: CustomEvent,
    EventTarget: EventTarget
};
