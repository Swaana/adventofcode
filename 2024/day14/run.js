console.time('part1')
console.time('part2')

const readInput = require('../../utils/readInput')

// TST
// const input = readInput(__dirname, 'inputTst.txt')
// const MAX_X = 11
// const MAX_Y = 7

// ACTUAL
const input = readInput(__dirname, 'input.txt')
const MAX_X = 101
const MAX_Y = 103

const lines = input.split('\n').filter(l => !!l)
const robots = lines.map((l) => {
  const [p, v] = l.split(' ').map(parts => {
    const [x, y] = parts.split('=')[1].split(',').map(Number)
    return { x, y }
  })
  return { p, v }
})

function runSecond () {
  robots.forEach((r) => {
    r.p = {
      x: (r.p.x + r.v.x + MAX_X) % MAX_X,
      y: (r.p.y + r.v.y + MAX_Y) % MAX_Y
    }
  })
}

function calculateSafetyValue () {
  const splitX = Math.floor(MAX_X / 2)
  const splitY = Math.floor(MAX_Y / 2)

  const quadrants = robots.reduce((q, r) => {
    if (r.p.x < splitX && r.p.y < splitY) {
      q[0] += 1
    } else if (r.p.x > splitX && r.p.y < splitY) {
      q[1] += 1
    } else if (r.p.x < splitX && r.p.y > splitY) {
      q[2] += 1
    } else if (r.p.x > splitX && r.p.y > splitY) {
      q[3] += 1
    }
    return q
  }, [0, 0, 0, 0])

  return quadrants.reduce((a, q) => a * q, 1)
}

let treeGrid

function findTree () {
  const grid = new Array(MAX_Y).fill([]).map(() => new Array(MAX_X).fill('.'))
  robots.forEach((r) => {
    grid[r.p.y][r.p.x] = 'X'
  })

  // Ok, lets just spot the case where there is at least 20 X in a row
  const maxLength = grid.reduce((maxLen, row) => {
    const max = row.join('').split('.').reduce((length, x) => x.length > length ? x.length : length, 0)
    return max > maxLen ? max : maxLen
  }, 0)

  if (maxLength > 20) {
    treeGrid = grid
    return true
  }
  return false
}

let seconds = 0
let treeFound = false
while (seconds < 100 || !treeFound) {
  runSecond(seconds + 1)
  seconds += 1

  if (seconds === 100) {
    console.log('part1', calculateSafetyValue())
    console.timeEnd('part1')
  }

  if (findTree(seconds)) {
    treeFound = true
    console.log('part2', seconds)
    console.timeEnd('part2')

    console.log()
    console.log(`See the tree`)
    console.log(treeGrid.map(row => row.join('')).join('\n'))
  }
}

