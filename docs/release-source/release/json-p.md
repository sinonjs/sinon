---
layout: page
title: JSON-P - Sinon.JS
breadcrumb: JSON-P
---

# JSON-P

A JSON-P request creates a script element and inserts it into the document.

There is no sufficiently unobtrusive way to fake this automatically. The best option is to stub jQuery in this case:

```javascript
sinon.stub(jQuery, "ajax");
sinon.assert.calledOnce(jQuery.ajax);
```
