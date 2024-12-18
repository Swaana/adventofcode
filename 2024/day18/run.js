console.time('part1')
console.time('part2')

const readInput = require('../../utils/readInput')
const { printGrid } = require('../../utils/printGrid')

/*
   TEST
 */
// const input = readInput(__dirname, 'inputTST.txt')
// const MAX_X = 6
// const MAX_Y = 6
// const bytes = 12

/*
   REAL
 */
const input = readInput(__dirname, 'input.txt')
const MAX_X = 70
const MAX_Y = 70
const bytes = 1024

const coordKey = (x, y) => `${x},${y}`
const key2Coords = (key) => {
  const [x, y] = key.split(',').map(Number)
  return { x, y }
}

const coords = input.split('\n').filter(l => !!l).map(key2Coords)

function simulate (bytes) {
  const grid = new Array(MAX_Y + 1).fill([]).map(() => new Array(MAX_X + 1).fill('.'))
  coords.forEach(({ x, y }, i) => {
    if (i < bytes) {
      grid[y][x] = '#'
    }
  })
  return grid
}

// Dijkstras shortest path
class Queue {
  constructor () {
    this.queue = []
  }

  enqueue (key) {
    this.queue.push({ key })
  }

  dequeue () {
    if (this.isEmpty()) {
      return null
    }
    return this.queue.shift().key
  }

  isEmpty () {
    return this.queue.length === 0
  }
}

function shortestPath (grid) {
  const visited = new Set()
  const nodes = {}

  // Collect all Nodes
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === '.') {
        const connections = []

        // right
        if (grid[y][x + 1] === '.') {
          connections.push(coordKey(x + 1, y))
        }
        // down
        if (grid[y + 1]?.[x] === '.') {
          connections.push(coordKey(x, y + 1))
        }
        // left
        if (grid[y][x - 1] === '.') {
          connections.push(coordKey(x - 1, y))
        }
        // up
        if (grid[y - 1]?.[x] === '.') {
          connections.push(coordKey(x, y - 1))
        }

        nodes[coordKey(x, y)] = { dist: Infinity, connections }
      }
    }
  }

  const q = new Queue()
  nodes['0,0'].dist = 0
  q.enqueue('0,0')

  while (!q.isEmpty()) {
    const key = q.dequeue()

    if (visited.has(key)) continue
    visited.add(key)

    const node = nodes[key]

    for (const connKey of node.connections) {

      const target = nodes[connKey]
      if (!visited.has(connKey) &&
        node.dist + 1 < target.dist) {
        target.dist = node.dist + 1
        q.enqueue(connKey)
      }
    }
  }

  // console.log(nodes)

  return nodes[coordKey(grid[0].length - 1, grid.length - 1)].dist
}


const grid = simulate(bytes)
// printGrid(grid)

const part1 = shortestPath(grid)

console.log('part1', part1)
console.timeEnd('part1')

function getCutoffCoord () {
  for (let i = bytes; i < coords.length; i++) {
    const { x, y } = coords[i]
    grid[y][x] = '#'
    if (shortestPath(grid) === Infinity) {
      // it just got cut off
      return coordKey(x, y)
    }
  }
}

const part2 = getCutoffCoord()
console.log('part2', part2)
console.timeEnd('part2')
