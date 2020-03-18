require("@fatso83/mini-mocha").install();
var sinon = require("sinon");
var referee = require("@sinonjs/referee");
var assert = referee.assert;
var jsdom = require("jsdom");
var JSDOM = jsdom.JSDOM;
var window = new JSDOM().window;
var document = new JSDOM("").window;
var jQuery = require("jquery")(window);
global.document = document;

describe("Return nth call", function() {
    var sandbox = sinon.createSandbox();

    beforeEach(function() {
        sandbox.spy(jQuery, "ajax");
    });

    afterEach(function() {
        sandbox.restore();
    });

    it("should inspect jQuery.getJSON's usage of jQuery.ajax", function() {
        var url = "https://jsonplaceholder.typicode.com/todos/1";
        jQuery.ajax(url);
        var spyCall = jQuery.ajax.getCall(0);

        assert.equals(url, spyCall.args[0]);
    });
});
