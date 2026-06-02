---
title: assert.expose
description: Exposes assertions into another object, to allow for integration with a test framework.
---

# `assert.expose(target, options);`

Exposes assertions into another object, to allow for integration with a test framework.

For example, [sinon-chai][0] exposes Sinon's assertions on its own object.

<<< ../../../.vitepress/tests/docs/assertions/api/expose.test.js

This will give you `spy.should.have.been.called` and so on.

See [sinon-chai documentation][0] for usage examples.

The method accepts an optional options object with two options:

<dl>
    <dt>prefix</dt>
    <dd>Defaults to "assert", so <code>sinon.assert.called</code> becomes <code>target.assertCalled</code>. By passing a blank string, the exposed method will be `target.called`.</dd>
    <dt>includeFail</dt>
    <dd><code>true</code> by default, copies over the `fail` and `failException` properties.</dd>
</dl>

[0]: https://github.com/chaijs/sinon-chai?tab=readme-ov-file#assertions
