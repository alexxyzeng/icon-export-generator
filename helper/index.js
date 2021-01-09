function isValidComponentPath(pathName) {
  return pathName.match(/.(t|j)sx?$/) && !pathName.endsWith('d.ts') && !pathName.endsWith('.ejs')
}

function isValidComponentDirectory(pathName) {
  // return !pathName.includes('__test__') && !pathName.includes('demo') && !pathName.includes('_snapshots__')
  // console.log(pathName, '--- pathname')
  return !pathName.match(/(node_modules|.git|tests|demo|__snapshots__|_util|style|util|enum|helper|.umi|.vscode|yarn)/)
}

module.exports = {
  isValidComponentDirectory,
  isValidComponentPath
}