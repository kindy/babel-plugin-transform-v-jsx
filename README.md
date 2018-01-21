# babel-plugin-transform-v-jsx

[![build status](https://img.shields.io/travis/kindy/babel-plugin-transform-v-jsx/master.svg?style=flat-square)](https://travis-ci.org/kindy/babel-plugin-transform-v-jsx)
[![npm version](https://img.shields.io/npm/v/babel-plugin-transform-v-jsx.svg?style=flat-square)](https://www.npmjs.com/package/babel-plugin-transform-v-jsx)


## `v:if`

Make conditional render simple.

```js
<button v:if={showButton} />


<button v:if />
```

## `v:class`

Support object & array type className that just like Vue(need to impl `React._extFixClassName`).


```js
<button v:class={{active: isActive}} />
```

## `v:wrap`

Make use of HoC more simple.

```js
<a v:wrap={<Tooltip title="abc" />}>i</a>
```
