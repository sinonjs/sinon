---
layout: page
title: Migrating to v7.0 - Sinon.JS
breadcrumb: migrating to 7.0
---

For users upgrading to Sinon 7 the only known breaking API change is that **negative ticks** are not allowed in `Sinon@7` due to updating to lolex 3 internally. This means you cannot use negative values in sinon.useFakeTimers().tick();

If you experience any issues moving from Sinon 6 to Sinon 7, [please let us know!](https://github.com/sinonjs/sinon/issues/new?template=Bug_report.md).
