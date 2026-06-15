---
title: sandbox.replaceSetter
description: Replaces setter for `property` on `object` with `replacement` argument. Attempting to replace an already replaced setter causes an exception.
---

# `sandbox.replaceSetter();`

Replaces setter for `property` on `object` with `replacement` argument. Attempting to replace an already replaced setter causes an exception.

`replacement` must be a `Function`, and can be instances of [`fake`](/concepts/fakes/), [`spy`](/concepts/spies/) and [`stub`](/concepts/stubs/).

<<< @/.vitepress/tests/docs/sandboxes/api/replace-setter.test.js
