---
title: Sandboxes
description: Manage multiple fakes, spies, and stubs with automatic cleanup. Simplifies test teardown by grouping related fakes.
---

# Sandboxes

## Introduction

Sandboxes remove the need to keep track of every fake created, which greatly simplifies cleanup.

## Default sandbox

The `sinon` object itself is a sandbox, known as the _default sandbox_.

It has all the methods and properties as the [sandbox API][sandbox-api].

## Using the default sandbox

This is the recommended way to use sandboxes.

<<< @/.vitepress/tests/docs/sandboxes/_index-1.test.js

## Using a custom sandbox

Unless you have an advanced setup or need a divergent configuration, you probably want to only use the default sandbox.

<<< @/.vitepress/tests/docs/sandboxes/_index-2.test.js

[sandbox-api]: ./api/
