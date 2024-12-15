function printGrid (grid) {
  console.log(grid.map(row => row.join('')).join('\n'))
}

module.exports = {
  printGrid
}
