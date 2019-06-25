---
layout: page
title: How to stub a dependency of a module?
---

Sinon is simply a stubbing library, not a module interception library. Stubbing dependencies is highly dependant on your enviroment and the implementation. For Node environments, we usually recommend solutions targetting [link seams](./link-seams-commonjs) or explicit dependency injection. Though in some simple cases, you can get away with just using Sinon by modifying the module exports of the dependency.

To stub a dependency (imported module) of a module under test you have to import it explicitly in your test and stub the desired method. For the stubbing to work, the stubbed method cannot be [destructured](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment), neither in the module under test nor in the test.

## Example: dependencyModule.js
```javascript

function getSecretNumber() {
  return 44;
}

module.exports = {
  getSecretNumber
};
```

## Example: moduleUnderTest.js

```javascript
const dependencyModule = require("./dependencyModule");

function getTheSecret() {
  return `The secret was: ${dependencyModule.getSecretNumber()}`;
}

module.exports = {
  getTheSecret
};
```

## Example: test.js

```javascript
const assert = require("assert");
const sinon = require("sinon");

const dependencyModule = require("./dependencyModule");
const { getTheSecret } = require("./moduleUnderTest");

describe("moduleUnderTest", function() {
  describe("when the secret is 3", function() {
    it("should be returned with a string prefix", function() {
      sinon.stub(dependencyModule, "getSecretNumber").returns(3);
      const result = getTheSecret();
      assert.equal(result, "The secret was: 3");
    });
  });
});
```