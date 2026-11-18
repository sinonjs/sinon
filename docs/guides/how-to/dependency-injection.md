---
title: How to use dependency injection with Sinon
description: Inject a Sinon test double directly instead of replacing an imported module.
---

# How to use dependency injection with Sinon

Dependency injection means that a module receives its collaborators from the
outside instead of importing or creating them itself. Tests can then pass a
Sinon test double directly, without a module loader hook or a dependency
injection framework.

## Accept the dependency

This factory accepts a function that retrieves a user. The returned service
only depends on that function's behavior, not on where it came from:

```js
// profile-service.js
export function createProfileService({ fetchUser }) {
  return {
    async getProfile(userId) {
      const user = await fetchUser(userId);
      return `${user.name} <${user.email}>`;
    }
  };
}
```

The application wires the real dependency at its composition root:

```js
// app.js
import { fetchUser } from "./user-api.js";
import { createProfileService } from "./profile-service.js";

export const profileService = createProfileService({ fetchUser });
```

## Inject a Sinon test double

The test creates a stub with the behavior it needs and injects it through the
same factory argument:

```js
import assert from "node:assert/strict";
import sinon from "sinon";
import { createProfileService } from "./profile-service.js";

const fetchUser = sinon.stub().resolves({
  name: "Ada",
  email: "ada@example.test"
});
const profileService = createProfileService({ fetchUser });

const profile = await profileService.getProfile(42);

assert.equal(profile, "Ada <ada@example.test>");
sinon.assert.calledOnceWithExactly(fetchUser, 42);
```

The production module stays independent of Sinon. Sinon is used only in the
test to create and inspect the injected collaborator.

## When to use this pattern

Prefer explicit dependency injection when you control the module under test.
It makes dependencies visible and works with both CommonJS and ES modules. If
you cannot change legacy CommonJS code that imports its dependency directly,
see [Link seams (CommonJS)](./link-seams-commonjs) instead.
