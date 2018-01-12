const chai = require('chai')
const yaml = require('js-yaml')
const {expect} = chai
const babel = require('babel-core')
const prettier = require('prettier');

const options = {
  ast: false,
  babelrc: false,
  plugins: [
    'syntax-jsx',
    './index.js',
  ],
}
const f = i => prettier.format(i, {semi: false})
const tr = i => f(babel.transform(i, options).code)

const genCase = ({i, o, t}, idx) => {
  it(`case #${idx + 1}${t ? `: ${t}` : ''}`, () => {
    expect(tr(i)).to.equal(f(o))
  })
}


describe('v:if', () => {
  yaml.safeLoad(`
  - i: |
      <a><b v:if={a} /></a>
    o: |
      <a>{a ? <b/> : null}</a>

  - i: |
      <a><b v:if="a" /></a>
    o: |
      <a>{"a" ? <b/> : null}</a>

  - i: |
      <a><b v:if /></a>
    o: |
      <a>{null}</a>

  - t: 'v:if in root'
    i: |
      <a v:if={a}><b /></a>
    o: |
      a ? <a><b /></a> : null

  - t: 'v:if in root'
    i: |
      <a v:if="a"><b /></a>
    o: |
      "a" ? <a><b /></a> : null

  - t: 'v:if in root'
    i: |
      <a v:if><b /></a>
    o: |
      null
  `).forEach(genCase)
})

describe('v:class', () => {
  yaml.safeLoad(`
  - i: |
      <a v:class="a" />
    o: |
      <a className={React._extFixClassName("a")} />

  - i: |
      <a v:class={a} />
    o: |
      <a className={React._extFixClassName(a)} />

  - i: |
      <a v:class />
    o: |
      <a className />
  `).forEach(genCase)
})

/*
<div className={React._extFixClassName(null)}>
</div>
      <Tooltip title={'ab'}><a /></Tooltip>
</div>
 */

describe('v:wrap', () => {
  yaml.safeLoad(`
  - i: |
      <c>
        <a v:wrap={<A v:if="1" title={'ab'} />} />
      </c>
    o: |
      <c>
        {("1" ? <A title={'ab'}><a /></A> : null)}
      </c>

  - i: |
      <c>
        <a v:if="2" v:wrap={<A/>} />
      </c>
    o: |
      <c>
        {("2" ? <A><a /></A> : null)}
      </c>

  - i: |
      <c>
        <a v:if="2" v:wrap={<A v:if="1"/>} />
      </c>
    o: |
      <c>
        {("2" ? ("1" ? <A><a /></A> : null) : null)}
      </c>

  - t: 'v:wrap in root'
    i: |
      <a v:wrap={<A v:if="1"/>} />
    o: |
      ("1" ? <A><a /></A> : null)

  - t: 'v:wrap in root'
    i: |
      <a v:if="2" v:wrap={<A />} />
    o: |
      ("2" ? <A><a /></A> : null)

  - t: 'v:wrap in root'
    i: |
      <a v:if="2" v:wrap={<A v:if="1"/>} />
    o: |
      ("2" ? ("1" ? <A><a /></A> : null) : null)
  `).forEach(genCase)
})
