const fs = require('fs')
const path = require('path')

module.exports = function (baseDir, fileName) {
 const dataDir = path.join(__dirname, '..', 'data', path.relative(__dirname, baseDir).substring(3));
 console.log(dataDir)
 return fs.readFileSync(path.resolve(dataDir, fileName), 'utf-8').replaceAll('\r', '')
}
