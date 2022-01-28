require("@fatso83/mini-mocha").install();
const sinon = require("sinon");
const referee = require("@sinonjs/referee");
const assert = referee.assert;
const fs = require("fs");

describe("FakeTest", function () {
    it("should create a fake that 'yields'", function () {
        const fake = sinon.fake.yields(null, "file content");
        const anotherFake = sinon.fake();

        sinon.replace(fs, "readFile", fake);
        fs.readFile("somefile", (err, data) => {
            // called with fake values given to yields as arguments
            assert.isNull(err);
            assert.equals(data, "file content");
            // since yields is synchronous, anotherFake is not called yet
            assert.isFalse(anotherFake.called);
        });

        anotherFake();
    });
});
