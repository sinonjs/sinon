---
title: Assertions
description: Built-in assertions that mirror spy/stub behavior. Provides detailed error messages when assertions fail.
---

# Assertions

Sinon.JS ships with a set of assertions that mirror most behavior verification methods and properties on [fakes][fakes], [spies][spies] and [stubs][stubs].

The advantage of using the assertions is that failed expectations on [fakes][fakes], [spies][spies] and [stubs][stubs] can be expressed directly as assertion failures with detailed and helpful error messages.

## Examples

### Without `sinon.assert`

<<< @/.vitepress/tests/docs/assertions/_index-1.test.js

### With `sinon.assert`

<<< @/.vitepress/tests/docs/assertions/_index-2.test.js

## Integrations

- [jest-sinon](https://www.npmjs.com/package/jest-sinon)
- [referee-sinon](https://github.com/sinonjs/referee-sinon?tab=readme-ov-file#referee-sinon) - from the makers of Sinon 🙂
- [sinon-chai](https://github.com/chaijs/sinon-chai#readme)

To make sure assertions integrate nicely with your assertion framework, you should customize [`sinon.assert.fail`][fail] and look into [`sinon.assert.expose`][expose] and [`sinon.assert.pass`][pass].

[expose]: ./api/expose
[fail]: ./api/fail
[pass]: ./api/pass
[fakes]: /concepts/fakes/
[spies]: /concepts/spies/
[stubs]: /concepts/stubs/
