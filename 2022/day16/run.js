const readInput = require('../../utils/readInput')
const input = readInput(__dirname, 'input.txt')
const lines = input.split('\n')
lines.pop();

const startRun = process.hrtime();

class Valve {
  connections = []
  connectedValves = []
  shortestPaths = {}
  shortestLength = {}
  isVisited = {}

  constructor (name, flowRate) {
    this.name = name
    this.flowRate = flowRate
    this.shortestPaths[name] = []
    this.shortestLength[name] = []
  }

  visit (forValve) {
    this.connectedValves.forEach(valve => valve.setPath(forValve, [...this.shortestPaths[forValve], this]))
    if (!this.isVisited[forValve]) {
      this.isVisited[forValve] = true
      this.connectedValves.forEach(valve => valve.visit(forValve))
    }
  }

  setPath (forValve, pathSoFar) {
    if (!this.shortestPaths[forValve] || this.shortestPaths[forValve].length > pathSoFar.length) {
      this.shortestPaths[forValve] = pathSoFar
      this.shortestLength[forValve] = pathSoFar ? pathSoFar.length : 0
      this.connectedValves.forEach(valve => {
        if (valve.isVisited[forValve]) {
          valve.setPath([...this.shortestPaths[forValve], this])
        }
      })
    }
  }
}

const valves = {}
lines.forEach(l => {
  const [v, p] = l.split(';')
  const vParts = v.split(' ')
  const name = vParts[1]
  const valve = new Valve(name, Number(vParts[4].split('=')[1]))
  valve.connections = p.substring(23).split(', ').map(c => c.trim())
  valves[name] = valve
})

const effectiveValves = []

Object.keys(valves).forEach(name => {
  valves[name].connectedValves = valves[name].connections.map(n => valves[n])
  if (valves[name].flowRate > 0) {
    effectiveValves.push(valves[name])
  }
})

const firstValve = valves[Object.keys(valves)[0]]
// Ensure we know all shortest paths from each effective and starting valve to every other valve
effectiveValves.forEach(k => k.visit(k.name))
firstValve.visit(firstValve.name)

let pressureCache = {};
let cacheLength = Math.floor(effectiveValves.length / 2);

function getCacheName (path, count) {
  return path.slice(0, count).join(',');
}
function getFromCache (path) {
  return pressureCache[path.slice(0, cacheLength)];
  // // reverse search for cache hit, if none then clear cache and start again
  // for (let i = 2; i < pathLength; i++) {
  //   const count = pathLength - i;
  //   const cacheHit = pressureCache[getCacheName(path, count)]
  //   if (cacheHit) {
  //     // console.log(count, getCacheName(path, count), cacheHit)
  //     return cacheHit
  //   }
  // }
  // pressureCache = {};
}

function writeToCache(path, released, minutesRemaining, current) {
  // pressureCache[getCacheName(path, i + 1)] = { i, released, minutesRemaining }
  pressureCache[path.slice(0, cacheLength)] = { released, minutesRemaining, currentName: current.name }
}

function releaseFromPath (start, path, pathLength, totalMinutes) {
  let minutesRemaining = totalMinutes
  let current = start
  let released = 0
  let startIndex = 0;

  // const cached = getFromCache(path);
  // if (cached) {
  //   startIndex = cacheLength;
  //   current = valves[cached.currentName];
  //   minutesRemaining = cached.minutesRemaining;
  //   released = cached.released;
  // }

  for (let i = startIndex; i < pathLength; i++) {
    const v = valves[path[i]]
    minutesRemaining -= v.shortestLength[current.name] + 1
    current = v
    if (minutesRemaining < 0) {
      // console.log('Should abandon rest after', i, 'for', path);
      return {released, abandon: i}
    }
    released += minutesRemaining * v.flowRate;
    if (i === cacheLength - 1) {
      writeToCache(path, released, minutesRemaining, current)
    }
  }
  return {released}
}

function swap (list, i, j) {
  let temp = list[i]
  list[i] = list[j]
  list[j] = temp
  return list
}

const fact15 = 1307674368000
const measurePer = 10000000

function printProgress (start, checked, bestEffect) {
  const perc = ((checked / fact15) * 100).toFixed(3)
  const elapsed = process.hrtime(start)
  const timePerMeasure = Math.floor(elapsed[0] * 1000 + elapsed[1] / 1000000)
  const estimatedTimeLeftMs = ((fact15 - checked) / measurePer) * timePerMeasure
  const minutes = estimatedTimeLeftMs / (60 * 1000)
  console.log(`${perc}% | ${bestEffect} | ${checked} | ${minutes} left`)
  console.log(elapsed)
}

function findBest (startValve, valvesList, totalMinutes) {
  let bestEffect = 0;
  let bestPath;
  let checked = 0;
  const pathLength = valvesList.length;

  let startTime = process.hrtime();

  let abandonPath;
  function permute (path, l, r) {
    if (l === r) {
      checked++;

      if (checked % measurePer === 0) {
        printProgress(startTime, checked, bestEffect)
        startTime = process.hrtime();
      }
      // console.log('checking', path)
      // console.log('abandon', abandonPath)
      // if (abandonPath && abandonPath.toString() === path.slice(0, abandonPath.length).toString()) {
      //   // console.log('Skip check!')
      //   return;
      // }

      const {released, abandon} = releaseFromPath(startValve, path, pathLength, totalMinutes)
      if (abandon) {
        abandonPath = path.slice(0, abandon + 1)
      }
      if (released > bestEffect) {
        bestEffect = released
        bestPath = path
      }
      return abandon;
    } else {
      for (let i = l; i <= r; i++) {
        if (l !== i) {
          path = swap(path, l, i)
        }
        permute(path, l + 1, r)
        if (l !== i) {
          path = swap(path, l, i)
        }
      }
    }
  }

  permute(valvesList.map(v => v.name), 0, valvesList.length - 1)
  return { bestEffect, bestPath }
}

console.log('part1', findBest(firstValve, effectiveValves, 10))
console.log('end run', process.hrtime(startRun)[0], 's', Math.floor(process.hrtime(startRun)[1] / 1000000), 'ms');
