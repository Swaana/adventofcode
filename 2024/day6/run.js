
const readInput = require('../../utils/readInput');

const input = readInput(__dirname, 'input.txt');

const map = input.split('\n').filter(l => !!l).map(l => [...l]);

const startIndex = input.indexOf('^')
const startingPoint = { x: startIndex % (map.length + 1), y: Math.floor(startIndex / map.length) - 1 };

const goLeft = ({ x, y }) => ({x: x - 1, y});
const goUp = ({ x, y }) => ({x, y: y - 1});
const goRight = ({ x, y }) => ({x: x + 1, y});
const goDown = ({ x, y }) => ({x, y: y + 1});

const isOnMap = ({ x, y }) => {
  return x < map[0].length && x > 0 && y < map.length && y > 0;
}

const turn = (direction) => {
  if (direction === goUp) return goRight
  if (direction === goRight) return goDown
  if (direction === goDown) return goLeft
  if (direction === goLeft) return goUp
}

const getTurn = (direction) => {
  if (direction === goUp) return 'right'
  if (direction === goRight) return 'down'
  if (direction === goDown) return 'left'
  if (direction === goLeft) return 'up'
}

let currentPoint = { ...startingPoint }
let nextPoint;
let direction = goUp;
const uniqueSpots = new Set()
// start in moving up
while (isOnMap(currentPoint)) {
  uniqueSpots.add(`${currentPoint.x},${currentPoint.y}`);
  nextPoint = direction(currentPoint);
  if (map[nextPoint.y]?.[nextPoint.x] === '#') {
    direction = turn(direction)
  } else {
    currentPoint = nextPoint
  }
}

const isLoop = (obstacle) => {
  // this will be interesting ... how do I know it's a loop? By saying that I should have an answer within a certain amount of time?
  // No, by remembering lines and recognize a repeating line
  // A line happens when he turns, so I just have to remember the points where he turns
  // NO, actually, I only need to know if he makes the same turn!
  currentPoint = { ...startingPoint }
  direction = goUp;
  const turns = [];
  let newTurn;
  let loop = false;
  while (isOnMap(currentPoint)) {
    nextPoint = direction(currentPoint);
    if (map[nextPoint.y]?.[nextPoint.x] === '#' || (nextPoint.x === obstacle.x && nextPoint.y === obstacle.y)) {
      newTurn = `${getTurn(direction)}:${currentPoint.x},${currentPoint.y}`;
      if (turns.includes(newTurn)) {
        loop = true;
        break;
      } else {
        turns.push(newTurn)
      }
      direction = turn(direction)
    } else {
      currentPoint = nextPoint
    }
  }
  return loop;
}

let part2 = 0;
for (let i = 0; i < map.length; i++) {
  for (let j = 0; j < map[i].length; j++) {
    if (map[i][j] === '.' && isLoop({ x: j, y: i })) {
      part2++;
    }
  }
}

const part1 = uniqueSpots.size;

console.log('part1', part1)
console.log('part2', part2)
