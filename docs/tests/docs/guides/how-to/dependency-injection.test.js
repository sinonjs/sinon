// Source: docs/guides/how-to/dependency-injection.md
import tap from "tap";
import sinon from "sinon";

function createProfileService({ fetchUser }) {
  return {
    async getProfile(userId) {
      const user = await fetchUser(userId);
      return `${user.name} <${user.email}>`;
    }
  };
}

tap.test("injects a Sinon stub into the service", async (t) => {
  const fetchUser = sinon.stub().resolves({
    name: "Ada",
    email: "ada@example.test"
  });
  const profileService = createProfileService({ fetchUser });

  const profile = await profileService.getProfile(42);

  t.equal(profile, "Ada <ada@example.test>");
  sinon.assert.calledOnceWithExactly(fetchUser, 42);
});
