---
title: How to stub a dependency of a module
---

# How to stub a dependency of a module

Sinon is a stubbing library, not a module interception library. Stubbing dependencies is highly dependent on your environment and the implementation. For Node environments, we usually recommend solutions targeting [link seams](./link-seams-commonjs) or explicit dependency injection. Though in some more basic cases, you can get away with only using Sinon by modifying the module exports of the dependency.

The CommonJS examples below use `require()` to obtain the dependency's exported object. The test replaces a method on that object, and the module under test calls the method through the same object. Copying the method into a local variable before it is stubbed, including through [destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment), keeps a reference to the original function instead. See [why the property lookup matters](#why-the-property-lookup-matters) and [the distinction for ES modules](#es-modules-and-transpiled-code) below.

## An example

### Source file: `dependencyModule.js`

```javascript
function getSecretNumber() {
  return 44;
}

module.exports = {
  getSecretNumber,
};
```

### Source file: `moduleUnderTest.js`

```javascript
const dependencyModule = require("./dependencyModule");

function getTheSecret() {
  return `The secret was: ${dependencyModule.getSecretNumber()}`;
}

module.exports = {
  getTheSecret,
};
```

### Test file: `test.js`

```javascript
const assert = require("assert");
const sinon = require("sinon");

const dependencyModule = require("./dependencyModule");
const { getTheSecret } = require("./moduleUnderTest");

describe("moduleUnderTest", function () {
  describe("when the secret is 3", function () {
    it("should be returned with a string prefix", function () {
      sinon.stub(dependencyModule, "getSecretNumber").returns(3);
      const result = getTheSecret();
      assert.equal(result, "The secret was: 3");
    });
  });
});
```

## Why the property lookup matters

In the example above, `getTheSecret()` looks up `dependencyModule.getSecretNumber` each time it runs. After `sinon.stub(dependencyModule, "getSecretNumber")`, that property holds the stub.

Changing `moduleUnderTest.js` to the following would keep the original function when the module is loaded, before the test installs its stub:

```javascript
const { getSecretNumber } = require("./dependencyModule");

function getTheSecret() {
  return `The secret was: ${getSecretNumber()}`;
}

module.exports = { getTheSecret };
```

Replacing `dependencyModule.getSecretNumber` later does not change this local `getSecretNumber` variable. Assigning `const getSecretNumber = dependencyModule.getSecretNumber` before stubbing has the same effect; the issue is the copied function reference, not just the destructuring syntax.

The test also needs the dependency object so it can replace the property used by the module under test. `sinon.stub(dependencyModule, "getSecretNumber")` does that. Creating a separate stub does not replace an already captured function reference.

Destructuring an object is different from copying one of its methods. For example, if another dependency exports `{ service }`, both the test and the module under test can keep the same `service` object:

```javascript
const { service } = require("./serviceModule");

function getTheSecret() {
  return `The secret was: ${service.getSecretNumber()}`;
}
```

The test can use `sinon.stub(service, "getSecretNumber")` on that same object. The call still looks up the property that the stub replaces. Likewise, destructuring `getTheSecret` in the original test is fine: that is the function being tested, and it still looks up the dependency's method when called.

## ES modules and transpiled code

An ES module named import such as `import { getSecretNumber } from "./dependencyModule.js"` is not a destructuring assignment. Its binding follows different rules. Native ES module namespace objects cannot have their exports replaced with `sinon.stub`; named imports are not a workaround for that restriction.

If an ES module exports a mutable object, importing that object and stubbing one of its methods is a different operation: it changes a property on the exported object, not the module's export binding. As in the CommonJS example, the module under test must call the method through the same object for the stub to take effect.

Transpilers can turn imports into different property accesses or descriptors. Inspect the emitted JavaScript rather than inferring whether it can be stubbed from the import syntax alone. The [TypeScript and SWC case study](./typescript-swc) walks through these differences and possible approaches when a dependency cannot be replaced directly.

## A complex example with asynchronous code

In some cases you might need to stub a dependency that returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). To test it you can add the [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) keyword to the test method and call the method being tested with the [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) keyword.

### Source file: `userApi.js`

```javascript
const axios = require("axios");

async function getPageOfUsers(page) {
  const result = await axios({
    method: "GET",
    url: `https://reqres.in/api/users?page=${page}`,
  });
  return result.data;
}

module.exports = {
  getPageOfUsers,
};
```

### Source file: `userUtils.js`

```javascript
const userApi = require("./userApi");

async function getAllUsers() {
  const users = [];

  let page = 0,
    usersPage = null;

  do {
    page += 1;
    usersPage = await userApi.getPageOfUsers(page);

    users.push(...usersPage.data);
  } while (usersPage.total_pages > page);

  return users;
}

module.exports = {
  getAllUsers,
};
```

### Test file: `UserUtils-test.js`

```javascript
const assert = require("assert");
const sinon = require("sinon");
const userUtils = require("./userUtils");
const userApi = require("./userApi");

function aUser(id) {
  return {
    id,
    email: `someemail@user${id}.com`,
    first_name: `firstName${id}`,
    last_name: `lastName${id}`,
    avatar: `https://www.somepage${id}.com`,
  };
}

describe("userUtils", function () {
  let getPageOfUsersStub;

  beforeEach(function () {
    getPageOfUsersStub = sinon.stub(userApi, "getPageOfUsers");
  });

  afterEach(function () {
    getPageOfUsersStub.restore();
  });

  describe("when a single page of users exists", function () {
    it("should return users from that page", async function () {
      // Arrange
      const pageOfUsers = {
        page: 1,
        total_pages: 1,
        data: [aUser(1), aUser(2), aUser(3)],
      };

      getPageOfUsersStub.returns(Promise.resolve(pageOfUsers));

      // Act
      const result = await userUtils.getAllUsers();

      // Assert
      assert.equal(result.length, 3);
      assert.equal(getPageOfUsersStub.calledOnce, true);
    });
  });

  describe("when multiple pages of users exists", function () {
    it("should return a combined list of all users", async function () {
      // Arrange
      const pageOfUsers1 = {
        page: 1,
        total_pages: 2,
        data: [aUser(1), aUser(2), aUser(3)],
      };
      const pageOfUsers2 = {
        page: 2,
        total_pages: 2,
        data: [aUser(4), aUser(5)],
      };

      getPageOfUsersStub.withArgs(1).returns(Promise.resolve(pageOfUsers1));
      getPageOfUsersStub.withArgs(2).returns(Promise.resolve(pageOfUsers2));

      // Act
      const result = await userUtils.getAllUsers();

      // Assert
      assert.equal(result.length, 5);
      assert.equal(getPageOfUsersStub.callCount, 2);
    });
  });
});
```
