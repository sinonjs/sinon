---
layout: page
title: JSON-P - Sinon.JS
breadcrumb: JSON-P
---

# JSON-P

JSON-P doesn't use `XHR` requests, which is what the fake server is concerned with. A JSON-P request creates a script element and inserts it into the document.

There is no sufficiently unobtrusive way to fake this automatically. The best option is to simply stub jQuery in this case:

```javascript
sinon.stub(jQuery, "ajax");
sinon.assert.calledOnce(jQuery.ajax);
```

We could potentially have had the fake server detect `jQuery` and fake any calls to `jQuery.ajax` when JSON-P is used, but that felt like a compromise in the focus of the Sinon project compared to simply documenting the above practice.
