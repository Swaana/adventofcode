const readInput = require('../utils/readInput')

const input = readInput(__dirname, 'inputTst.txt')
const moves = input.split('\n')
moves.pop();

console.log(moves)

let coordsH = { x: 0, y: 0 }
let coordsT = { x: 0, y: 0 }
const visited = new Set();

function moveH (direction) {
  if (direction === 'U') coordsH.y += 1;
  else if (direction === 'D') coordsH.y -= 1;
  else if (direction === 'R') coordsH.x += 1;
  else if (direction === 'L') coordsH.x -= 1;
}

function moveT () {
  const diff = { x: coordsH.x - coordsT.x, y: coordsH.y - coordsT.y}
  console.log('diff', diff)
  if (diff.y === 0 && diff.x > 1) coordsT.x += 1;
  if (diff.y === 0 && diff.x < 1) coordsT.x -= 1;
  if (diff.x === 0 && diff.y > 1) coordsT.y += 1;
  if (diff.x === 0 && diff.y < 1) coordsT.y -= 1;
  visited.add(`${coordsT.x}x${coordsT.y}`)
}


moves.forEach((m) => {
  const [direction, nrOfSteps] = m.split(' ').map((v, i) => i === 1 ? Number(v) : v);
  console.log(direction, nrOfSteps);
  for (let i=0; i<nrOfSteps; i++) {
    moveH(direction)
    console.log('H', coordsH)
    moveT();
    console.log('T', coordsT)
  }
})

console.log(visited)
