console.time('part1')
console.time('part2')

const readInput = require('../../utils/readInput')

const input = readInput(__dirname, 'input.txt')

const grid = input.split('\n').filter(l => !!l).map(l => [...l])

const regions = JSON.parse(JSON.stringify(grid))
const allRegions = []

class Region {
  constructor (flower, x, y) {
    this.flower = flower
    this.coords = [{ x, y }]
    this.perimeter = 4
    this.price = 4
    this.corners = 0
    allRegions.push(this)
  }

  add (x, y, edges) {
    this.coords.push({ x, y })
    this.perimeter += 4 - 2 * edges
    this.price = this.coords.length * this.perimeter
  }

  join (region) {
    this.perimeter += region.perimeter
    region.coords.forEach(({ x, y }) => {
      regions[y][x] = this
    })
    this.coords.push(...region.coords)
    this.price = this.coords.length * this.perimeter
    allRegions.splice(allRegions.indexOf(region), 1)
  }
}

grid.forEach((row, y) => {
  row.forEach((flower, x) => {
    if (x === 0 && y === 0) {
      regions[y][x] = new Region(flower, x, y)
      return
    }
    const leftRegion = regions[y][x - 1]
    const upperRegion = regions[y - 1]?.[x]

    if (flower === leftRegion?.flower && flower === upperRegion?.flower) {
      upperRegion.add(x, y, 2)
      if (leftRegion !== upperRegion) {
        upperRegion.join(leftRegion)
      }
      regions[y][x] = upperRegion
      return
    }
    if (flower === leftRegion?.flower) {
      leftRegion.add(x, y, 1)
      regions[y][x] = leftRegion
      return
    }
    if (flower === upperRegion?.flower) {
      upperRegion.add(x, y, 1)
      regions[y][x] = upperRegion
      return
    }
    regions[y][x] = new Region(flower, x, y)
  })
})

const part1 = allRegions.reduce((p, r) => p + r.price, 0)

console.log('part1', part1)
console.timeEnd('part1')

allRegions.forEach(region => {
  const { coords, flower } = region
  coords.forEach(({ x, y }) => {
    const up = grid[y - 1]?.[x]
    const down = grid[y + 1]?.[x]
    const left = grid[y][x - 1]
    const right = grid[y][x + 1]

    const upRight = grid[y - 1]?.[x + 1]
    const upLeft = grid[y - 1]?.[x - 1]
    const downRight = grid[y + 1]?.[x + 1]
    const downLeft = grid[y + 1]?.[x - 1]

    // check for each coord if it is a corner
    if (up !== flower && left !== flower) {
      region.corners += 1
    }
    if (up === flower && left === flower && upLeft !== flower) {
      region.corners += 1
    }
    if (up !== flower && right !== flower) {
      region.corners += 1
    }
    if (up === flower && right === flower && upRight !== flower) {
      region.corners += 1
    }
    if (down !== flower && left !== flower) {
      region.corners += 1
    }
    if (down === flower && left === flower && downLeft !== flower) {
      region.corners += 1
    }
    if (down !== flower && right !== flower) {
      region.corners += 1
    }
    if (down === flower && right === flower && downRight !== flower) {
      region.corners += 1
    }
  })
})
// console.log(allRegions)

const part2 = allRegions.reduce((p, r) => p + r.coords.length * r.corners, 0)
console.log('part2', part2)
console.timeEnd('part2')

