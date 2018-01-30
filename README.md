# babel-plugin-transform-v-jsx

> Make JSX better to use

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

## Directives

1. `v:if={a}`
2. `v:class={{active: true}}`
3. `v:wrap={<Tooltip />}`

TBD:

- [ ] `v:state`
- [ ] `v:model`

### `v:if`

Conditional render

```js
<button v:if={showButton} />


<button v:if />
```

### `v:class`

Support object & array type className that just like Vue(need to impl `React._extFixClassName`).


```js
<button v:class={{active: isActive}} />
```

### `v:wrap`

Make use of HoC more clean

```js
<a v:wrap={<Tooltip title="abc" />}>i</a>
```



[build-badge]: https://img.shields.io/travis/kindy/babel-plugin-transform-v-jsx/dev.svg?style=flat-square
[build]: https://travis-ci.org/kindy/babel-plugin-transform-v-jsx

[npm-badge]: https://img.shields.io/npm/v/babel-plugin-transform-v-jsx.svg?style=flat-square
[npm]: https://www.npmjs.com/package/babel-plugin-transform-v-jsx

[coveralls-badge]: https://img.shields.io/coveralls/kindy/babel-plugin-transform-v-jsx/dev.svg?style=flat-square
[coveralls]: https://coveralls.io/github/kindy/babel-plugin-transform-v-jsx

