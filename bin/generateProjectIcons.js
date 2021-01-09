#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const babel = require('@babel/core')

const { isValidComponentDirectory, isValidComponentPath } = require('../helper')

const parseProjectIcon = require('../parseProjectIcon')


const cwd = process.cwd()

const iconPath = path.resolve(__dirname, 'project.json')
let result = []

function getProjectIcons(pathName) {
  const currentPath = path.resolve(pathName)
  const paths = fs.readdirSync(currentPath)
  paths.forEach(p => {
    const targetPath = path.resolve(pathName, p)
    const stat = fs.statSync(targetPath)
    if (stat.isDirectory() && isValidComponentDirectory(targetPath)) {
      getProjectIcons(targetPath)
    } else if (stat.isFile() && isValidComponentPath(targetPath)) {
      global.iconList = []
      const file = fs.readFileSync(targetPath, 'utf-8').toString()
      const plugins = [
        parseProjectIcon,
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-export-default-from'
        // '@babel/plugin-transform-react-jsx',
        // '@babel/plugin-syntax-jsx',
        // '@babel/plugin-transform-react-display-name',
      ];
      babel.transform(file, { plugins, presets: ['@babel/preset-react'] })
      if (global.iconList && global.iconList.length > 0) {
        result.push({
          [targetPath.replace(cwd, '')]: global.iconList
        })
      }
    }
  })
  fs.writeFileSync(iconPath, JSON.stringify(result, null, 2))
}

getProjectIcons(cwd)