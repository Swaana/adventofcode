const readInput = require('../../utils/readInput')
const { sortByNumber } = require('../../utils/sortUtils')
const input = readInput(__dirname, 'input.txt')

const lines = input.split('\n')
lines.pop()

function getCoords (text) {
  const [xPair, yPair] = text.split(', ')
  return {
    x: Number(xPair.substring(2)),
    y: Number(yPair.substring(2)),
  }
}

function getDistance (a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

const pairs = lines.map(l => {
  const [sensorPart, beaconPart] = l.split(': ')
  const S = getCoords(sensorPart.substring(10))
  const B = getCoords(beaconPart.substring(21))
  return { S, B, D: getDistance(S, B) }
})

function isInRange (point, range) {
  return point >= range[0] && point <= range[1]
}

function isAdjacent (a, b) {
  return (Math.abs(a[0] - b[1]) === 1 || Math.abs(a[1] - b[0]) === 1)
}

function rangeOverlaps (a, b) {
  return (isInRange(a[0], b)
    || isInRange(a[1], b)
    || isInRange(b[0], a)
    || isInRange(b[1], a)
    || isAdjacent(a, b))
}

function merge (a, b) {
  if (rangeOverlaps(a, b)) {
    a[0] = Math.min(a[0], b[0])
    a[1] = Math.max(a[1], b[1])
    return true
  }
  return false
}

function mergeAll (range) {
  const result = range.shift();
  while (range.length > 0) {
    if (merge(result, range[0])) {
      range.shift();
    } else {
      return [result, ...range]
    }
  }
  return [result];
}

function pointsOnRow (rowNr) {
  const range = []
  pairs.forEach(p => {
    const distance = p.D - Math.abs(p.S.y - rowNr)
    if (distance >= 0) {
      range.push([p.S.x - distance, p.S.x + distance])
    }
  })

  // mergeAll(range)
  return range.sort((a, b) => sortByNumber(a[0], b[0]))
}

function findFirstEmptyPoint(rowToTest) {
  for(let i=0; i <= rowToTest * 2; i++) {
    const range = mergeAll(pointsOnRow(i));
    if (range.length > 1
      || range[0] >= 0
      || range[1] <= rowToTest * 2) {
      return { x: range[0][1] + 1, y: i }
    }
  }
}

const rowToTest = pairs.length > 15 ? 2000000 : 10

const range = pointsOnRow(rowToTest)
const beaconsInRowAndInRange = pairs
  .filter(p => p.B.y === rowToTest && range.reduce((check, r) => check && isInRange(p.B.x, r), true))
  .reduce((result, f) => {
    if (!result.includes(f.B.x)) {
      result.push(f.B.x)
    }
    return result
  }, [])

const pointsCovered = mergeAll(range).reduce((sum, r) => sum = r[1] - r[0], 0) - beaconsInRowAndInRange.length
const distressPoint = findFirstEmptyPoint(rowToTest);

console.log('part1', pointsCovered)
console.log('part2', distressPoint.x * 4000000 + distressPoint.y)
