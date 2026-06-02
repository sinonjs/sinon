import t from "tap";
import sinon from "sinon";

t.test("mock expectations can chain atLeast and atMost", (t) => {
  // Create an object with a real method
  const obj = {
    ajax: function () {
      return "response";
    }
  };

  // Set up expectations
  const mock = sinon.mock(obj);
  mock.expects("ajax").atLeast(2).atMost(5);

  // Call the method within the expected range (3 times)
  obj.ajax();
  obj.ajax();
  obj.ajax();

  // Verify expectations are met
  t.doesNotThrow(() => {
    mock.verify();
  }, "should not throw when expectations are met");

  // Restore
  mock.restore();

  t.end();
});
