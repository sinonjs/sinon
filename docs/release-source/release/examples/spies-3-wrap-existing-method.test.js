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

describe("Wrap existing method", function() {
    var sandbox = sinon.createSandbox();

    beforeEach(function() {
        sandbox.spy(jQuery, "ajax");
    });

    afterEach(function() {
        sandbox.restore();
    });

    it("should inspect jQuery.getJSON's usage of jQuery.ajax", function() {
        var url = "https://jsonplaceholder.typicode.com/todos/1";
        jQuery.getJSON(url);

        assert(jQuery.ajax.calledOnce);
        assert.equals(url, jQuery.ajax.getCall(0).args[0].url);
        assert.equals("json", jQuery.ajax.getCall(0).args[0].dataType);
    });
});
