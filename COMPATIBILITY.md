# Compatibility

This file is the canonical resource for compatibility goals for the libraries that make up Sinon.JS.

## ES2017

Sinon has historically been written as [ES5][es5], but starting from Sinon 10 we made the breaking change to allow more modern ECMAScript versions, starting with ECMAScript [2017][es2017].
The source version is [ES2017][es2017] and requires no transpiler or polyfills in supporting runtimes.

For legacy runtimes, a transpiler can be used by dependent projects., but use of newer APIs might break. If you need to support older browsers, have a look at Sinon 9.

## Runtimes

Sinon.JS aims at supporting the following runtimes (from our shared [eslint-config][shared-config]).

<!-- browserslist start -->

```
> 0.5%
last 2 versions
Firefox ESR
not dead
not IE 11
not op_mini all
maintained node versions
```

<!-- browserslist end -->

The compatibility is enforced using [`eslint-plugin-compat`](https://www.npmjs.com/package/eslint-plugin-compat).

To see what that means in practice, you can use https://browserslist.dev

<p align=center>
<a href="https://saucelabs.com/u/sinonjs"><img src="https://saucelabs.com/browser-matrix/sinonjs.svg" alt="Sauce Test Status"></a>
</p>

## Previous supported Node.js

The following table serves as an orientation if support for an older unsupported Node.js version is required.

| Sinon.JS | supported Node.js |
| :------: | :---------------: |
|    18    |    18, 20, 22     |
|    17    |      18, 20       |
|    16    |    16, 18, 20     |
|    15    |    14, 16, 18     |
|    14    |    14, 16, 18     |
|    13    |    12, 14, 16     |
|    12    |    12, 14, 16     |
|    11    |      12, 14       |
|    10    |    10, 12, 14     |
|    9     |      10, 12       |
|    8     |     8, 10, 12     |

[es5]: http://www.ecma-international.org/ecma-262/5.1/
[es2017]: https://262.ecma-international.org/8.0/
[shared-config]: https://github.com/sinonjs/eslint-config
