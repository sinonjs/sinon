require("@fatso83/mini-mocha").install();

const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;
const jsdom = require("jsdom");
const JSDOM = jsdom.JSDOM;
const window = new JSDOM().window;
const document = new JSDOM("").window;
const jQuery = require("jquery")(window);
global.document = document;

describe("Wrap existing method", function () {
    const sandbox = sinon.createSandbox();
    let fakeAjax;

    beforeEach(function () {
        fakeAjax = sandbox.replace(jQuery, "ajax", sandbox.fake());
    });

    afterEach(function () {
        sandbox.restore();
    });

    it("should inspect jQuery.getJSON's usage of jQuery.ajax", function () {
        const url = "https://jsonplaceholder.typicode.com/todos/1";
        jQuery.getJSON(url);

        assert(fakeAjax.calledOnce);
        assert.equals(url, fakeAjax.getCall(0).args[0].url);
        assert.equals("json", fakeAjax.getCall(0).args[0].dataType);
    });
});
