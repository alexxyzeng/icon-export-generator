#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const babel = require('@babel/core')

const { isValidComponentDirectory, isValidComponentPath } = require('../helper')

const parseAntdIcon = require('../parseAntdIcon')
const parseProjectIcon = require('../parseProjectIcon')


const cwd = process.cwd()

const iconPath = path.resolve(__dirname, 'antd.json')
let result = []

function getAntDIcons(pathName) {
  const currentPath = path.resolve(pathName)
  const paths = fs.readdirSync(currentPath)
  paths.forEach(p => {
    const targetPath = path.resolve(pathName, p)
    const stat = fs.statSync(targetPath)
    if (stat.isDirectory() && isValidComponentDirectory(targetPath)) {
      getAntDIcons(targetPath)
    } else if (stat.isFile() && isValidComponentPath(targetPath)) {
      global.iconList = []
      const file = fs.readFileSync(targetPath, 'utf-8').toString()
      const plugins = [
        parseAntdIcon,
        ["@babel/plugin-proposal-decorators", { "legacy": true }],
      ];
      babel.transform(file, { plugins, presets: ['@babel/preset-typescript', '@babel/preset-react'], filename: 'test.tsx' })
      if (global.iconList && global.iconList.length > 0) {
        result.push({
          [targetPath.replace(cwd, '')]: global.iconList
        })
      }
    }
  })
  fs.writeFileSync(iconPath, JSON.stringify(result, null, 2))
}

getAntDIcons(cwd)
