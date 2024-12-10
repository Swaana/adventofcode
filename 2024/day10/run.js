
console.time('part1')
console.time('part2')

const readInput = require('../../utils/readInput');

const input = readInput(__dirname, 'input.txt');
const map = input.split('\n').filter(l => !!l).map(l => [...l].map(Number));

const MAX_X = map[0].length - 1
const MAX_Y = map.length - 1

const coords2string = ({x,y,v}) => `${x},${y}|${v}`;
const asCoords = (x,y,v) => ({ x , y, v });

const nextStep = (map, {x,y,v}, path) => {
  const paths = [];
  const up = y > 0 ? asCoords(x, y-1, map[y-1][x]) : null
  const right = x < MAX_X ? asCoords(x+1, y, map[y][x+1]) : null
  const down = y < MAX_Y ? asCoords(x, y+1, map[y+1][x]) : null
  const left = x > 0 ? asCoords(x-1, y, map[y][x-1]) : null

  // console.log(`checking ${coords2string({x, y, v})}`)
  // console.log('up', up)
  // console.log('right', right)
  // console.log('down', down)
  // console.log('left', left)


  if (up?.v - v === 1) {
    if (up?.v === 9) {
      // console.log('found!')
      paths.push([...path].concat(coords2string(up)))
    } else {
      paths.push(...nextStep(map, up, [...path].concat(coords2string(up))));
    }
  }
  if (right?.v - v === 1) {
    if (right?.v === 9) {
      // console.log('found!')
      paths.push([...path].concat(coords2string(right)))
    } else {
      paths.push(...nextStep(map, right, [...path].concat(coords2string(right))));
    }
  }
  if (down?.v - v === 1) {
    if (down?.v === 9) {
      // console.log('found!')
      paths.push([...path].concat(coords2string(down)))
    } else {
      paths.push(...nextStep(map, down, [...path].concat(coords2string(down))));
    }
  }
  if (left?.v - v === 1) {
    if (left?.v === 9) {
      // console.log('found!')
      paths.push([...path].concat(coords2string(left)))
    } else {
      paths.push(...nextStep(map, left, [...path].concat(coords2string(left))));
    }
  }

  return paths;
};

const allPaths = [];
let part1 = 0;

map.forEach((row, y) => {
  row.forEach((v, x) => {
    if (v === 0) {
      // console.log(`checking ${coords2string({x, y, v})}`)
      const foundPaths = nextStep(map, asCoords(x, y, v), [coords2string({x, y, v})])
      const uniqueEnds = new Set()
      foundPaths.forEach(p => uniqueEnds.add(p[9]))
      // console.log(uniqueEnds, foundPaths.length)
      allPaths.push(...foundPaths)
      part1 += uniqueEnds.size
    }
  })
})

const part2 = allPaths.length;

console.timeEnd('part1')
console.timeEnd('part2')

console.log('part1', part1)
console.log('part2', part2)
