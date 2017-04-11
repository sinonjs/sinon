---
layout: page
title: Matchers - Sinon.JS
breadcrumb: matchers
---

Matchers can be passed as arguments to `spy.calledOn`, `spy.calledWith`, `spy.returned` and the
corresponding `sinon.assert` functions as well as `spy.withArgs`. Matchers allow to be either more fuzzy or more specific about the expected value.

```javascript
"test should assert fuzzy": function () {
    var book = {
        pages: 42,
        author: "cjno"
    };
    var spy = sinon.spy();

    spy(book);

    sinon.assert.calledWith(spy, sinon.match({ author: "cjno" }));
    sinon.assert.calledWith(spy, sinon.match.has("pages", 42));
}
```

```javascript
"test should stub method differently based on argument types": function () {
    var callback = sinon.stub();
    callback.withArgs(sinon.match.string).returns(true);
    callback.withArgs(sinon.match.number).throws("TypeError");

    callback("abc"); // Returns true
    callback(123); // Throws TypeError
}
```

## Matchers API

#### `sinon.match(number);`

Requires the value to be == to the given number.


#### `sinon.match(string);`

Requires the value to be a string and have the expectation as a substring.


#### `sinon.match(regexp);`

Requires the value to be a string and match the given regular expression.


#### `sinon.match(object);`

Requires the value to be not `null` or `undefined` and have at least the same properties as `expectation`.

This supports nested matchers.


#### `sinon.match(function)`

See `custom matchers`.


#### `sinon.match.any`

Matches anything.


#### `sinon.match.defined`

Requires the value to be defined.


#### `sinon.match.truthy`

Requires the value to be truthy.


#### `sinon.match.falsy`

Requires the value to be falsy.


#### `sinon.match.bool`

Requires the value to be a `Boolean`


#### `sinon.match.number`

Requires the value to be a `Number`.


#### `sinon.match.string`

Requires the value to be a `String`.


#### `sinon.match.object`

Requires the value to be an `Object`.


#### `sinon.match.func`

Requires the value to be a `Function`.


#### `sinon.match.array`

Requires the value to be an `Array`.


#### `sinon.match.regexp`

Requires the value to be a regular expression.


#### `sinon.match.date`

Requires the value to be a `Date object.


#### `sinon.match.same(ref)`

Requires the value to strictly equal `ref`.


#### `sinon.match.typeOf(type)`

Requires the value to be of the given type, where `type` can be one of
    `"undefined"`,
    `"null"`,
    `"boolean"`,
    `"number"`,
    `"string"`,
    `"object"`,
    `"function"`,
    `"array"`,
    `"regexp"` or
    `"date"`.


#### `sinon.match.instanceOf(type)`

Requires the value to be an instance of the given `type`.


#### `sinon.match.has(property[, expectation])`

Requires the value to define the given `property`.

The property might be inherited via the prototype chain. If the optional expectation is given, the value of the property is deeply compared with the expectation. The expectation can be another matcher.

#### `sinon.match.hasOwn(property[, expectation])`

Same as `sinon.match.has` but the property must be defined by the value itself. Inherited properties are ignored.


## Combining matchers

All matchers implement `and` and `or`. This allows to logically combine mutliple matchers. The result is a new matchers that requires both (and) or one of the matchers (or) to return `true`.

```javascript
var stringOrNumber = sinon.match.string.or(sinon.match.number);
var bookWithPages = sinon.match.instanceOf(Book).and(sinon.match.has("pages"));
```


## Custom matchers

Custom matchers are created with the `sinon.match` factory which takes a test function and an optional message.

The test function takes a value as the only argument, returns `true` if the value matches the expectation and `false` otherwise. The message string is used to generate the error message in case the value does not match the expectation.

```javascript
var trueIsh = sinon.match(function (value) {
    return !!value;
}, "trueIsh");
```
