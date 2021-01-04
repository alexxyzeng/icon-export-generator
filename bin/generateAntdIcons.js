#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const babel = require('@babel/core')

const parseAntdIcon = require('../parseAntdIcon')
const parseProjectIcon = require('../parseProjectIcon')


const cwd = process.cwd()

const iconPath = path.resolve(__dirname, 'project.json')
let result = []
if (fs.existsSync(iconPath)) {
  result = JSON.parse(fs.readFileSync(iconPath, 'utf-8'))
}

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

// getAntDIcons(cwd)

getProjectIcons(cwd)


function isValidComponentPath(pathName) {
  return pathName.match(/.(t|j)sx?$/) && !pathName.endsWith('d.ts') && !pathName.endsWith('.ejs')
}

function isValidComponentDirectory(pathName) {
  // return !pathName.includes('__test__') && !pathName.includes('demo') && !pathName.includes('_snapshots__')
  return !pathName.match(/(tests|demo|__snapshots__|_util|style|util|enum|helper|.umi)/)
}

// TODO: 增加解析项目中的Icon
// TODO: 解析Icon路径和名称
// TODO: 生成导入alias