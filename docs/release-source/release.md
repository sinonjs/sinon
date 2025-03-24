---
layout: page
title: API documentation - Sinon.JS
skip_ad: true
release_id: master
sort_id: master
---

# {{page.title}} - `{{page.release_id}}`

This page contains the entire Sinon.JS API documentation along with brief introductions to the concepts Sinon implements.

- [General setup](./general-setup)
- [Fakes](./fakes)
- [Spies](./spies)
- [Stubs](./stubs)
- [Mocks](./mocks)
- [Spy calls](./spy-call)
- [Promises](./promises)
- [Fake timers](./fake-timers)
- [JSON-P](./json-p)
- [Assertions](./assertions)
- [Matchers](./matchers)
- [Sandboxes](./sandbox)
- [Utils](./utils)

{% include docs/migration-guides.md %}

## Compatibility and supported runtimes

As of Sinon 10 we stopped maintaining compatibility with legacy browsers. Instead, we focus on compatibility with evergreen browsers, [Node.js LTS versions](https://github.com/nodejs/Release) and recent Safari versions.
The most up-to-date reference on which runtimes and browsers we support can be found by looking at our [compatibility docs][compat-doc].

If you need to support old runtimes you can try [Sinon 9][compat-doc-v9].

{% include docs/contribute.md %}

[compat-doc]: https://github.com/sinonjs/sinon/blob/main/COMPATIBILITY.md
[compat-doc-v9]: https://github.com/sinonjs/sinon/blob/v9.2.4/COMPATIBILITY.md
