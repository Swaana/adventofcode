const readInput = require('../utils/readInput')

const input = readInput(__dirname, 'input.txt')
const lines = input.split('\n')
lines.pop();

const trees = lines.map(l => [...l].map(Number))

// console.log(trees)

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

function getVisibleTrees (tree, list) {
  let count = 0
  for(let i = 0; i < list.length; i++) {
    count ++;
    // console.log(tree, '>=', list[i], list)
    if (tree <= list[i]) {
      return count;
    }
  }
  return count;
}
function getScenicValue (x, y, trees) {
  const tree = trees[x][y]
  const horizontalRow = trees[x];
  const verticalRow = trees.map(t => t[y]);

  const lines = [
    horizontalRow.slice(0, y),
    horizontalRow.slice(y + 1),
    verticalRow.slice(0, x),
    verticalRow.slice(x + 1)
  ]

  const visible = [
    getVisibleTrees(tree, [...lines[0]].reverse()),
    getVisibleTrees(tree, lines[1]),
    getVisibleTrees(tree, [...lines[2]].reverse()),
    getVisibleTrees(tree, lines[3]),
  ]
  // console.log(lines, tree, visible)
  return visible.reduce((s, v) => s*v, 1)
}

const scenicTrees = []
let maxValue = 0;
trees.forEach((treeLine, index) => {
  if (index === 0 || index === trees.length - 1) {
    scenicTrees.push(treeLine.map(() => 0));
    return;
  }
  const scenicLine = []
  treeLine.forEach((tree, treeIndex) => {
    if (treeIndex === 0 || treeIndex === treeLine.length - 1) {
      scenicLine.push(0);
      return;
    }
    const value = getScenicValue(index, treeIndex, trees)
    if (value > maxValue) {
      maxValue = value;
    }
    scenicLine.push(value);
  })
  scenicTrees.push(scenicLine)
})

console.log('part2', maxValue)
