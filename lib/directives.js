const directives = {
  if(attr, {t, path}) {
    const val = attr.value ?
      t.ConditionalExpression(attr.value.expression || attr.value, path.node, t.nullLiteral()) :
      t.nullLiteral()

    const {type: parentType} = path.parent
    const newNode = (parentType.match(/^jsx/i) && parentType !== 'JSXExpressionContainer') ? t.JSXExpressionContainer(val) : val
    // console.log('v:if parent', path.parent)
    path.replaceWith(newNode)
  },

  class(attr, {t, attrs, path}) {
    if (path.node.openingElement.attributes.filter(x => x.type === 'JSXAttribute' && x.name.name === 'className').length) {
      throw new Error('v:class can not use with className')
    }

    attrs.push(attr)
    attr.name = t.JSXIdentifier('className')
    if (attr.value) {
      attr.value = t.JSXExpressionContainer(
        t.CallExpression(
          // TODO: use import
          t.MemberExpression(t.Identifier('React'), t.Identifier('_extFixClassName')),
          [attr.value.expression || attr.value]
        ),
      )
    }
  },

  wrap(attr, {t, path}) {
    // console.log(path.node, attr);

    const tag = attr.value.expression
    if (tag.children) {
      if (!tag.closingElement) {
        // console.log(t.JSXClosingElement(t.JSXIdentifier(tag.openingElement.name.name)));
        tag.closingElement = t.JSXClosingElement(t.JSXIdentifier(tag.openingElement.name.name))
      }

      // TODO: this not works
      // tag.children.push(path.node);

      // console.log(tag);
      path.replaceWith(
        t.JSXElement(
          t.JSXOpeningElement(t.JSXIdentifier(tag.openingElement.name.name), tag.openingElement.attributes),
          t.JSXClosingElement(t.JSXIdentifier(tag.openingElement.name.name)),
          [path.node],
          false,
        ),
      )

    }
  },

};

module.exports = directives;
