# Compatibility

This file is the canonical resource for compatibility goals for the libraries that make up Sinon.JS.

## ES2017

The source is as [ES2017][es2017] and requires no transpiler or polyfills in supporting runtimes.

For legacy runtimes, a transpiler can be used by dependent projects.

## Runtimes

Sinon.JS aims at supporting the following runtimes:

```
> 0.5%
last 2 versions
Firefox ESR
not dead
not IE 11
not op_mini all
maintained node versions
```

The compatibility is enforced using [`eslint-plugin-compat`](https://www.npmjs.com/package/eslint-plugin-compat).

To see what that means in practice, you can use https://browserslist.dev

<p align=center>
<a href="https://saucelabs.com/u/sinonjs"><img src="https://saucelabs.com/browser-matrix/sinonjs.svg" alt="Sauce Test Status"></a>
</p>

[es2017]: https://262.ecma-international.org/8.0/
