require("@fatso83/mini-mocha").install();

const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;
const jsdom = require("jsdom");
const JSDOM = jsdom.JSDOM;
const window = new JSDOM("").window;
global.window = window;
global.document = window.document;
const jQuery = require("jquery");

describe("Return nth call", function () {
    beforeEach(function () {
        sinon.spy(jQuery, "ajax");
    });

    afterEach(function () {
        sinon.restore();
    });

    it("should inspect jQuery.getJSON's usage of jQuery.ajax", function () {
        const url = "https://jsonplaceholder.typicode.com/todos/1";
        jQuery.ajax(url);
        const spyCall = jQuery.ajax.getCall(0);

        assert.equals(url, spyCall.args[0]);
    });
});
