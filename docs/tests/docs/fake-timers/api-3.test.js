import t from "tap";
import sinon from "sinon";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

t.test("useFakeTimers with async/await using tickAsync", async (t) => {
  const clock = sinon.useFakeTimers();

  const logs = [];

  async function asyncFn() {
    await wait(100);
    logs.push({ msg: "resolved 1", time: Date.now() });

    await wait(10);
    logs.push({ msg: "resolved 2", time: Date.now() });
  }

  setTimeout(() => logs.push({ msg: "timeout", time: Date.now() }), 200);

  // NOTE: no `await` here - it would hang, as the clock is stopped
  asyncFn();

  await clock.tickAsync(200);

  // Verify all async operations completed in correct order
  t.equal(logs.length, 3, "should have 3 log entries");
  t.same(logs[0], { msg: "resolved 1", time: 100 });
  t.same(logs[1], { msg: "resolved 2", time: 110 });
  t.same(logs[2], { msg: "timeout", time: 200 });

  clock.restore();
  t.end();
});
