import tap from "tap";
import * as sinon from "sinon";
import fs from "fs";

tap.test("fake.yieldsAsync", (t) => {
  const fake = sinon.fake.yieldsAsync(null, "file content");
  const anotherFake = sinon.fake();

  sinon.replace(fs, "readFile", fake);

  fs.readFile("somefile", (err, data) => {
    // called with fake values given to yields as arguments
    t.equal(err, null, "callback receives null error");

    t.equal(data, "file content", "callback receives file content");

    // since yields is asynchronous, anotherFake is called first
    t.ok(anotherFake.called, "anotherFake was called before callback");

    sinon.restore();
    t.end();
  });

  anotherFake();
});

tap.test(
  "fake.yieldsAsync throws when last argument is not a function",
  (t) => {
    const fake = sinon.fake.yieldsAsync("error", "data");

    t.throws(
      () => fake("not a callback"),
      /Expected last argument to be a function/,
      "throws TypeError when last argument is not a function"
    );

    t.end();
  }
);
