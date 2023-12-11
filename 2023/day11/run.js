
const readInput = require('../../utils/readInput');

const input = readInput(__dirname, 'input.txt');

const space = input.split('\n').filter(l => !!l).map(l => l.split(''));

const rowWithGalaxy = {}
const colWithGalaxy = {}

// First loop and get all rows and cols with galaxies
space.forEach((row, y) => {
    row.forEach((col, x) => {
        if (space[y][x] === '#') {
            rowWithGalaxy[y] = true;
            colWithGalaxy[x] = true;
        }
    })
})

function getGalaxies(expansionOffset) {
    const galaxies = [];
    expansionOffset = expansionOffset - 1;
    let rowOffset = 0;
    // Then loop and calculate coordinates
    space.forEach((row, y) => {
        if (!rowWithGalaxy[y]) rowOffset += expansionOffset;
        let colOffset = 0;
        row.forEach((col, x) => {
            if (!colWithGalaxy[x]) colOffset += expansionOffset;
            if (space[y][x] === '#') {
                galaxies.push({y: y + rowOffset, x: x + colOffset});
            }
        })
    })
    return galaxies;
}

function getDistancesForGalaxies (galaxies) {
    let distances = new Map();
    let from, to;
    for (let i=0;i<galaxies.length;i++) {
        from = galaxies[i];
        for(let k=i+1;k<galaxies.length;k++) {
            to = galaxies[k];
            distances.set(`${i+1}->${k+1}`, Math.abs(from.x - to.x) + Math.abs(from.y - to.y))
        }
    }
    return distances;
}

// Then loop through galaxies and get distances
const galaxies1 = getGalaxies(2);
const distances1 = getDistancesForGalaxies(galaxies1);

const galaxies2 = getGalaxies(1000000);
const distances2 = getDistancesForGalaxies(galaxies2);

const part1 = [...distances1.values()].reduce((sum, d) => sum + d, 0);
const part2 = [...distances2.values()].reduce((sum, d) => sum + d, 0);

console.log('part1', part1)
console.log('part2', part2)
