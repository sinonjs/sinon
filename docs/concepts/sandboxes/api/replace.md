---
title: sandbox.replace
description: Replaces `property` on `object` with `replacement` argument.
---

# `sandbox.replace(object, property, replacement);`

Replaces `property` on `object` with `replacement` argument.

Attempting to replace an already replaced value causes an exception.

Returns the `replacement`.

`replacement` can be any value, including [`fakes`](/concepts/fakes/), [`spies`](/concepts/spies/) and [`stubs`](/concepts/stubs/).

This method only works on non-accessor properties, for replacing accessors use [`sandbox.replaceGetter()`](./replace-getter) and [`sandbox.replaceSetter()`](./replace-setter).

<<< @/.vitepress/tests/docs/sandboxes/api/replace.test.js
