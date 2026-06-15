import t from "tap";
import sinon from "sinon";

t.test(
  "sinon.match.hasNested matches nested properties with dot notation",
  (t) => {
    const matcher = sinon.match.hasNested("a.b.c");

    const actual = { a: { b: { c: 3 } } };

    // Verify the matcher matches the nested structure
    t.ok(
      matcher.test(actual),
      "should match nested property with dot notation"
    );

    // Verify it doesn't match when property is missing
    const noMatch = { a: { b: {} } };
    t.notOk(
      matcher.test(noMatch),
      "should not match when nested property is missing"
    );

    t.end();
  }
);
