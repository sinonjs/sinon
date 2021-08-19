---
layout: page
title: How to stub a dependency of a module
---

Sinon is a stubbing library, not a module interception library. Stubbing dependencies is highly dependant on your enviroment and the implementation. For Node environments, we usually recommend solutions targeting [link seams](../link-seams-commonjs/) or explicit dependency injection. Though in some more basic cases, you can get away with only using Sinon by modifying the module exports of the dependency.

To stub a dependency (imported module) of a module under test you have to import it explicitly in your test and stub the desired method. For the stubbing to work, the stubbed method cannot be [destructured](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment), neither in the module under test nor in the test.

## An example

### Source file: dependencyModule.js

```javascript
function getSecretNumber() {
  return 44;
}

module.exports = {
  getSecretNumber,
};
```

### Source file: moduleUnderTest.js

```javascript
const dependencyModule = require("./dependencyModule");

function getTheSecret() {
  return `The secret was: ${dependencyModule.getSecretNumber()}`;
}

module.exports = {
  getTheSecret,
};
```

### Test file: test.js

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

## A complex example with asynchronous code

In some cases you might need to stub a dependency that returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). To test it you can add the [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) keyword to the test method and call the method being tested with the [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) keyword.

### Source file: userApi.js

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

### Source file: userUtils.js

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

### Test file: UserUtils-test.js

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
