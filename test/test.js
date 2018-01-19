const fs = require('fs')
const path = require('path')
const globby = require('globby')
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

const genSuit = (t, p) => {
  let def = Array.isArray(t) ? {cases: t} : t
  const {suit = p} = def
  const fn = def.only ? describe.only : def.skip ? describe.skip : describe
  fn(suit, () => {
    def.cases.forEach(genCase)
  })
}

const genCase = ({i, o, t, only, skip}, idx) => {
  const fn = only ? it.only : skip ? it.skip : it
  fn(`case #${idx + 1}${t ? `: ${t}` : ''}`, () => {
    expect(tr(i)).to.equal(f(o))
  })
}

(async () => {
  const paths = await globby('*.yml', {
    cwd: __dirname,
  })

  paths.forEach(p => {
    const txt = fs.readFileSync(path.resolve(__dirname, p))
    const t = yaml.safeLoad(txt)
    genSuit(t, p)
  })

  run()
})()
