
const readInput = require('../../utils/readInput');

const input = readInput(__dirname, 'input.txt');

const { order, updates } = input.split('\n').filter(l => !!l)
  .reduce(({order, updates}, l) => {
    if (l.indexOf('|') > -1) {
      const [high, low] = l.split('|').map(Number);
      order.high[high] = order.high[high] || [];
      order.high[high].push(low);

      order.low[low] = order.low[low] || [];
      order.low[low].push(high);
    }
    else {
      updates.push(l.split(',').map(Number));
    }
    return { order, updates };
  }, { order: { low: {}, high: {}}, updates: []});

// console.log(order);
// console.log(updates);

const correctUpdates = []
const incorrectUpdates = []

updates.forEach((update, index) => {
  for (let i = 0; i < updates.length; i++) {
    const current = update[i];
    // check downstream
    for (let j = i + 1; j < update.length; j++) {
      // check if number was not supposed to be lower than these
      if (order.low[current]?.includes(update[j])) {
        // console.log(`${update} is incorrect because ${current} should be after ${update[j]} (order.low[${current}]: ${order.low[current]})`)
        incorrectUpdates.push(update);
        return;
      }
    }
    // check upstream
    for (let j = i + -1; j >= 0; j--) {
      // check if number was not supposed to be lower than these
      if (order.high[current]?.includes(update[j])) {
        // console.log(`${update} is incorrect because ${current} should be before ${update[j]} (order.high[${current}]: ${order.high[current]})`)
        incorrectUpdates.push(update);
        return;
      }
    }
  }
  correctUpdates.push(update);
})

// console.log(correctUpdates);

incorrectUpdates.forEach(update => update.sort((a,b) => {
  if (order.low[a]?.includes(b) || order.high[b]?.includes(a)) { return 1 }
  if (order.high[a]?.includes(b) || order.low[b]?.includes(a)) { return -1; }
  return 0;
}))

const part1 = correctUpdates.reduce((sum, update) => sum + update[Math.floor(update.length/2)], 0)
const part2 = incorrectUpdates.reduce((sum, update) => sum + update[Math.floor(update.length/2)], 0)

console.log('part1', part1)
console.log('part2', part2)
