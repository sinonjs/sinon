---
layout: page
title: Spy call - Sinon.JS
breadcrumb: spy-call
---

## Spy call

A spy call is an object representation of an invididual call to a *spied* function, which could be a [spy](../spies), [stub](../stubs) or [mock method](../mocks).

### `var spyCall = spy.getCall(n);`

Returns the *nth* [call](#spycall). Accessing individual calls helps with more detailed behavior verification when the spy is called more than once.

```javascript
sinon.spy(jQuery, "ajax");
jQuery.ajax("/stuffs");
var spyCall = jQuery.ajax.getCall(0);

assertEquals("/stuffs", spyCall.args[0]);
```


### `spyCall.calledOn(obj);`

Returns `true` if `obj` was `this` for this call. `calledOn` also accepts a matcher `spyCall.calledOn(sinon.match(fn))` (see [matchers][matchers]).


### `spyCall.calledWith(arg1, arg2, ...);`

Returns `true` if call received provided arguments (and possibly others).


### `spyCall.calledWithExactly(arg1, arg2, ...);`

Returns `true` if call received provided arguments and no others.


### `spyCall.calledWithMatch(arg1, arg2, ...);`

Returns `true` if call received matching arguments (and possibly others).
This behaves the same as `spyCall.calledWith(sinon.match(arg1), sinon.match(arg2), ...)`.


### `spyCall.notCalledWith(arg1, arg2, ...);`

Returns `true` if call did not receive provided arguments.


### `spyCall.notCalledWithMatch(arg1, arg2, ...);`

Returns `true` if call did not receive matching arguments.
This behaves the same as `spyCall.notCalledWith(sinon.match(arg1), sinon.match(arg2), ...)`.

### `spyCall.returned(value);`

Returns `true` if spied function returned the provided `value` on this call.

Uses deep comparison for objects and arrays. Use `spyCall.returned(sinon.match.same(obj))` for strict comparison (see [matchers][matchers]).

### `spyCall.threw();`

Returns `true` if call threw an exception.


### `spyCall.threw("TypeError");`

Returns `true` if call threw exception of provided type.


### `spyCall.threw(obj);`

Returns `true` if call threw provided exception object.


### `spyCall.thisValue;`

The call's `this` value.


### `spyCall.args;`

Array of received arguments.


### `spyCall.exception;`

Exception thrown, if any.


### `spyCall.returnValue;`

Return value.

[matchers]: ../matchers
