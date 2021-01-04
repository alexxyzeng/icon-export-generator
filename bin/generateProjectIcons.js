#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const result = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'result.json'), 'utf-8'))

let icons = {}

const ThemeEnum = {
  outline: 'Outline',
  fill: 'Fill',
  twoTone: 'TwoTone'
}

for (let i of result) {
  for (let j in i) {
    const iconList = i[j]
    iconList.forEach(icon => {
      const { type, theme = 'outline' } = icon
      const iconName = toUpperCase(type) + ThemeEnum[theme]
      if (!icons[iconName]) {
        icons[iconName] = `export { default as ${iconName} } from '@ant-design/icons/lib/${theme.toLowerCase()}/${iconName}'`
      }
    })
  }
}

fs.writeFileSync('project.json', JSON.stringify(icons, null, 2))

const iconList = []
for (let i in icons) {
  iconList.push(icons[i])
}
fs.writeFileSync(path.resolve(__dirname, 'icon.js'), iconList.join('\n'))


function toUpperCase(name) {
  const nameList = name.split('-')
  return nameList.map(nameItem => {
    const initial = nameItem.slice(0, 1)
    const restStr = nameItem.slice(1, nameItem.length)
    return initial.toUpperCase() + restStr
  }).join('')
}

