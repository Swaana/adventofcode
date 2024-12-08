
const readInput = require('../../utils/readInput');

const input = readInput(__dirname, 'input.txt');

const antennas = {}
const map = input.split('\n').filter(l => !!l).map(l => [...l]);
const MAX_X = map[0].length - 1;
const MAX_Y = map.length - 1;

const antennaCoords = {}

map.forEach((row, y) => {
  row.forEach((cell, x) => {
    if (cell !== '.') {
      antennas[cell] = antennas[cell] || [];
      antennas[cell].push({x,y});
      antennaCoords[`${x},${y}`] = antennas[cell];
    }
  })
})

function asCoords(node) {
  return `${node.x},${node.y}`
}

function isOnMap(node) {
  return node.x >= 0 && node.x <= MAX_X && node.y >= 0 && node.y <= MAX_Y;
}

function isAntennaNode(node) {
  return !!antennaCoords[asCoords(node)]
}

function createAntinodes (a,b) {
  const vector = { x: a.x - b.x, y: a.y - b.y };

  const antinodeA = { x: a.x + vector.x, y: a.y + vector.y };
  const antinodeB = { x: b.x - vector.x, y: b.y - vector.y };

  return [
    ...(isOnMap(antinodeA) && !isAntennaNode(antinodeA) ? [antinodeA] : []),
    ...(isOnMap(antinodeB) && !isAntennaNode(antinodeB) ? [antinodeB] : []),
  ]
}

function createHarmonicsAntinodes (a, b) {
  const vector = { x: a.x - b.x, y: a.y - b.y };
  const antinodes = [];
  let nextNode = a;
  while (isOnMap(nextNode)) {
    nextNode = { x: nextNode.x + vector.x, y: nextNode.y + vector.y }
    if (isOnMap(nextNode) && !isAntennaNode(nextNode)) {
      antinodes.push(nextNode);
    }
  }

  nextNode = b;
  while (isOnMap(nextNode)) {
    nextNode = { x: nextNode.x - vector.x, y: nextNode.y - vector.y }
    if (isOnMap(nextNode) && !isAntennaNode(nextNode)) {
      antinodes.push(nextNode);
    }
  }

  return antinodes;
}

function getAllAntinodes() {
  const antinodes = [];
  Object.keys(antennas).forEach((key) => {
    const list = antennas[key];
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        antinodes.push(...createAntinodes(list[i], list[j]))
      }
    }
  })
  return antinodes;
}

function getUniqueHarmonicsAntinodes() {
  const antinodes = new Set();
  Object.keys(antennas).forEach((key) => {
    const list = antennas[key];
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        createHarmonicsAntinodes(list[i], list[j]).forEach((n) => {
          antinodes.add(asCoords(n))
        })
      }
    }
  })
  return antinodes;
}

const part1 = getAllAntinodes().length
const part2 = getUniqueHarmonicsAntinodes().size + Object.keys(antennaCoords).length;

console.log('part1', part1)
console.log('part2', part2)
