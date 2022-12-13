const readInput = require('../utils/readInput')
const input = readInput(__dirname, 'input.txt')

class Position {
  nodes = []
  shortestPath = null;
  isVisited = false;
  constructor (char, x, y) {
    this.location = { x, y }
    this.char = char
    let elevationChar = char
    if (char === 'S') {
      elevationChar = 'a'
      this.isStart = true
    }
    if (char === 'E') {
      elevationChar = 'z'
      this.isEnd = true
    }
    this.elevation = elevationChar.charCodeAt(0)
  }

  visit() {
    this.nodes.forEach(node => node.setPath([...this.shortestPath, this]))
    if (!this.isVisited) {
      this.isVisited = true;
      this.nodes.forEach(node => node.visit())
    }
  }

  setPath(pathSoFar) {
    if (!this.shortestPath || this.shortestPath.length > pathSoFar.length) {
      this.shortestPath = pathSoFar;
      this.nodes.forEach(node => {
        if (node.isVisited) {
          node.setPath([...this.shortestPath, this])
        }
      })
    }
  }

  toString () {
    return `${this.char} (${this.location.x},${this.location.y})`
  }
}

let startPosition, endPosition
const grid = input
  .split('\n')
  .map((l, y) => [...l]
    .map((p, x) => {
      const position = new Position(p, x, y)
      if (position.isStart) {
        startPosition = position
      }
      if (position.isEnd) {
        endPosition = position
      }

      return position
    }))
grid.pop()

grid.forEach((row, y) => {
  row.forEach((position, x) => {
    if (x > 0 && position.elevation + 1 >= grid[y][x - 1].elevation) {
      position.nodes.push(grid[y][x - 1])
    }
    if (y > 0 && position.elevation + 1 >= grid[y - 1][x].elevation) {
      position.nodes.push(grid[y - 1][x])
    }
    if (x < grid[y].length - 1 && position.elevation + 1 >= grid[y][x + 1].elevation) {
      position.nodes.push(grid[y][x + 1])
    }
    if (y < grid.length - 1 && position.elevation + 1 >= grid[y + 1][x].elevation) {
      position.nodes.push(grid[y + 1][x])
    }
  })
})

// OK lets visit all the nodes.
startPosition.shortestPath = [];
startPosition.visit();
console.log('part1', endPosition.shortestPath.length)
// console.log(endPosition.nodes)
// console.log('part1', path.length - 1)
// console.log(grid.map(line => line.map(p => p.distanceToEnd)))
