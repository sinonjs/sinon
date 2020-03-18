"use strict";
const Lab = (exports.lab = require("@hapi/lab"));
const { it, describe } = (exports.lab = Lab.script());

const sinon = require("sinon");
const PubSub = require("pubsub-js");
const referee = require("@sinonjs/referee");
const assertTrue = referee.assert;

describe("PubSub", () => {
    it("should call subscribers on publish", () => {
        const callback = sinon.spy();

        PubSub.subscribe("message", callback);
        PubSub.publishSync("message");

        assertTrue(callback.called);
    });
});
