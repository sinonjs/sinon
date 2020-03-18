"use strict";
const { it, describe, afterEach, beforeEach } = (exports.lab = require("@hapi/lab").script());
const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;
const jsdom = require("jsdom");
const JSDOM = jsdom.JSDOM;
const window = new JSDOM().window;
const document = new JSDOM("").window;
const jQuery = require("jquery")(window);
global.document = document;

describe("Wrap existing method", () => {
    const sandbox = sinon.createSandbox();

    beforeEach(() => {
        sandbox.spy(jQuery, "ajax");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should inspect jQuery.getJSON's usage of jQuery.ajax", () => {
        const url = "https://jsonplaceholder.typicode.com/todos/1";
        jQuery.getJSON(url);

        assert(jQuery.ajax.calledOnce);
        assert.equals(url, jQuery.ajax.getCall(0).args[0].url);
        assert.equals("json", jQuery.ajax.getCall(0).args[0].dataType);
    });
});
