---
title: sandbox.restore
description: Restores all [`fakes`](/concepts/fakes/), [`spies`](/concepts/spies/) and [`stubs`](/concepts/stubs/) created through the sandbox.
---

# `sandbox.restore();`

Restores all [`fakes`](/concepts/fakes/), [`spies`](/concepts/spies/) and [`stubs`](/concepts/stubs/) created through the sandbox.

<<< @/.vitepress/tests/docs/sandboxes/api/restore.test.js

## Automatic cleanup with `using`

In runtimes that support `using` declarations and `Symbol.dispose`, a sandbox can restore its fakes automatically when its scope ends:

```js
import sinon from "sinon";

const object = {
  method() {
    return "original";
  }
};

{
  using sandbox = sinon.createSandbox();
  sandbox.stub(object, "method").returns("stubbed");
  object.method(); // "stubbed"
}

object.method(); // "original"
```

The sandbox's `[Symbol.dispose]()` method performs the same cleanup as `sandbox.restore()`, including when the scope exits because of an exception. Calling `restore()` manually before automatic cleanup is also safe.

The disposal method is available when `Symbol.dispose` exists. In runtimes without this symbol, continue using `sandbox.restore()` explicitly.
