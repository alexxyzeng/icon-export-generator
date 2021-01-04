const ANTD_ICON_PATH = '@ant-design/icons/'
module.exports = function () {
  return {
    visitor: {
      ImportDeclaration: function (path) {
        const sourceValue = path.node.source.value
        if (typeof sourceValue !== 'string' || !sourceValue.startsWith(ANTD_ICON_PATH)) {
          return
        }
        const iconName = sourceValue.replace(ANTD_ICON_PATH, '')
        if (!global.iconList) {
          global.iconList = []
        }
        if (iconName.endsWith('Outlined')) {
          global.iconList.push({
            type: iconName.replace('Outlined', ''),
            theme: 'outline'
          })
        }
        if (iconName.endsWith('Filled')) {
          global.iconList.push({
            type: iconName.replace('Filled', ''),
            theme: 'fill'
          })
        }
        // twoTone
        if (iconName.endsWith('TwoTone')) {
          global.iconList.push({
            type: iconName.replace('TwoTone', ''),
            theme: 'twoTone'
          })
        }
      },
    }
  }
}