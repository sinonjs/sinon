import tap from "tap";
import * as sinon from "sinon";

tap.test("spy.printf", (t) => {
  const s = sinon.spy(function hello() {
    return "world";
  });

  s();
  s();

  t.equal(s.printf("%n"), "hello", "formats spy name with %n");

  t.equal(
    s.printf("The spy %n has been called %c"),
    "The spy hello has been called twice",
    "formats spy name and call count"
  );

  t.end();
});
