# babel-plugin-transform-v-jsx

> Make JSX better to use

[![npm version](https://img.shields.io/npm/v/babel-plugin-transform-v-jsx.svg?style=flat-square)](https://www.npmjs.com/package/babel-plugin-transform-v-jsx)

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
