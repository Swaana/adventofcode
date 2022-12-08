const readInput = require('../utils/readInput')

const input = readInput(__dirname, 'input.txt')
const lines = input.split('\n')
lines.pop();

const trees = lines.map(l => [...l].map(Number))

console.log(trees)

function isVisibleFromLeftOrRight (tree, treeIndex, treeLine) {
  const maxLeft = Math.max(...treeLine.slice(0, treeIndex));
  const maxRight = Math.max(...treeLine.slice(treeIndex + 1));
  // console.log('testing', tree, treeIndex, treeLine, maxLeft, treeLine.slice(0, treeIndex), tree, treeLine.slice(treeIndex + 1), maxRight)
  return tree > maxLeft || tree > maxRight
}

function isVisibleFromTopOrBottom (x, y, trees) {
  const tree = trees[x][y]
  const verticalRow = trees.map(t => t[y]);

  return isVisibleFromLeftOrRight(tree, x, verticalRow);
}

let visibleTrees = [];

trees.forEach((treeLine, index) => {
  if (index === 0 || index === trees.length - 1) {
    visibleTrees.push(treeLine.map(() => 1));
    return;
  }
  const visibleLine = []
  treeLine.forEach((tree, treeIndex) => {
    if (treeIndex === 0 || treeIndex === treeLine.length - 1) {
      visibleLine.push(1);
      return;
    }
    if (isVisibleFromLeftOrRight(tree, treeIndex, treeLine) || isVisibleFromTopOrBottom(index, treeIndex, trees)) {
      visibleLine.push(1);
      return;
    }
    visibleLine.push(0);
  })
  visibleTrees.push(visibleLine)
})

// console.log(visibleTrees)
console.log('part1', visibleTrees.reduce((sum, t) => sum += t.reduce((sum, v) => sum += v), 0))
