const readInput = require('../utils/readInput')
const input = readInput(__dirname, 'input.txt')

const lines = input.split('\n')
lines.pop()

const material = {
  sandStart: '+',
  sand: 'o',
  rock: '#',
  air: '.',
}

const gridSize = {
  x: { max: 0, min: Number.MAX_VALUE},
  y: { max: 0, min: 0},
}

const rockLines = lines.map(l => l
  .split(' -> ')
  .map(c => c.split(',')
    .map((n, i) => {
      n = Number(n);
      if (i === 0) {
        if (n > gridSize.x.max)  gridSize.x.max = n;
        if (n < gridSize.x.min)  gridSize.x.min = n;
      }
      if (i === 1) {
        if (n > gridSize.y.max)  gridSize.y.max = n;
      }
      return n;
    })
  )
)

const xSandStart = 500 - gridSize.x.min;
const initialGrid = [...new Array(gridSize.y.max + 1)].map(() => [...new Array(gridSize.x.max - gridSize.x.min + 1)].map(() => material.air));
initialGrid[0][xSandStart] = material.sandStart;

function getStartAbdEnd (from, to) {
  return [
    Math.min(from, to),
    Math.max(from, to),
  ]
}
// draw rock-lines
rockLines.forEach(rockLine => {
  rockLine.forEach((_, i, line) => {
    if (i === 0) {
      return;
    }
    const [xFrom, yFrom] = line[i-1];
    const [xTo, yTo] = line[i];

    if (xFrom !== xTo) {
      // Move along X
      const [start, end] = getStartAbdEnd(xFrom, xTo);
      for (let x = start; x <= end;x++) {
        initialGrid[yTo][x - gridSize.x.min] = material.rock;
      }
    }
    if (yFrom !== yTo) {
      // Move along y
      const [start, end] = getStartAbdEnd(yFrom, yTo);
      for (let y = start; y <= end;y++) {
        initialGrid[y][xTo - gridSize.x.min] = material.rock;
      }
    }
  })
});

function dropSandGrain (grid) {
  let isSettled = false;
  let isInAbyss = false;
  let x = grid[0].indexOf(material.sandStart);
  let y = 0;
  while (!isSettled && !isInAbyss) {
    if (y > grid.length
      || x > grid[y].length
      || x < 0
      || !grid[y + 1]
      || !grid[y + 1][x]
      || !grid[y + 1][x - 1]
      || !grid[y + 1][x + 1]) {
      isInAbyss = true;
    } else if (grid[y + 1][x] === material.air) {
      // drop straight down
      y++;
    } else if (grid[y + 1][x - 1] === material.air) {
      // drop to left
      y++;
      x--;
    } else if (grid[y + 1][x + 1] === material.air) {
      // drop to right
      y++;
      x++;
    } else {
      grid[y][x] = material.sand;
      isSettled = true;
    }
  }

  return isInAbyss;
}

function letSandRun(grid) {
  let sandDropped = 0;
  let isInAbyss = false;
  while (!isInAbyss) {
    sandDropped++;
    isInAbyss = dropSandGrain(grid);
  }
  return sandDropped - 1;
}

function createArray(length, mat) {
  return [...new Array(length)].map(() => mat)
}
const gridPart1 = JSON.parse(JSON.stringify(initialGrid));
const gridPart2 = JSON.parse(JSON.stringify(initialGrid));

const part2Width = (gridPart2.length + 2) * 2;
const leftPad = Math.floor(part2Width / 2) - xSandStart;
const rightPad = part2Width - gridPart2[0].length - leftPad;

gridPart2.forEach((l, i) => gridPart2[i] = [...createArray(leftPad, material.air), ...l, ...createArray(rightPad, material.air)])
gridPart2.push(createArray(part2Width, material.air))
gridPart2.push(createArray(part2Width, material.rock))

const part1 = letSandRun(gridPart1);
const part2 = letSandRun(gridPart2);

// console.log('\ngrid part 1')
// gridPart1.forEach((row, i) => console.log(i < 10 ? `${i}  ` : i < 100 ? `${i} ` : `${i}`, row.join('')))
//
// console.log('\ngrid part 2')
// gridPart2.forEach((row, i) => console.log(i < 10 ? `${i}  ` : i < 100 ? `${i} ` : `${i}`, row.join('')))
// console.log()

console.log('part1', part1)
console.log('part2', part2)
