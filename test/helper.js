/*jslint indent: 2, onevar: false, eqeqeq: false*/
/*global TestCase*/
function testCase(name, tests) {
  var jstdCase = {};
  var jstdTestCase = TestCase; // Silence JsLint...

  for (var prop in tests) {
    if (tests.hasOwnProperty(prop)) {
      if (!/(^(setUp|tearDown)$)|^test/.test(prop) &&
          typeof tests[prop] == "function") {
        jstdCase["test " + prop] = tests[prop];
      } else {
        jstdCase[prop] = tests[prop];
      }
    }
  }

  jstdTestCase(name, jstdCase);
}
