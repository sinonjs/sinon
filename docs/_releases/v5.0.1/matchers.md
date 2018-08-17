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
        id: {
          isbn10: "0596517742",
          isbn13: "978-0596517748"
        }
    };
    var spy = sinon.spy();

    spy(book);

    sinon.assert.calledWith(spy, sinon.match({ author: "cjno" }));
    sinon.assert.calledWith(spy, sinon.match.has("pages", 42));
    sinon.assert.calledWith(spy, sinon.match.has("id", sinon.match.has("isbn13", "978-0596517748")));
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


#### `sinon.match.array.deepEquals(arr)`

Requires an `Array` to be deep equal another one.


#### `sinon.match.array.startsWith(arr)`

Requires an `Array` to start with the same values as another one.


#### `sinon.match.array.endsWith(arr)`

Requires an `Array` to end with the same values as another one.


#### `sinon.match.array.contains(arr)`

Requires an `Array` to contain each one of the values the given array has.


#### `sinon.match.map`

Requires the value to be a `Map`.


#### `sinon.match.map.deepEquals(map)`

Requires a `Map` to be deep equal another one.


#### `sinon.match.map.contains(map)`

Requires a `Map` to contain each one of the items the given map has.


#### `sinon.match.set`

Requires the value to be a `Set`.


#### `sinon.match.set.deepEquals(set)`

Requires a `Set` to be deep equal another one.


#### `sinon.match.set.contains(set)`

Requires a `Set` to contain each one of the items the given set has.


#### `sinon.match.regexp`

Requires the value to be a regular expression.


#### `sinon.match.date`

Requires the value to be a `Date` object.


#### `sinon.match.symbol`

Requires the value to be a `Symbol`.

*Since `sinon@2.0.0`*

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
    `"regexp"`,
    `"date"` or
    `"symbol"`.


#### `sinon.match.instanceOf(type)`

Requires the value to be an instance of the given `type`.


#### `sinon.match.has(property[, expectation])`

Requires the value to define the given `property`.

The property might be inherited via the prototype chain. If the optional expectation is given, the value of the property is deeply compared with the expectation. The expectation can be another matcher.

#### `sinon.match.hasOwn(property[, expectation])`

Same as `sinon.match.has` but the property must be defined by the value itself. Inherited properties are ignored.


#### `sinon.match.hasNested(propertyPath[, expectation])`

Requires the value to define the given `propertyPath`. Dot (`prop.prop`) and bracket (`prop[0]`) notations are supported as in [Lodash.get](https://lodash.com/docs/4.4.2#get).

The propertyPath might be inherited via the prototype chain. If the optional expectation is given, the value at the propertyPath is deeply compared with the expectation. The expectation can be another matcher.


```javascript
sinon.match.hasNested("a[0].b.c");

// Where actual is something like
var actual = { "a": [{ "b": { "c": 3 } }] };

sinon.match.hasNested("a.b.c");

// Where actual is something like
var actual = { "a": { "b": { "c": 3 } } };
```

#### `sinon.match.every(matcher)`

Requires **every** element of an `Array`, `Set` or `Map`, or alternatively **every** value of an `Object` to match the given `matcher`.

#### `sinon.match.some(matcher)`

Requires **any** element of an `Array`, `Set` or `Map`, or alternatively **any** value of an `Object` to match the given `matcher`.

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
