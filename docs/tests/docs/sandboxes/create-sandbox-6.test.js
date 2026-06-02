import t from "tap";
import sinon from "sinon";

t.test("createSandbox with injectInto injects methods into object", (t) => {
  // Object that will have the spy method injected into it
  const sandboxFacade = {};

  // Create sandbox and inject properties (in this case spy) into sandboxFacade
  const sandbox = sinon.createSandbox({
    injectInto: sandboxFacade,
    properties: ["spy"]
  });

  // Verify spy method was injected
  t.ok(sandboxFacade.spy, "sandboxFacade should have spy method");
  t.type(sandboxFacade.spy, "function", "spy should be a function");

  // Verify the injected method works
  const obj = { method: function () {} };
  sandboxFacade.spy(obj, "method");
  obj.method();
  t.ok(obj.method.calledOnce, "injected spy should track calls");

  sandbox.restore();
  t.end();
});
