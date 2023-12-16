const readInput = require('../../utils/readInput');

const input = readInput(__dirname, 'input.txt');

const grid = input.split('\n').filter(l => !!l).map(l => l.split(''));

const move = {
  down: { x: 0, y: 1 },
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  left: { x: -1, y: 0 }
}

let energized = new Set();
let beams = new Map();

function traceBeam (x, y, direction) {
  if (!grid[y] || !grid[y][x]) {
    return; // moved out of grid
  }
  if (beams.has(`${ x },${ y }`) && beams.get(`${ x },${ y }`) === direction) {
    return; // loop detected
  }

  energized.add(`${ x },${ y }`);
  beams.set(`${ x },${ y }`, direction);

  if (grid[y][x] === '.' ||
    grid[y][x] === '|' && ['up', 'down'].includes(direction) ||
    grid[y][x] === '-' && ['left', 'right'].includes(direction)) {
    traceBeam(x + move[direction].x, y + move[direction].y, direction);

  } else if (grid[y][x] === '|' && ['right', 'left'].includes(direction)) {
    traceBeam(x + move.up.x, y + move.up.y, 'up');
    traceBeam(x + move.down.x, y + move.down.y, 'down');

  } else if (grid[y][x] === '-' && ['up', 'down'].includes(direction)) {
    traceBeam(x + move.left.x, y + move.left.y, 'left');
    traceBeam(x + move.right.x, y + move.right.y, 'right');

  } else if (grid[y][x] === '\\') {
    if (direction === 'right') {
      traceBeam(x + move.down.x, y + move.down.y, 'down');
    } else if (direction === 'left') {
      traceBeam(x + move.up.x, y + move.up.y, 'up');
    } else if (direction === 'up') {
      traceBeam(x + move.left.x, y + move.left.y, 'left');
    } else if (direction === 'down') {
      traceBeam(x + move.right.x, y + move.right.y, 'right');
    }

  } else if (grid[y][x] === '/') {
    if (direction === 'left') {
      traceBeam(x + move.down.x, y + move.down.y, 'down');
    } else if (direction === 'right') {
      traceBeam(x + move.up.x, y + move.up.y, 'up');
    } else if (direction === 'down') {
      traceBeam(x + move.left.x, y + move.left.y, 'left');
    } else if (direction === 'up') {
      traceBeam(x + move.right.x, y + move.right.y, 'right');
    }
  }
}

traceBeam(0, 0, 'right');
// console.log(energized)
const part1 = energized.size;

function getEnergizeVale (x, y, direction) {
  energized = new Set();
  beams = new Map();
  traceBeam(x, y, direction);
  return energized.size;
}
let part2 = 0;
// sides
for (let i=0; i<grid.length; i++) {
  part2 = Math.max(part2, getEnergizeVale(0, i, 'right'));
  part2 = Math.max(part2, getEnergizeVale(grid[0].length - 1, i, 'left'));
}

// top and bottom
for (let i=0; i<grid[0].length; i++) {
  part2 = Math.max(part2, getEnergizeVale(i, 0, 'down'));
  part2 = Math.max(part2, getEnergizeVale(i, grid.length - 1, 'up'));
}

console.log('part1', part1)
console.log('part2', part2)
