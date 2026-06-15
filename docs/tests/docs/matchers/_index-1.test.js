import t from "tap";
import sinon from "sinon";

t.test(`matcher allows fuzzy comparisons`, (t) => {
  const book = {
    pages: 42,
    author: "cjno",
    id: {
      isbn10: "0596517742",
      isbn13: "978-0596517748"
    }
  };
  const f = sinon.fake();

  f(book);

  t.ok(f.calledWith(sinon.match({ author: "cjno" })));
  t.ok(f.calledWith(sinon.match.has("pages", 42)));
  t.ok(
    f.calledWith(
      sinon.match.has("id", sinon.match.has("isbn13", "978-0596517748"))
    )
  );

  t.end();
});
