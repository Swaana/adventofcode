module.exports = {
  sortByNumber: (a, b) => a > b ? 1 : b > a ? -1 : 0,
  sortByNumberDesc: (a, b) => a > b ? -1 : b > a ? 1 : 0,
}
