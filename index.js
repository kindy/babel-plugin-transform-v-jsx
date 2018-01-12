module.exports = function({types: t}) {

  return {
    visitor: {
      JSXElement(path) {
        const nsAttrs = path.node.openingElement.attributes.filter(
          x =>
            x.type === 'JSXAttribute' &&
            x.name.type === 'JSXNamespacedName' &&
            x.name.namespace.name === 'v' &&
            (x.name.name.name === 'if' || x.name.name.name === 'class' || x.name.name.name === 'wrap'),
        )
        if (nsAttrs.length) {
          const attrs = path.node.openingElement.attributes
          nsAttrs.forEach(x => {
            const idx = attrs.indexOf(x)
            attrs.splice(idx, 1)
          })

          nsAttrs.sort((a, b) => (a.name.name.name === 'if' ? 1 : b.name.name.name ? -1 : 0)).forEach(x => {
            // const idx = path.node.openingElement.attributes.indexOf(x);
            // console.log('attr.exp', x.value, path.node, path.node, idx);
            switch (x.name.name.name) {
              case 'if':
                // path.node.openingElement.attributes.splice(idx, 1);
                // console.log('path', path);
                const val = x.value ? t.ConditionalExpression(x.value.expression || x.value, path.node, t.nullLiteral()) : t.nullLiteral()
                path.replaceWith(path.parent.type.match(/^jsx/i) ? t.JSXExpressionContainer(val) : val)
                break
              case 'class':
                if (path.node.openingElement.attributes.filter(x => x.type === 'JSXAttribute' && x.name.name === 'className').length) {
                  throw new Error('v:class can not use with className')
                }
                // console.log('v:class', x);
                // path.node.openingElement.attributes.splice(idx, 1);
                attrs.push(x)
                x.name = t.JSXIdentifier('className')
                x.value &&
                (x.value = t.JSXExpressionContainer(
                  t.CallExpression(t.MemberExpression(t.Identifier('React'), t.Identifier('_extFixClassName')), [x.value.expression || x.value]),
                ))
                //
                break
              case 'wrap':
                // console.log(path.node, x);
                // path.node.openingElement.attributes.splice(idx, 1);
                const w = x.value.expression
                if (w.children) {
                  if (!w.closingElement) {
                    // console.log(t.JSXClosingElement(t.JSXIdentifier(w.openingElement.name.name)));
                    w.closingElement = t.JSXClosingElement(t.JSXIdentifier(w.openingElement.name.name))
                  }
                  // w.children.push(path.node);
                  // console.log(w);
                  path.replaceWith(
                    t.JSXElement(
                      t.JSXOpeningElement(t.JSXIdentifier(w.openingElement.name.name), w.openingElement.attributes),
                      t.JSXClosingElement(t.JSXIdentifier(w.openingElement.name.name)),
                      [path.node],
                      false,
                    ),
                  )
                }
                break
            }
          })
        }
      },
    },
  }
}
