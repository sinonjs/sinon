import t from "tap";
import sinon from "sinon";

t.test("spying on an existing method", (t) => {
  // Mock a simple object with a method
  const myObject = {
    ajax(config) {
      // Simulate an ajax call
      return { data: "response" };
    },
    getJSON(url) {
      return this.ajax({ url: url, dataType: "json" });
    }
  };

  const sandbox = sinon.createSandbox();
  sandbox.spy(myObject, "ajax");

  // Call getJSON which internally uses ajax
  const url = "https://jsonplaceholder.typicode.com/todos/1";
  myObject.getJSON(url);

  // Verify ajax was called correctly
  t.ok(myObject.ajax.calledOnce, "ajax should be called once");
  t.equal(myObject.ajax.getCall(0).args[0].url, url, "url should match");
  t.equal(
    myObject.ajax.getCall(0).args[0].dataType,
    "json",
    "dataType should be json"
  );

  sandbox.restore();
  t.end();
});
