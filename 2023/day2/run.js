const readInput = require('../../utils/readInput');

const input = readInput(__dirname, 'input.txt');

function getRevealedCubes (reveal) {
  return reveal.split(',').reduce((acc, cubes) => {
    const [value, color] = cubes.trim().split(' ');
    acc[color] = Number(value)
    return acc
  }, { red: 0, green: 0, blue: 0 })
}

const games = input
  .split('\n')
  .filter(game => !!game) // remove empty lines
  .map((game) => {
    const maxValues = { red: 0, green: 0, blue: 0 };
    const [gamePart, revealsPart] = game.split(':');
    const id = Number(gamePart.split(' ')[1]);
    const reveals = revealsPart.split(';').map(getRevealedCubes);
    reveals.forEach(reveal => {
      Object.keys(reveal).forEach(color => {
        maxValues[color] = Math.max(maxValues[color], reveal[color]);
      });
    });

    return {
      id,
      reveals,
      maxValues
    }
  });

// only 12 red cubes, 13 green cubes, and 14 blue cubes
const maxOutcomes = {
  red: 12,
  green: 13,
  blue: 14,
};

const part1 = games.reduce((sum, game) => {
  const isPossible = Object.keys(maxOutcomes).reduce((acc, color) => {
    return acc && game.maxValues[color] <= maxOutcomes[color];
  }, true);
  return sum + (isPossible ? game.id : 0);
}, 0);

const part2 = games.reduce((sum, { id, maxValues }) => {
  const power = maxValues.green * maxValues.red * maxValues.blue;
  return sum + power;
}, 0);

console.log('part1', part1)
console.log('part2', part2)
