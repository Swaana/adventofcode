const { createHash } = require('crypto');
const readInput = require('../../utils/readInput');

const input = readInput(__dirname, 'input.txt');

let grid = input.split('\n').filter(l => !!l).map(l => l.split(''));
let rocks = [];

grid.forEach((row, y) => {
  row.forEach((char, x) => {
      if (char === 'O') {
        rocks.push({ x, y });
      }
  })
});

const gridHashMap = new Map();

function tiltNorth () {
    rocks.sort((a,b) => a.y > b.y ? 1 : a.y < b.y ? -1 : 0)
    rocks.forEach(rock => {
        // move them north
        grid[rock.y][rock.x] = '.';
        while (rock.y > 0 && grid[rock.y-1][rock.x] === '.') {
            rock.y--;
        }
        grid[rock.y][rock.x] = 'O';
    })
}
function tiltWest () {
    rocks.sort((a,b) => a.x > b.x ? 1 : a.x < b.x ? -1 : 0)
    rocks.forEach(rock => {
        // move them north
        grid[rock.y][rock.x] = '.';
        while (rock.x > 0 && grid[rock.y][rock.x-1] === '.') {
            rock.x--;
        }
        grid[rock.y][rock.x] = 'O';
    })
}

function tiltSouth () {
    rocks.sort((a,b) => a.y > b.y ? -1 : a.y < b.y ? 1 : 0)
    rocks.forEach(rock => {
        // move them north
        grid[rock.y][rock.x] = '.';
        while (rock.y < grid.length-1 && grid[rock.y+1][rock.x] === '.') {
            rock.y++;
        }
        grid[rock.y][rock.x] = 'O';
    })
}

function tiltEast () {
    rocks.sort((a,b) => a.x > b.x ? -1 : a.x < b.x ? 1 : 0)
    rocks.forEach(rock => {
        // move them north
        grid[rock.y][rock.x] = '.';
        while (rock.x < grid[0].length - 1&& grid[rock.y][rock.x+1] === '.') {
            rock.x++;
        }
        grid[rock.y][rock.x] = 'O';
    })
}

tiltNorth ()
// console.log(grid.map(row => row.join('')).join('\n'))
const part1 = rocks.reduce((load, rock) => load + (grid.length - rock.y), 0);

function tiltWithHash(tiltFunction) {
    tiltFunction();
}
let cycles = 0
let currentHash = getCurrentHash();
while (cycles < 1000000000) {
    if (gridHashMap.has(currentHash)) {
        const hashedValues =  gridHashMap.get(currentHash);
        grid = hashedValues.grid;
        rocks = hashedValues.rocks;
        currentHash = hashedValues.hash;
    } else {
        if (cycles > 0) {
            tiltWithHash(tiltNorth)
        }
        tiltWithHash(tiltWest)
        tiltWithHash(tiltSouth)
        tiltWithHash(tiltEast)
        const hash = currentHash;
        currentHash = getCurrentHash();
        gridHashMap.set(hash, {
            grid: JSON.parse(JSON.stringify(grid)),
            rocks: JSON.parse(JSON.stringify(rocks)),
            hash: currentHash
        });
    }
    cycles++
}
function getCurrentHash () {
    return createHash('md5').update(JSON.stringify(grid)).digest('hex')
}

const part2 = rocks.reduce((load, rock) => load + (grid.length - rock.y), 0);
console.log('part1', part1)
console.log('part2', part2)
