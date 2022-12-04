const fs = require('fs')
const path = require('path')

module.exports = function (baseDir, fileName) {
 return fs.readFileSync(path.resolve(baseDir, fileName), 'utf-8')
}
