---
title: spy.printf
description: '`spy.printf("format string", [arg1, arg2, ...]);`'
---

# `spy.printf`

`spy.printf("format string", [arg1, arg2, ...]);`

Returns the passed format string with the following replacements performed:

<dl>
  <dt><code>%n</code></dt>
  <dd>the name of the spy ("spy" by default)</dd>

  <dt><code>%c</code></dt>
  <dd>the number of times the spy was called, in words ("once", "twice", etc.)</dd>

  <dt><code>%C</code></dt>
  <dd>a list of string representations of the calls to the spy, with each call prefixed by a newline and four spaces</dd>

  <dt><code>%t</code></dt>
  <dd>a comma-delimited list of <code>this</code> values the spy was called on</dd>

  <dt><code>%<var>n</var></code></dt>
  <dd>the formatted value of the <var>n</var>th argument passed to <code>printf</code></dd>

  <dt><code>%*</code></dt>
  <dd>a comma-delimited list of the (non-format string) arguments passed to <code>printf</code></dd>

  <dt><code>%D</code></dt>
  <dd>a multi-line list of the arguments received by all calls to the spy</dd>
</dl>

<<< ../../../.vitepress/tests/docs/spies/api/printf.test.js
