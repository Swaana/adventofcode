const fs = require('fs')
const path = require('path')

function readInput (baseDir, fileName) {
 return fs.readFileSync(path.resolve(baseDir, fileName), 'utf-8')
}

module.exports = {
 readInput,
 readInputLines: (baseDir, fileName) => {
  return readInput(baseDir, fileName).split('\n')
 }
}
