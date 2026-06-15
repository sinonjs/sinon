# Documentation Tests

This directory contains executable test files extracted from documentation examples.

## Overview

Each test file corresponds to a code example in the documentation. The test files are the single source of truth — code blocks in the markdown should match the tests.

## Structure

The directory structure mirrors `docs/concepts/`:

- `docs/concepts/spy-call/api/called-after.md` → `tests/docs/spy-call/api/called-after.test.js`
- Multiple tests from one markdown file get numbered: `_index-1.test.js`, `_index-2.test.js`

Each test file includes a source comment indicating which markdown file it came from.

## Running Tests

Run all documentation tests:

```sh
npm run test:docs
```

Run a specific test:

```sh
tap tests/docs/spy-call/api/called-after.test.js
```

## Maintenance

**Adding new examples:**

1. Create a test file in the appropriate directory
2. Add source comment: `// Source: docs/concepts/path/to/file.md`
3. Write your tap test
4. Include the code directly in the markdown file inside a fenced `js` block

**Modifying examples:**

1. Edit the test file directly
2. Run `npm run test:docs` to verify it works
3. Update the corresponding markdown code block if needed

## Design Document

See `docs/plans/2026-02-09-executable-doc-tests-design.md` for the full design rationale.
