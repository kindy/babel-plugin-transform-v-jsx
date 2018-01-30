const directives = require('./lib/directives');


module.exports = function({types: t}) {

  return {
    visitor: {
      JSXElement(path) {
        const vAttrs = path.node.openingElement.attributes.filter(
          x =>
            x.type === 'JSXAttribute' &&
            x.name.type === 'JSXNamespacedName' &&
            x.name.namespace.name === 'v' &&
            (x.name.name.name === 'if' || x.name.name.name === 'class' || x.name.name.name === 'wrap'),
        )
        if (vAttrs.length) {
          // console.log('node', path.node, vAttrs);

          const attrs = path.node.openingElement.attributes
          vAttrs.forEach(x => {
            const idx = attrs.indexOf(x)
            attrs.splice(idx, 1)
          })

          const ctx = {};
          const arg = {
            t,
            ctx,
            path,
            attrs,
          };

          const sortedVAttrs = vAttrs.sort((a, b) => (a.name.name.name === 'if' ? 1 : b.name.name.name === 'if' ? -1 : 0))
          // console.log('attrs', vAttrs.map(x => x.name.name.name), sortedVAttrs.map(x => x.name.name.name));

          sortedVAttrs
            .forEach(attr => {
            // const idx = path.node.openingElement.attributes.indexOf(attr);
            // console.log('attr.exp', attr.value, path.node, path.node, idx);
            const d = directives[attr.name.name.name];

            if (d) {
              d(attr, arg)
            }
          })

        }
      },
    },
  }
}
