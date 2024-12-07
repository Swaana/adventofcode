const readInput = require('../../utils/readInput')

const input = readInput(__dirname, 'input.txt')

const lines = input.split('\n').filter(l => !!l)
const equations = lines.map(l => {
  const [answer, variables] = l.split(':').map((v, i) => {
    if (i > 0) {
      return v.trim().split(' ').map(Number)
    }
    return Number(v)
  })
  return {
    answer,
    variables
  }
})

const add = (a, b) => a + b
const mul = (a, b) => a * b
const concat = (a, b) => Number(`${a}${b}`)

const possible = []
const possibleWithConcat = []

function iterate (answer, value, variables, canConcat) {
  const variable = variables.shift()
  let found = false

  if (variables.length > 0) {
    if (iterate(answer, add(value, variable), variables, canConcat)) {
      found = true;
    }
    else if (iterate(answer, mul(value, variable), variables, canConcat)) {
      found = true;
    }
    else if (canConcat && iterate(answer, concat(value, variable), variables, canConcat)) {
      found = true;
    }
  } else {
    if (add(value, variable) === answer) {
      found = true;
    }
    else if (mul(value, variable) === answer) {
      found = true;
    }
    else if (canConcat && (concat(value, variable) === answer)) {
      found = true;
    }
  }

  variables.unshift(variable)
  return found;
}

equations.forEach(({ answer, variables }) => {
  const variable = variables.shift()

  if (iterate(answer, variable, variables)) {
    possible.push(answer)
   }
  if (iterate(answer, variable, variables, true)) {
    possibleWithConcat.push(answer)
  }
})

// console.log(possible)
// console.log(possibleWithConcat)

const part1 = possible.reduce((sum, curr) => sum + curr, 0)
const part2 = possibleWithConcat.reduce((sum, curr) => sum + curr, 0)

console.log('part1', part1)
console.log('part2', part2)
