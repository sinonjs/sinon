import t from "tap";
import sinon from "sinon";

t.test("createStubInstance stubs all implemented functions", (t) => {
  class Container {
    contains(item) {
      /* ... */
    }
  }

  const stubContainer = sinon.createStubInstance(Container);
  stubContainer.contains.returns(false);
  stubContainer.contains.withArgs("item").returns(true);

  // Verify the stubbed behavior works as configured
  t.equal(
    stubContainer.contains("other"),
    false,
    "contains should return false by default"
  );
  t.equal(
    stubContainer.contains("item"),
    true,
    "contains should return true for 'item'"
  );

  // Verify it's actually a stub
  t.ok(stubContainer.contains.calledTwice, "contains should be called twice");
  t.type(
    stubContainer,
    Container,
    "stubContainer should be instance of Container"
  );

  t.end();
});
