(function () {
  TestCase("SinonTestCaseTest", {
    "test should be function": function () {
      assertFunction(sinon.testCase);
    },

    "test should return object": function () {
      var tests = sinon.testCase({});

      assertEquals({}, tests);
    },

    "test should throw without object": function () {
      assertException(function () {
        sinon.testCase();
      }, "TypeError");
    },

    "test when properties start with test should return unmodified test case": function () {
      var tests = {
        testSomething: function () {},
        helper2: "hey",
        testSomethingElse: function () {},
        "test should do something": function () {}
      };

      assertEquals(tests, sinon.testCase(tests));
    },

    "test should prefix function properties with test": function () {
      var tests = { shouldFixIt: function () {} };
      var result = sinon.testCase(tests);

      assertEquals(tests.shouldFixIt, result["test shouldFixIt"]);
    },

    "test should flatten test object": function () {
      var tests = {
        "my context": {
          "should do something": function () {
          }
        }
      };

      var result = sinon.testCase(tests);

      assertSame(tests["my context"]["should do something"],
                 result["test my context should do something"]);
      assertUndefined(result["my context"]);
    },

    "test should flatten deeply nested test object": function () {
      var tests = {
        "ctx": {
          "ctx2": { "ctx3": { "should do": function () {} } },
          "test something": function () {}
        }
      };

      var result = sinon.testCase(tests);

      assertSame(tests.ctx.ctx2.ctx3["should do"],
                 result["test ctx ctx2 ctx3 should do"]);
      assertSame(tests.ctx["test something"],
                 result["test ctx test something"]);
      assertUndefined(result["ctx"]);
    },

    "test should remove setUp method": function () {
      var test = { setUp: function () {} };
      var result = sinon.testCase(test);

      assertUndefined(result.setUp);
      assertUndefined(result["test setUp"]);
    },

    "test should remove tearDown method": function () {
      var test = { tearDown: function () {} };
      var result = sinon.testCase(test);

      assertUndefined(result.tearDown);
      assertUndefined(result["test tearDown"]);
    },

    "test should call setUp before any test": function () {
      var test = { setUp: sinon.stub(), test: sinon.stub(), test2: sinon.stub() };
      var result = sinon.testCase(test);
      result.test();
      result.test2();

      assertEquals(2, test.setUp.callCount());
      sinon.assert.called(test.test);
      sinon.assert.called(test.test2);
    },

    "test should call tearDown after any test": function () {
      var test = { tearDown: sinon.stub(), test: sinon.stub(), test2: sinon.stub() };
      var result = sinon.testCase(test);
      result.test();
      result.test2();

      sinon.assert.called(test.tearDown);
      sinon.assert.called(test.test);
      sinon.assert.called(test.test2);
    },

    "test should call tearDown even if test throws": function () {
      var test = { tearDown: sinon.stub(), test: sinon.stub().throwsException() };
      var result = sinon.testCase(test);

      assertException(function () {
        result.test();
      }, "Error");

      sinon.assert.called(test.tearDown);
      sinon.assert.called(test.test);
    },

    "test should call setUp test tearDown in order": function () {
      var testCase = {
        setUp: sinon.stub(), test: sinon.stub(), tearDown: sinon.stub()
      };

      var result = sinon.testCase(testCase);

      try {
        result.test();
      } catch(e) {}

      sinon.assert.callOrder(testCase.setUp, testCase.test, testCase.tearDown);
    },

    "test should call in order when test throws": function () {
      var testCase = {
        setUp: sinon.stub(), tearDown: sinon.stub(),
        test: sinon.stub().throwsException()
      };

      var result = sinon.testCase(testCase);

      try {
        result.test();
      } catch(e) {}

      sinon.assert.callOrder(testCase.setUp, testCase.test, testCase.tearDown);
    }
  });
}());
