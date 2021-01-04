module.exports = function () {
  return {
    visitor: {
      JSXElement(path) {
        const { openingElement } = path.node
        const { name, attributes } = openingElement
        if (name.name === 'Icon') {
          let type = ''
          let theme = 'outlined'
          if (!Array.isArray(attributes)) {
            return
          }
          attributes.forEach(attribute => {
            if (attribute.name.name === 'type') {
              type = attribute.value.value
            }
            if (attribute.name.name === 'theme') {
              theme = attribute.value.value
            }
          })
          if (!type || !theme) {
            return
          }
          if (!global.iconList) {
            global.iconList = []
          }
          global.iconList.push({
            type, theme
          })
        }
      }
    }
  }
}