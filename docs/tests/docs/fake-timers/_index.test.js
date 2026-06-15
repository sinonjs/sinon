import t from "tap";
import sinon from "sinon";
import { JSDOM } from "jsdom";

t.test("fake timers can control time for animations and timeouts", (t) => {
  const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
  const document = dom.window.document;

  const clock = sinon.useFakeTimers();

  // Create element and add to document
  const el = document.createElement("div");
  document.body.appendChild(el);

  // Animate function that changes styles over 500ms
  function animate(element) {
    setTimeout(() => {
      element.style.height = "200px";
      element.style.width = "200px";
    }, 500);
  }

  animate(el);

  // Verify animation hasn't completed yet
  t.equal(el.style.height, "", "height should be empty initially");
  t.equal(el.style.width, "", "width should be empty initially");

  // Advance time by 510ms
  clock.tick(510);

  // Verify animation completed
  t.equal(el.style.height, "200px", "height should be 200px after 510ms");
  t.equal(el.style.width, "200px", "width should be 200px after 510ms");

  clock.restore();
  t.end();
});
