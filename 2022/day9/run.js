const readInput = require('../../utils/readInput')

const input = readInput(__dirname, 'input.txt')
const moves = input.split('\n')
moves.pop()

// console.log(moves)

const coords = [...Array(10).keys()].map(() => ({ x: 0, y: 0 }))

const visited = new Set()
visited.add(`${coords[1].x}x${coords[1].y}`)

const visited9th = new Set()
visited9th.add(`${coords[9].x}x${coords[9].y}`)

function moveH (direction) {
  if (direction === 'U') coords[0].y += 1
  else if (direction === 'D') coords[0].y -= 1
  else if (direction === 'R') coords[0].x += 1
  else if (direction === 'L') coords[0].x -= 1
}

function moveT (prev, next, isLog) {
  if(isLog) console.log(prev, ' -> ', next)
  const diff = { x: prev.x - next.x, y: prev.y - next.y }
  if (Math.abs(diff.y) >= 0 && Math.abs(diff.x) > 1) {
    if(isLog) console.log('diff', diff)
    next.x += Math.sign(diff.x) * (Math.abs(diff.x) - 1)
    next.y += Math.sign(diff.y) * Math.min(Math.abs(diff.y), 1)
    if(isLog) console.log(prev, ' -> ', next)
  } else if (Math.abs(diff.x) >= 0 && Math.abs(diff.y) > 1) {
    if(isLog) console.log('diff', diff)
    next.y += Math.sign(diff.y) * (Math.abs(diff.y) - 1)
    next.x += Math.sign(diff.x) * Math.min(Math.abs(diff.x), 1)
    if(isLog) console.log(prev, ' -> ', next)
  }
}


moves.forEach((m, mi) => {
  const [direction, nrOfSteps] = m.split(' ').map((v, i) => i === 1 ? Number(v) : v)
  // console.log();
  // console.log(direction, nrOfSteps)
  for (let i = 0; i < nrOfSteps; i++) {
    coords.forEach((c, ci) => {
      // console.log([ci])
      if (ci === 0) {
        moveH(direction)
        return;
      }
      moveT(coords[ci-1], coords[ci]);
    })
    // console.log();
    // console.log('T', coordsT)
    visited.add(`${coords[1].x}x${coords[1].y}`)
    visited9th.add(`${Math.floor(coords[9].x)}x${Math.floor(coords[9].y)}`)
  }
})

console.log('part1', visited.size)
// console.log(visited9th);
console.log('part2', visited9th.size)
