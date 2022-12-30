const readInput = require('../utils/readInput')
const input = readInput(__dirname, 'input.txt').replace('\n', '')

const directions = {
  left: '<',
  right: '>',
}

const material = {
  rock: '#',
  air: '.',
}

class Rock {
  currentPosition;
  constructor (shape, startingPoint) {
    this.shape = shape;
    this.currentPosition = startingPoint;
  }

  move (direction, chamber) {
    if (direction === directions.left && this.currentPosition.x > 0) {
      this.currentPosition.x--;
    }
  }
}

const rockShapes = {
  minus: [
    ['#', '#', '#', '#'],
  ],
  plus: [
    ['.', '#', '.'],
    ['#', '#', '#'],
    ['.', '#', '.'],
  ],
  l: [
    ['.', '.', '#'],
    ['.', '.', '#'],
    ['#', '#', '#'],
  ],
  i: [
    ['#'],
    ['#'],
    ['#'],
    ['#'],
  ],
  square: [
    ['#', '#'],
    ['#', '#'],
  ],
}

const chamber = {
  xMin: 0,
  xMax: 6,
  yMin: 0,
  yMax: 0,
  nextStart: { x: 2, y: 3 },
  nextShapeIndex: 0,
  nextJetIndex: 0,
  rockDropping: null,
  rocks: [],
}

const shapeOrder = ['minus', 'plus', 'l', 'i', 'square'];
function getNextShape (chamber) {
  const nextShape = rockShapes[shapeOrder[chamber.nextShapeIndex]];
  if (chamber.nextShapeIndex === shapeOrder.length - 1) {
    chamber.nextShapeIndex = 0;
  } else {
    chamber.nextShapeIndex++;
  }
  return nextShape;
}

function getNextMove (chamber) {
  const nextMove = input[chamber.nextJetIndex];
  if (chamber.nextJetIndex === input.length - 1) {
    chamber.nextJetIndex = 0;
  } else {
    chamber.nextJetIndex++;
  }
  return nextMove;
}

let nextStart = { x: 2, y: 3 }

function runCycle() {
  if (!chamber.rockDropping) {
    chamber.rockDropping = new Rock(getNextShape(chamber), nextStart)
  }
  chamber.rockDropping.move(chamber)
}

console.log(chamber)
