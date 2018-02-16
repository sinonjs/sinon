---
layout: page
title: Migrating to v4.0 - Sinon.JS
breadcrumb: migrating to 4.0
---

As with all `MAJOR` releases in [`semver`](http://semver.org/), there are breaking changes in `sinon@4`.
This guide will walk you through those changes.

## `sinon.stub(obj, 'nonExistingProperty')` - Throws

Trying to stub a non-existing property will now fail, to ensure you are creating
[less error-prone tests](https://github.com/sinonjs/sinon/pull/1557).

