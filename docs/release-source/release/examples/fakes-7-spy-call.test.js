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

describe("Return nth call", function () {
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
        fakeAjax(url);
        const fakeCall = fakeAjax.getCall(0);

        assert.equals(url, fakeCall.args[0]);
    });
});
