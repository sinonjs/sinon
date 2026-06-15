---
title: sandbox.replaceGetter
description: Replaces getter for `property` on `object` with `replacement` argument. Attempting to replace an already replaced getter causes an exception.
---

# `sandbox.replaceGetter();`

Replaces getter for `property` on `object` with `replacement` argument. Attempting to replace an already replaced getter causes an exception.

`replacement` must be a `Function`, and can be instances of [`fake`](/concepts/fakes/), [`spy`](/concepts/spies/) and [`stub`](/concepts/stubs/).

<<< @/.vitepress/tests/docs/sandboxes/api/replace-getter.test.js
