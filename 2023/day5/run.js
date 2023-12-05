const readInput = require('../../utils/readInput')

const input = readInput(__dirname, 'inputTst.txt')

const parts = input.split('\n\n')

function sortByStart (a, b) {
  if (a.start > b.start) return 1
  if (a.start < b.start) return -1
  return 0
}

function extractRangesFromPart (part) {
  const lines = part.split(':\n')[1].split('\n').filter(l => !!l)
  return lines.map((line) => {
    const [destRangeStart, sourceRangeStart, length] = line.trim().split(' ').map(Number)
    return {
      start: sourceRangeStart,
      end: sourceRangeStart + length,
      delta: destRangeStart - sourceRangeStart,
    }
  }).sort(sortByStart)
}

function getMappedValue (source, map) {
  // find the delta
  for (let i = 0; i < map.length; i++) {
    if (source >= map[i].start && source <= map[i].end) {
      return source + map[i].delta
    }
  }
  return source
}

function findMappedRangeForValue (value, map) {
  for (let i = 0; i < map.length; i++) {
    if (value >= map[i].start && value <= map[i].end) {
      return map[i]
    }
  }
}

function findNextMappedRangeForValue (value, map) {
  for (let i = map.length - 1; i >= 0; i--) {
    if (value > map[i].end) {
      return; // already at end
    }
    if (value < map[i].start) {
      return map[i]
    }
  }
}

function getMappedRange (range, map) {
  // take start of range and find map range
  // if end of range is within map, just return same range with delta
  // else return delta until end of map and start new range to work from
  // repeat and return all new ranges
  const mapRange = findMappedRangeForValue(range.start, map)
  if (!mapRange) {
    const nextMapRange = findNextMappedRangeForValue(range.start)
    if (range.end < nextMapRange.start) {
      return [range];
    }
    return [{
      start: range.start,
      end: nextMapRange.start -1
    }, getMappedRange({ start: nextMapRange.start, end: range.end})]
  }
  if (mapRange.end >= range.end) {
    return [{
      start: range.start + mapRange.delta,
      end: range.end + mapRange.delta
    }]
  }
  return [{
    start: range.start + mapRange.delta,
    end: mapRange.end + mapRange.delta
  }, ...getMappedRange({ start: mapRange.start, end: range.end}, map)]
}


const seeds = parts[0].split(':')[1].trim().split(' ').map(Number)
const seedToSoilMap = extractRangesFromPart(parts[1])
const soilToFertilizerMap = extractRangesFromPart(parts[2])
const fertilizerToWaterMap = extractRangesFromPart(parts[3])
const waterToLightMap = extractRangesFromPart(parts[4])
const lightToTemperatureMap = extractRangesFromPart(parts[5])
const temperatureToHumidityMap = extractRangesFromPart(parts[6])
const humidityToLocationMap = extractRangesFromPart(parts[7])

const locations = seeds
  .map(s => getMappedValue(s, seedToSoilMap))
  .map(s => getMappedValue(s, soilToFertilizerMap))
  .map(s => getMappedValue(s, fertilizerToWaterMap))
  .map(s => getMappedValue(s, waterToLightMap))
  .map(s => getMappedValue(s, lightToTemperatureMap))
  .map(s => getMappedValue(s, temperatureToHumidityMap))
  .map(s => getMappedValue(s, humidityToLocationMap))

const seedRanges = []
for (let i = 0; i < seeds.length; i += 2) {
  seedRanges.push({
    start: seeds[i],
    end: seeds[i] + seeds[i + 1]
  })
}
seedRanges.sort(sortByStart)

console.log(seedRanges)
console.log(seedToSoilMap)

console.log(seedRanges
  .flatMap(r => getMappedRange(r, seedToSoilMap))
  .flatMap(r => getMappedRange(r, soilToFertilizerMap))
)

const part1 = Math.min(...locations)
console.log('part1', part1)
// console.log('part2', parts2)
