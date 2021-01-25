const fs = require('fs')
module.exports = function() {
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
              if (typeof attribute.value.value !== 'string') {
                if (!global.errorList) {
                  global.errorList = []
                }
                global.errorList.push(attribute.loc.start)
                return
              }
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
            type,
            theme: parseType(theme)
          })
        }
        if (name.name === 'Button' || name.name === 'Avatar') {
          let type = ''
          let theme = 'outlined'
          attributes.forEach(attribute => {
            if (!attribute.name || !attribute.value) {
              return
            }
            if (attribute.name.name === 'icon') {
              if (typeof attribute.value.value !== 'string') {
                if (!global.errorList) {
                  global.errorList = []
                }
                global.errorList.push(attribute.loc.start)
                return
              }
              type = attribute.value.value
              if (!type || !theme) {
                return
              }
              if (!global.iconList) {
                global.iconList = []
              }
              global.iconList.push({
                type,
                theme: parseType(theme)
              })
            }
          })
        }
      }
    }
  }
}

function parseType(theme) {
  const typeEnum = {
    filled: 'fill',
    outlined: 'outline',
    twoTone: 'twoTone'
  }
  return typeEnum[theme]
}
