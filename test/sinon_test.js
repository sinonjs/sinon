/*jslint onevar: false, eqeqeq: false*/
/*globals testCase
          document
          sinon
          fail
          assert
          assertFalse
          assertEquals
          assertSame
          assertNotSame
          assertFunction
          assertObject
          assertException
          assertNoException*/
/**
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */
"use strict";

if (typeof require == "function" && typeof testCase == "undefined") {
    var testCase = require("./test_case_shim");
    var sinon = require("../lib/sinon");
}

(function () {
    testCase("SinonTest", {
        "sinon should be object": function () {
            assertObject(sinon);
        }
    });

    testCase("SinonWrapMethodTest", {
        setUp: function () {
            this.method = function () {};
            this.object = { method: this.method };
        },

        "should be function": function () {
            assertFunction(sinon.wrapMethod);
        },

        "should throw if first argument is not object": function () {
            assertException(function () {
                sinon.wrapMethod();
            }, "TypeError");
        },

        "should throw if object defines property but is not function": function () {
            this.object.prop = 42;
            var object = this.object;

            assertException(function () {
                sinon.wrapMethod(object, "prop", function () {});
            }, "TypeError");
        },

        "should throw if object does not define property": function () {
            var object = this.object;

            assertException(function () {
                sinon.wrapMethod(object, "prop", function () {});
            });
        },

        "should throw if third argument is missing": function () {
            var object = this.object;

            assertException(function () {
                sinon.wrapMethod(object, "method");
            }, "TypeError");
        },

        "should throw if third argument is not function": function () {
            var object = this.object;

            assertException(function () {
                sinon.wrapMethod(object, "method", {});
            }, "TypeError");
        },

        "should replace object method": function () {
            sinon.wrapMethod(this.object, "method", function () {});

            assertNotSame(this.method, this.object.method);
            assertFunction(this.object.method);
        },

        "should throw if method is already wrapped": function () {
            var object = { method: function () {} };
            sinon.wrapMethod(object, "method", function () {});

            assertException(function () {
                sinon.wrapMethod(object, "method", function () {});
            }, "TypeError");
        },

        "should throw if method is already a spy": function () {
            var object = { method: sinon.spy() };

            assertException(function () {
                sinon.wrapMethod(object, "method", function () {});
            }, "TypeError");
        },

        "should not throw if object is window object": function () {
            window.sinonTestMethod = function () {};
            try {
                assertNoException(function () {
                    sinon.wrapMethod(window, "sinonTestMethod", function () {});
                });
            } finally {
                // IE 8 does not support delete on global properties.
                window.sinonTestMethod = undefined;
            }
        },

        "should mirror function properties": function () {
            var object = { method: function () {} };
            object.method.prop = 42;

            sinon.wrapMethod(object, "method", function () {});

            assertEquals(42, object.method.prop);
        },

        "should not mirror and overwrite existing properties": function () {
            var object = { method: function () {} };
            object.method.called = 42;

            sinon.stub(object, "method");

            assertSame(false, object.method.called);
        }
    });

    testCase("WrappedMethodTest", {
        setUp: function () {
            this.method = function () {};
            this.object = { method: this.method };
        },

        "should define restore method": function () {
            sinon.wrapMethod(this.object, "method", function () {});

            assertFunction(this.object.method.restore);
        },

        "should return wrapper": function () {
            var wrapper = sinon.wrapMethod(this.object, "method", function () {});

            assertSame(wrapper, this.object.method);
        },

        "restore should bring back original method": function () {
            sinon.wrapMethod(this.object, "method", function () {});
            this.object.method.restore();

            assertSame(this.method, this.object.method);
        }
    });

    testCase("WrappedPrototypeMethodTest", {
        setUp: function () {
            this.type = function () {};
            this.type.prototype.method = function () {};
            this.object = new this.type();
        },

        "wrap should add owned property": function () {
            var wrapper = sinon.wrapMethod(this.object, "method", function () {});

            assertSame(wrapper, this.object.method);
            assert(this.object.hasOwnProperty("method"));
        },

        "restore should remove owned property": function () {
            sinon.wrapMethod(this.object, "method", function () {});
            this.object.method.restore();

            assertSame(this.type.prototype.method, this.object.method);
            assertFalse(this.object.hasOwnProperty("method"));
        }
    });

    testCase("SinonDeepEqualTest", {
        "should pass null": function () {
            assert(sinon.deepEqual(null, null));
        },

        "should not pass null and object": function () {
            assertFalse(sinon.deepEqual(null, {}));
        },

        "should not pass object and null": function () {
            assertFalse(sinon.deepEqual({}, null));
        },

        "should not pass error and object": function () {
            assertFalse(sinon.deepEqual(new Error(), {}));
        },

        "should not pass object and error": function () {
            assertFalse(sinon.deepEqual({}, new Error()));
        },

        "should not pass regexp and object": function () {
            assertFalse(sinon.deepEqual(/.*/, {}));
        },

        "should not pass object and regexp": function () {
            assertFalse(sinon.deepEqual({}, /.*/));
        },

        "should pass primitives": function () {
            assert(sinon.deepEqual(1, 1));
        },

        "should pass same object": function () {
            var object = {};

            assert(sinon.deepEqual(object, object));
        },

        "should pass same function": function () {
            var func = function () {};

            assert(sinon.deepEqual(func, func));
        },

        "should pass same array": function () {
            var arr = [];

            assert(sinon.deepEqual(arr, arr));
        },

        "should pass equal arrays": function () {
            var arr1 = [1, 2, 3, "hey", "there"];
            var arr2 = [1, 2, 3, "hey", "there"];

            assert(sinon.deepEqual(arr1, arr2));
        },

        "should pass equal objects": function () {
            var obj1 = { a: 1, b: 2, c: 3, d: "hey", e: "there" };
            var obj2 = { b: 2, c: 3, a: 1, d: "hey", e: "there" };

            assert(sinon.deepEqual(obj1, obj2));
        },

        "should pass same DOM elements": function () {
            /*:DOC element = <div class="hey"></div> */
            if (typeof document == "undefined") return console.log("Test requires DOM");

            assert(sinon.deepEqual(this.element, this.element));
        },

        "should not pass different DOM elements": function () {
            /*:DOC element = <div class="hey"></div> */
            if (typeof document == "undefined") return console.log("Test requires DOM");
            var el = document.createElement("div");

            assertFalse(sinon.deepEqual(this.element, el));
        },

        "should not modify DOM elements when comparing them": function () {
            /*:DOC += <div id="hey"></div> */
            if (typeof document == "undefined") return console.log("Test requires DOM");
            var el = document.getElementById("hey");
            sinon.deepEqual(el, {})

            assertSame(document.body, el.parentNode);
            assertEquals(0, el.childNodes.length);
        },

        "should pass deep objects": function () {
            var func = function () {};

            var obj1 = {
                a: 1,
                b: 2,
                c: 3,
                d: "hey",
                e: "there",
                f: func,
                g: {
                    a1: [1, 2, "3", {
                        prop: [func, "b"]
                    }]
                }
            };

            var obj2 = {
                a: 1,
                b: 2,
                c: 3,
                d: "hey",
                e: "there",
                f: func,
                g: {
                    a1: [1, 2, "3", {
                        prop: [func, "b"]
                    }]
                }
            };

            assert(sinon.deepEqual(obj1, obj2));
        }
    });

    testCase("ExtendTest", {
        "should copy all properties": function () {
            var object1 = {
                prop1: null,
                prop2: false
            };

            var object2 = {
                prop3: "hey",
                prop4: 4
            };

            var result = sinon.extend({}, object1, object2);

            var expected = {
                prop1: null,
                prop2: false,
                prop3: "hey",
                prop4: 4
            };

            assertEquals(expected, result);
        }
    });

    testCase("FunctionToStringTest", {
        "should return function's displayName property": function () {
            var fn = function () {};
            fn.displayName = "Larry";

            assertEquals("Larry", sinon.functionToString.call(fn));
        },

        "should guess name from last call's this object": function () {
            var obj = {};
            obj.doStuff = sinon.spy();
            obj.doStuff.call({});
            obj.doStuff();

            assertEquals("doStuff", sinon.functionToString.call(obj.doStuff));
        },

        "should guess name from any call where property can be located": function () {
            var obj = {}, otherObj = { id: 42 };
            obj.doStuff = sinon.spy();
            obj.doStuff.call({});
            obj.doStuff();
            obj.doStuff.call(otherObj);

            assertEquals("doStuff", sinon.functionToString.call(obj.doStuff));
        }
    });

    testCase("ConfigTest", {
        "should get copy of default config": function () {
            var config = sinon.getConfig();

            assertNotSame(sinon.defaultConfig, config);
            assertEquals(sinon.defaultConfig.injectIntoThis, config.injectIntoThis);
            assertEquals(sinon.defaultConfig.injectInto, config.injectInto);
            assertEquals(sinon.defaultConfig.properties, config.properties);
            assertEquals(sinon.defaultConfig.useFakeTimers, config.useFakeTimers);
            assertEquals(sinon.defaultConfig.useFakeServer, config.useFakeServer);
        },

        "should override specified properties": function () {
            var config = sinon.getConfig({
                properties: ["stub", "mock"],
                useFakeServer: false
            });

            assertNotSame(sinon.defaultConfig, config);
            assertEquals(sinon.defaultConfig.injectIntoThis, config.injectIntoThis);
            assertEquals(sinon.defaultConfig.injectInto, config.injectInto);
            assertEquals(["stub", "mock"], config.properties);
            assertEquals(sinon.defaultConfig.useFakeTimers, config.useFakeTimers);
            assertEquals(false, config.useFakeServer);
        }
    });

    testCase("LogTest", {
        "should do nothing gracefully": function () {
            sinon.log("Oh, hiya");
        }
    });

    testCase("FormatTest", {
        "should format with buster by default": function () {
            assertEquals("{ id: 42 }", sinon.format({ id: 42 }));
        },

        "should format strings without quotes": function () {
            assertEquals("Hey", sinon.format("Hey"));
        }
    });
}());
