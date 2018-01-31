const fs = require('fs')
const path = require('path')
const globby = require('globby')
const {expect} = require('chai')
const yaml = require('js-yaml')
const babel = require('babel-core')
const prettier = require('prettier')

const options = {
  ast: false,
  babelrc: false,
  plugins: [
    'syntax-jsx',
    './index.js',
  ],
}

// XXX: babel will transform `this` to `_this` in module top level, so we wrap our code in a function
const wrap = code => `function x() {${code}}`
const unwrap = code => code.match(/^function x\(/) ?
  code.replace(/^function x\(\) \{/, '',).replace(/\}$/, '') :
  code

const fmt = code => prettier.format(unwrap(code), {semi: false})
const transform = code => fmt(babel.transform(wrap(code), options).code)

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
      expect(() => transform(i)).to.throw($throw);
    } else {
      expect(transform(i)).to.equal(fmt(o))
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
