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
  const suitFn = def.only ? describe.only : def.skip ? describe.skip : describe
  suitFn(suit, () => {
    def.cases.forEach(genCase)
  })
}

const genCase = ({i, o, t, only, skip, throw: $throw}, idx) => {
  const caseFn = only ? it.only : skip ? it.skip : it
  caseFn(`case #${idx + 1}${t ? `: ${t}` : ''}`, () => {
    if ($throw) {
      expect(() => tr(i)).to.throw($throw);
    } else {
      expect(tr(i)).to.equal(f(o))
    }
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
