import t from "tap";
import sinon from "sinon";

function Book(p) {
  this.pages = p;
}

t.test(`combining matchers`, (t) => {
  const stringOrNumber = sinon.match.string.or(sinon.match.number);
  const f = sinon.fake();
  f("apple pie");
  t.ok(f.calledWith(stringOrNumber));

  const bookWithPages = sinon.match
    .instanceOf(Book)
    .and(sinon.match.has("pages"));
  const b = new Book(42);
  const h = sinon.fake();
  h(b);
  t.ok(h.calledWith(bookWithPages));

  t.end();
});
