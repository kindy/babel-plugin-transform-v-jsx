# babel-plugin-transform-v-jsx

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
