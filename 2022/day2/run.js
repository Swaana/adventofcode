const readInput = require('../utils/readInput');

const input = readInput(__dirname, 'input.txt');

// rock > scissors, scissors > paper, paper > rock

// Other / Me
//      1   2   3
// 1 :  3   6   0
// 2 :  0   3   6
// 3 :  6   0   3

const outcomesMatrix = [
  [3, 6, 0],
  [0, 3, 6],
  [6, 0, 3]
]

function gameScore (other, me) {
  return outcomesMatrix[other - 1][me - 1]
}

// 0 = lose, 3 = draw, 6 = win
const shapes = {
  rock: 1,
  paper: 2,
  scissors: 3,
}

const movesOther = {
  A: 'rock',
  B: 'paper',
  C: 'scissors',
}

const movesMe = {
  X: 'rock',
  Y: 'paper',
  Z: 'scissors',
}

const outcome = {
  X: 'lose',
  Y: 'draw',
  Z: 'win',
}

const outcomeScore = {
  lose: 0,
  draw: 3,
  win: 6,
}

const playerMove = {
  A: { shape: 'rock', win: 'paper', lose: 'scissors', draw: 'rock' },
  B: { shape: 'paper', win: 'scissors', lose: 'rock', draw: 'paper' },
  C: { shape: 'scissors', win: 'rock', lose: 'paper', draw: 'scissors' },
}

const rows = input.split('\n')
const games = rows.map(g => {
    if (g.length === 0) {
      return { shapeScore: 0, gameScore: 0 }
    }
    const other = movesOther[g[0]]
    const me = movesMe[g[2]]

    return {
      other, me, shapeScore: shapes[me], gameScore: gameScore(shapes[other], shapes[me])
    }
  }
)
console.log('part1', games.reduce((total, game) => total + game.gameScore + game.shapeScore, 0))

const games2 = rows.map(g => {
  if (g.length === 0) {
    return { shapeScore: 0, gameScore: 0 }
  }

  const other = playerMove[g[0]]
  const myOutcome = outcome[g[2]]
  const me = other[myOutcome]

  return { other: other.shape, me, shapeScore: shapes[me], gameScore: outcomeScore[myOutcome] }
})
console.log('part2', games2.reduce((total, game) => total + game.gameScore + game.shapeScore, 0))
