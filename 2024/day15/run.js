console.time('part1')
console.time('part2')

const readInput = require('../../utils/readInput')
const { printGrid } = require('../../utils/printGrid')

const input = readInput(__dirname, 'input.txt')

const lines = input.split('\n').filter(l => !!l)

/**
 * PART 1
 */

const map = []
const sequence = []
const robot = { x: 0, y: 0 }

lines.forEach((l, y) => {
  if (l.startsWith('#')) {
    // it's still the map
    map.push([...l])
    if (l.indexOf('@') > -1) {
      robot.x = l.indexOf('@')
      robot.y = y
    }
  } else {
    // it's the sequence part
    sequence.push(...[...l])
  }
})

let MAX_X = map[0].length
let MAX_Y = map.length

function emptySpaceToLeft (grid, robot) {
  for (let x = robot.x - 1; x > 0; x--) {
    if (grid[robot.y][x] === '.') {
      return { x, y: robot.y }
    }
    if (grid[robot.y][x] === '#') {
      return
    }
  }
}

function emptySpaceToRight (grid, robot) {
  for (let x = robot.x + 1; x < MAX_X; x++) {
    if (grid[robot.y][x] === '.') {
      return { x, y: robot.y }
    }
    if (grid[robot.y][x] === '#') {
      return
    }
  }
}

function emptySpaceUp (grid, robot) {
  for (let y = robot.y - 1; y > 0; y--) {
    if (grid[y][robot.x] === '.') {
      return { x: robot.x, y }
    }
    if (grid[y][robot.x] === '#') {
      return
    }
  }
}

function emptySpaceDown (grid, robot) {
  for (let y = robot.y + 1; y < MAX_Y; y++) {
    if (grid[y][robot.x] === '.') {
      return { x: robot.x, y }
    }
    if (grid[y][robot.x] === '#') {
      return
    }
  }
}

function moveLeft (robot, emptySpace) {
  map[robot.y][robot.x] = '.'
  robot.x -= 1
  map[robot.y][robot.x] = '@'
  for (let x = emptySpace.x; x < robot.x; x++) {
    map[robot.y][x] = 'O'
  }
}

function moveRight (robot, emptySpace) {
  map[robot.y][robot.x] = '.'
  robot.x += 1
  map[robot.y][robot.x] = '@'
  for (let x = emptySpace.x; x > robot.x; x--) {
    map[robot.y][x] = 'O'
  }
}

function moveUp (robot, emptySpace) {
  map[robot.y][robot.x] = '.'
  robot.y -= 1
  map[robot.y][robot.x] = '@'
  for (let y = emptySpace.y; y < robot.y; y++) {
    map[y][robot.x] = 'O'
  }
}

function moveDown (robot, emptySpace) {
  map[robot.y][robot.x] = '.'
  robot.y += 1
  map[robot.y][robot.x] = '@'
  for (let y = emptySpace.y; y > robot.y; y--) {
    map[y][robot.x] = 'O'
  }
}

sequence.forEach((move, i) => {
  if (move === '<') {
    const emptySpace = emptySpaceToLeft(map, robot)
    if (emptySpace) {
      moveLeft(robot, emptySpace)
    }
  } else if (move === '>') {
    const emptySpace = emptySpaceToRight(map, robot)
    if (emptySpace) {
      moveRight(robot, emptySpace)
    }
  } else if (move === '^') {
    const emptySpace = emptySpaceUp(map, robot)
    if (emptySpace) {
      moveUp(robot, emptySpace)
    }
  } else if (move === 'v') {
    const emptySpace = emptySpaceDown(map, robot)
    if (emptySpace) {
      moveDown(robot, emptySpace)
    }
  }

  // if (i < 10) {
  //   console.log()
  //   console.log(`Move ${move}:`)
  //   printGrid(map)
  // }
})

const part1 = map.reduce((sum, row, y) => {
  return sum + row.reduce((rsum, v, x) => {
    if (v === 'O') {
      return rsum + 100 * y + x
    }
    return rsum
  }, 0)
}, 0)

console.log('part1', part1)
console.timeEnd('part1')

/**
 * PART 2
 */

const map2 = []

lines.forEach((l, y) => {
  if (l.startsWith('#')) {
    map2.push([]);
    [...l].forEach((v, x) => {
      if (v === '#' || v === '.') {
        map2[y].push(v, v)
      }
      if (v === 'O') {
        map2[y].push('[', ']')
      }
      if (v === '@') {
        map2[y].push('@', '.')
        robot.y = y
        robot.x = x * 2
      }
    })
  }
  // Sequence can be used from part1
})

// Set these values globally for part2
MAX_X = map2[0].length
MAX_Y = map2.length

/**
 * MOVE WIDE
 */

function moveWideLeft (robot, emptySpace) {
  map2[robot.y][robot.x] = '.'
  for (let x = emptySpace.x; x < robot.x - 1; x++) {
    map2[robot.y][x] = map2[robot.y][x + 1]
  }
  robot.x -= 1
  map2[robot.y][robot.x] = '@'
}

function moveWideRight (robot, emptySpace) {
  map2[robot.y][robot.x] = '.'
  for (let x = emptySpace.x; x > robot.x + 1; x--) {
    map2[robot.y][x] = map2[robot.y][x - 1]
  }
  robot.x += 1
  map2[robot.y][robot.x] = '@'
}

function canMoveBoxUp ({ x, y }) {
  if (map2[y - 1][x] === '.' && map2[y - 1][x + 1] === '.') {
    return true
  }
  if (map2[y - 1][x] === '[' && map2[y - 1][x + 1] === ']') {
    return canMoveBoxUp({ x, y: y - 1 })
  }
  if (map2[y - 1][x] === '#' || map2[y - 1][x + 1] === '#') {
    return false
  }
  let canMove = true
  if (map2[y - 1][x] === ']') {
    canMove = canMove && canMoveBoxUp({ x: x - 1, y: y - 1 })
  }
  if (map2[y - 1][x + 1] === '[') {
    canMove = canMove && canMoveBoxUp({ x: x + 1, y: y - 1 })
  }
  return canMove
}

function canMoveBoxDown ({ x, y }) {
  if (map2[y + 1][x] === '.' && map2[y + 1][x + 1] === '.') {
    return true
  }
  if (map2[y + 1][x] === '[' && map2[y + 1][x + 1] === ']') {
    return canMoveBoxDown({ x, y: y + 1 })
  }
  if (map2[y + 1][x] === '#' || map2[y + 1][x + 1] === '#') {
    return false
  }
  let canMove = true
  if (map2[y + 1][x] === ']') {
    canMove = canMove && canMoveBoxDown({ x: x - 1, y: y + 1 })
  }
  if (map2[y + 1][x + 1] === '[') {
    canMove = canMove && canMoveBoxDown({ x: x + 1, y: y + 1 })
  }
  return canMove
}

function moveBoxUp ({ x, y }) {
  // a box x is the left part of the box
  if (map2[y - 1][x] === '[') {
    moveBoxUp({ x, y: y - 1 })
  }
  if (map2[y - 1][x] === ']') {
    moveBoxUp({ x: x - 1, y: y - 1 })
  }
  if (map2[y - 1][x + 1] === '[') {
    moveBoxUp({ x: x + 1, y: y - 1 })
  }
  map2[y - 1][x] = '['
  map2[y - 1][x + 1] = ']'
  map2[y][x] = '.'
  map2[y][x + 1] = '.'
}

function moveBoxDown ({ x, y }) {
  // a box x is the left part of the box
  if (map2[y + 1][x] === '[') {
    moveBoxDown({ x, y: y + 1 })
  }
  if (map2[y + 1][x] === ']') {
    moveBoxDown({ x: x - 1, y: y + 1 })
  }
  if (map2[y + 1][x + 1] === '[') {
    moveBoxDown({ x: x + 1, y: y + 1 })
  }
  map2[y + 1][x] = '['
  map2[y + 1][x + 1] = ']'
  map2[y][x] = '.'
  map2[y][x + 1] = '.'
}

function moveWideUp (robot) {
  if (map2[robot.y - 1][robot.x] === ']' && canMoveBoxUp({ x: robot.x - 1, y: robot.y - 1 })) {
    moveBoxUp({ x: robot.x - 1, y: robot.y - 1 })
  }
  if (map2[robot.y - 1][robot.x] === '[' && canMoveBoxUp({ x: robot.x, y: robot.y - 1 })) {
    moveBoxUp({ x: robot.x, y: robot.y - 1 })
  }
  if (map2[robot.y - 1][robot.x] === '.') {
    map2[robot.y][robot.x] = '.'
    robot.y -= 1
    map2[robot.y][robot.x] = '@'
  }
}

function moveWideDown (robot) {
  if (map2[robot.y + 1][robot.x] === ']' && canMoveBoxDown({ x: robot.x - 1, y: robot.y + 1 })) {
    moveBoxDown({ x: robot.x - 1, y: robot.y + 1 })
  }
  if (map2[robot.y + 1][robot.x] === '[' && canMoveBoxDown({ x: robot.x, y: robot.y + 1 })) {
    moveBoxDown({ x: robot.x, y: robot.y + 1 })
  }
  if (map2[robot.y + 1][robot.x] === '.') {
    map2[robot.y][robot.x] = '.'
    robot.y += 1
    map2[robot.y][robot.x] = '@'
  }
}

// console.log()
// console.log(`Start:`)
// printGrid(map2)
// console.log(robot)

sequence.forEach((move, i) => {
  if (move === '<') {
    const emptySpace = emptySpaceToLeft(map2, robot)
    if (emptySpace) {
      moveWideLeft(robot, emptySpace)
    }
  } else if (move === '>') {
    const emptySpace = emptySpaceToRight(map2, robot)
    if (emptySpace) {
      moveWideRight(robot, emptySpace)
    }
  } else if (move === '^') {
    const emptySpace = emptySpaceUp(map2, robot)
    if (emptySpace) {
      moveWideUp(robot)
    }
  } else if (move === 'v') {
    const emptySpace = emptySpaceDown(map2, robot)
    if (emptySpace) {
      moveWideDown(robot)
    }
  }

  // if (i > 590 && i < 670) {
  //   console.log()
  //   console.log(`${i} Move ${move} :`)
  //   printGrid(map2)
  // }
})

// printGrid(map2)
const part2 = map2.reduce((sum, row, y) => {
  return sum + row.reduce((rsum, v, x) => {
    if (v === '[') {
      return rsum + 100 * y + x
    }
    return rsum
  }, 0)
}, 0)

console.log('part2', part2)
console.timeEnd('part2')
