import t from "tap";
import sinon from "sinon";

t.test("createSandbox with useFakeTimers creates clock", (t) => {
  // Create sandbox with useFakeTimers explicitly
  const sandbox = sinon.createSandbox({
    useFakeTimers: true
  });

  t.ok(sandbox.clock, "sandbox with useFakeTimers:true should have clock");
  t.ok(sandbox.clock.tick, "clock should have tick method");

  sandbox.restore();

  t.end();
});
