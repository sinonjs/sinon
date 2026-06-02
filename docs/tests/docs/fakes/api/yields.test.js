import tap from "tap";
import * as sinon from "sinon";
import fs from "fs";

tap.test("fake.yields", (t) => {
  const fake = sinon.fake.yields(null, "file content");
  const anotherFake = sinon.fake();

  sinon.replace(fs, "readFile", fake);

  fs.readFile("somefile", (err, data) => {
    // called with fake values given to yields as arguments
    t.equal(err, null, "callback receives null error");

    t.equal(data, "file content", "callback receives file content");

    // since yields is synchronous, anotherFake is not called yet
    t.notOk(anotherFake.called, "anotherFake not called yet");

    sinon.restore();
    t.end();
  });

  anotherFake();
});

tap.test("fake.yields throws when last argument is not a function", (t) => {
  const fake = sinon.fake.yields("error", "data");

  t.throws(
    () => fake("not a callback"),
    /Expected last argument to be a function/,
    "throws TypeError when last argument is not a function"
  );

  t.end();
});
