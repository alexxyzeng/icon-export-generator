#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const projectIcons = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'project.json'), 'utf-8'))
const antdIcons = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'antd.json'), 'utf-8'))
const result = antdIcons.concat(projectIcons)

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
        // icons[iconName] = `exports.${iconName} = require('@ant-design/icons/lib/${theme.toLowerCase()}/${iconName}').default`
        icons[iconName] = `export { default as ${iconName} } from '@ant-design/icons/lib/${theme.toLowerCase()}/${iconName}'`
      }
    })
  }
}

// fs.writeFileSync('result.json', JSON.stringify(icons, null, 2))

const iconList = []
for (let i in icons) {
  iconList.push(icons[i])
}

// const template = fs.readFileSync(path.resolve(__dirname, '..', 'template.js'), 'utf-8')

fs.writeFileSync(path.resolve(process.cwd(), 'icon.js'), iconList.join('\n') + '\n')


function toUpperCase(name) {
  const nameList = name.split('-')
  return nameList.map(nameItem => {
    const initial = nameItem.slice(0, 1)
    const restStr = nameItem.slice(1, nameItem.length)
    return initial.toUpperCase() + restStr
  }).join('')
}

