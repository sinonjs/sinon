# Compatibility

This file is the canonical resource for compatibility goals for the libraries that make up Sinon.JS.

## ES5.1

The source is written as [ES5.1][es5] and requires no transpiler or polyfills.

Sinon.JS uses feature detection to support [ES6][es6] features, but does not rely on any of the new syntax introduced in [ES6][es6] and remains compatible with [ES5.1][es5] runtimes.

## Runtimes

Sinon.JS aims at supporting the following runtimes:

- Firefox 45+
- Chrome 48+
- Internet Explorer 11+
- Edge 14+
- Safari 9+
- Node LTS versions

<p align=center>
<a href="https://saucelabs.com/u/sinonjs"><img src="https://saucelabs.com/browser-matrix/sinonjs.svg" alt="Sauce Test Status"></a>
</p>

[es5]: http://www.ecma-international.org/ecma-262/5.1/
[es6]: http://www.ecma-international.org/ecma-262/6.0/
