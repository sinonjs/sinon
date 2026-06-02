---
title: Spy call
description: Access individual call details including arguments, return values, this context, and exceptions for each invocation.
---

# Spy call

A spy call is an object representation of an individual call to a _spied_ function, which could be a [fake][fakes], [spy][spies], [stub][stubs] or [mock method][mocks].

## `fake.getCall(n)`

Returns a spyCall for the `nth` call to the fake. Accessing individual calls helps with more detailed behavior verification when the fake is called more than once.

[matchers]: /concepts/matchers/
[fakes]: /concepts/fakes/
[spies]: /concepts/spies/
[stubs]: /concepts/stubs/
[mocks]: /concepts/mocks/
