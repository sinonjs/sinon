---
layout: page
title: API documentation - Sinon.JS
skip_ad: true
release_id: master
---

# {{page.title}} - `{{page.release_id}}`

This page contains the entire Sinon.JS API documentation along with brief introductions to the concepts Sinon implements.

- [General setup](./general-setup)
- [Fakes](./fakes)
- [Spies](./spies)
- [Stubs](./stubs)
- [Mocks](./mocks)
- [Spy calls](./spy-call)
- [Fake timers](./fake-timers)
- [Fake <code>XHR</code> and server](./fake-xhr-and-server)
- [JSON-P](./json-p)
- [Assertions](./assertions)
- [Matchers](./matchers)
- [Sandboxes](./sandbox)
- [Utils](./utils)

{% include docs/migration-guides.md %}

## Compatibility

The most up-to-date reference on which runtimes and browsers we support can be found by looking at our shared [eslint-config][shared-config].

### ECMAScript versions

Sinon has historically been written as [ES5][es5], but starting from Sinon 10 we made the breaking change to use more modern ECMAScript versions, starting with ECMAScript [2017][es2017]. `{{page.release_id}}` requires no transpiler or polyfills to run in the runtimes mentioned below.

### Supported runtimes

As of Sinon 10 we stopped maintaining compatibility with legacy browsers. Instead, we focus on compatibility with evergreen browsers, [Node.js LTS versions](https://github.com/nodejs/Release) and recent Safari versions.

There should not be any issues with using Sinon `{{page.release_id}}` in newer versions of the same runtimes.

If you need to support old runtimes you can try one of the older Sinon versions.

{% include docs/contribute.md %}

[es5]: http://www.ecma-international.org/ecma-262/5.1/
[es2017]: http://www.ecma-international.org/ecma-262/8.0/
[shared-config]: https://github.com/sinonjs/eslint-config
