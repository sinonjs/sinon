---
title: Matchers
description: Flexible argument matching for assertions. Make tests more expressive with fuzzy or specific value matching.
---

# Matchers

## Introduction

Matchers can be passed as arguments to [`spy.calledOn`][spy-called-on], [`spy.calledWith`][spy-called-with], [`spy.returned`][spy-returned] and the
corresponding [`sinon.assert`][assert] functions as well as [`spy.withArgs`][spy-with-args]. Matchers allow to be either more fuzzy or more specific about the expected value.

<<< @/.vitepress/tests/docs/matchers/_index-1.test.js

<<< @/.vitepress/tests/docs/matchers/_index-2.test.js

[assert]: /concepts/assertions/
[spy-called-on]: /concepts/spies/api/called-on
[spy-called-with]: /concepts/spies/api/called-with
[spy-returned]: /concepts/spies/api/returned
[spy-with-args]: /concepts/spies/api/with-args
