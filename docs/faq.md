---
layout: page
title: Frequently Asked Questions
---

# Frequently Asked Questions

## Property Descriptor Errors

### "Descriptor for property X is non-configurable and non-writable"

If you encounter an error like this:

```
TypeError: Descriptor for property toBeMocked is non-configurable and non-writable
```

This error occurs when Sinon tries to stub or spy on a property that has been defined as immutable by JavaScript's property descriptor system. This is not a bug in Sinon, but rather a limitation imposed by the JavaScript engine itself.

#### Common Causes

1. **ES Module transpilation**: When ES modules are transpiled to CommonJS (e.g., by TypeScript, Babel, or SWC), the exported properties often become non-configurable and non-writable.

2. **Object.freeze() or Object.seal()**: Objects that have been frozen or sealed have immutable properties.

3. **Native browser/Node.js APIs**: Some built-in objects and their properties are inherently immutable.

4. **Third-party libraries**: Some libraries define their exports with non-configurable descriptors.

#### Solutions

1. **Use dependency injection**: Instead of stubbing the import directly, pass the dependency as a parameter:

   ```javascript
   // Instead of this:
   import { toBeMocked } from './module';
   sinon.stub(module, 'toBeMocked'); // This might fail

   // Do this:
   function myFunction(dependency = toBeMocked) {
     return dependency();
   }

   // In tests:
   const stub = sinon.stub();
   myFunction(stub);
   ```

2. **Stub at the module level**: For ES modules, consider using a tool like `proxyquire` or `testdouble.js` for module-level mocking.

3. **Use dynamic imports**: Dynamic imports can sometimes work around transpilation issues:

   ```javascript
   // In your test
   const module = await import('./module');
   sinon.stub(module, 'toBeMocked');
   ```

4. **Restructure your code**: Consider whether the code under test can be refactored to be more testable.

#### For TypeScript Users

When using TypeScript with SWC or similar transpilers, see our [TypeScript with SWC guide]({% link _howto/typescript-swc.md %}) for specific solutions.

#### Further Reading

- [MDN: Object.getOwnPropertyDescriptor()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)
- [MDN: Property descriptors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#Description)
- [How-to: Stub dependencies in CommonJS]({% link _howto/stub-dependency.md %})