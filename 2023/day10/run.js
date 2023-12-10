
const readInput = require('../../utils/readInput');

const input = readInput(__dirname, 'inputTst3.txt');

const grid = input.split('\n').filter(l => !!l).map(l => l.split(''));

// I think ... find S and then find attached pipes and propagate through the coords until they connect
// yes, disregard pipes out of the loop entirely

let start = null;
grid.forEach((row, y) => {
  row.forEach((char, x) => {
    if (char === 'S') {
      start = { x, y };
    }
  })
});

console.log('start', start)

const pipes = new Map();
function addPipe(pipe) {
  pipes.set(pipe.name, pipe);
}

function getOrCreatePipe(x, y) {
  const pipe = pipes.get(`${x},${y}`);
  if (pipe) {
    return pipe;
  }
  const newPipe = new Pipe(x, y, grid[y][x]);
  addPipe(newPipe);
  return newPipe;
}
const getNextPipe = {
  '-': (x, y, previousPipe) => {
    // -: x - 1 | x + 1
    if (previousPipe.x === x - 1) {
      return { x: x + 1, y };
    }
    return { x: x - 1, y };
  },
  '|': (x, y, previousPipe) => {
    // |: y - 1 | y + 1
    if (previousPipe.y === y - 1) {
      return { x, y: y + 1 };
    }
    return { x, y: y - 1 };
  },
  '7': (x, y, previousPipe) => {
    // 7: x - 1, y + 1
    if (previousPipe.y === y + 1) {
      return { x: x - 1, y };
    }
    return { x, y: y + 1 };
  },
  'L': (x, y, previousPipe) => {
    // L: x + 1, y - 1
    if (previousPipe.x === x + 1) {
      return { x, y: y - 1 };
    }
    return { x: x + 1, y };
  },
  'J': (x, y, previousPipe) => {
    // J: x - 1, y - 1
    if (previousPipe.x === x - 1) {
      return { x, y: y - 1 };
    }
    return { x: x - 1, y };
  },
  'F': (x, y, previousPipe) => {
    // F: x + 1, y + 1
    if (previousPipe.x === x + 1) {
      return { x, y: y + 1 };
    }
    return { x: x + 1, y };
  },
}
function Pipe(x, y, type) {
  this.name = `${x},${y}`;
  this.x = x;
  this.y = y;
  this.type = type;
  this.connections = { a: null, b: null };
}
Pipe.prototype.getNextPipe = function (previousPipe) {
  const nextPipeLocation = getNextPipe[this.type](this.x, this.y, previousPipe);
  const nextPipe = getOrCreatePipe(nextPipeLocation.x, nextPipeLocation.y);
  if (this.connections.a === previousPipe) {
    this.connections.b = nextPipe;
  } else if (this.connections.b === previousPipe) {
    this.connections.a = nextPipe;
  } else {
    this.connections.a = previousPipe;
    this.connections.b = nextPipe;
  }
  return nextPipe;
}
Pipe.prototype.findConnectedPipes = function () {
  let a,b;
  if (this.type === '-') {
    // -: x - 1 | x + 1
    a = { x: this.x-1, y: this.y };
    b = { x: this.x+1, y: this.y };
  } else if (this.type === '|') {
    // |: y - 1 | y + 1
    a = { x: this.x, y: this.y-1 };
    b = { x: this.x, y: this.y+1 };
  } else if (this.type === '7') {
    // 7: x - 1, y + 1
    a = { x: this.x-1, y: this.y };
    b = { x: this.x, y: this.y+1 };
  } else if (this.type === 'L') {
    // L: x + 1, y - 1
    a = { x: this.x+1, y: this.y };
    b = { x: this.x, y: this.y-1 };
  } else if (this.type === 'J') {
    // J: x - 1, y - 1
    a = { x: this.x-1, y: this.y };
    b = { x: this.x, y: this.y-1 };
  } else if (this.type === 'F') {
    // F: x + 1, y + 1
    a = { x: this.x+1, y: this.y };
    b = { x: this.x, y: this.y+1 };
  }

  this.connections.a = getOrCreatePipe(a.x, a.y);
  this.connections.b = getOrCreatePipe(b.x, b.y);
}


function getStartingPipe(x, y) {
  const directions = {
    up: y > 0 && ['|', 'F', '7'].includes(grid[y - 1][x]),
    down: y < grid.length - 1 && ['|', 'J', 'L'].includes(grid[y + 1][x]),
    left: x > 0 && ['-', 'F', 'L'].includes(grid[y][x - 1]),
    right: x < grid[y].length - 1 && ['-', '7', 'J'].includes(grid[y][x + 1]),
  }
  let type = null;
  if (directions.up) {
    if (directions.left) {
      type = 'J'
    }
    if (directions.right) {
      type = 'L'
    }
    if (directions.down) {
      type = '|'
    }
  }
  if(directions.down) {
    if (directions.left) {
      type = '7'
    }
    if (directions.right) {
      type = 'F'
    }
  }
  if (directions.left && directions.right) {
    type = '-'
  }
  return new Pipe(x, y, type);
}

const startPipe = getStartingPipe(start.x, start.y);
addPipe(startPipe);
startPipe.findConnectedPipes();
let currentPipe = startPipe.connections.a;
let previousPipe = startPipe;
while (currentPipe !== startPipe.connections.b) {
  const nextPipe = currentPipe.getNextPipe(previousPipe);

  previousPipe = currentPipe;
  currentPipe = nextPipe;
}
// console.log(pipes)

const part1 = pipes.size / 2;
console.log('part1', part1)
// console.log('part2', part2)
