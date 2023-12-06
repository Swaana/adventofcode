const readInput = require('../../utils/readInput')

const input = readInput(__dirname, 'input.txt')
const lines = input.split('\n')

const commands = {
  cd: '$ cd ',
  ls: '$ ls',
  dir: 'dir ',
  root: '/',
  parent: '..',
}

function isLs (cmd) {
  return cmd === commands.ls
}

function getCd (cmd) {
  if (cmd.indexOf(commands.cd) > -1) {
    return cmd.substring(5)
  }
}

function getDir (cmd) {
  if (cmd.indexOf(commands.dir) > -1) {
    return cmd.substring(4)
  }
}

function createDir (name, parent) {
  return { name, parent, size: 0, dirs: [], files: [] };
}

function incrementParentSize (dir, size) {
  if (dir.parent) {
    dir.parent.size += size;
    incrementParentSize(dir.parent, size);
  }
}

const root = createDir('/');
let workingDir = root
lines.forEach(cmd => {
  if (isLs(cmd)) {
    return
  }
  const cd = getCd(cmd);
  if (cd === commands.root)  {
    workingDir = root;
    return;
  }

  if (cd === commands.parent)  {
    workingDir = workingDir.parent;
    return;
  }

  if (cd) {
    workingDir = workingDir.dirs.find(d => d.name === cd)
    return;
  }

  const dir = getDir(cmd)
  if (dir) {
    if (!workingDir.dirs.find(d => d.name === dir)) {
      workingDir.dirs.push(createDir(dir, workingDir))
    }
    return;
  }

  const [size, fileName] = cmd.split(' ');
  if (!workingDir.files.find(f => f.name === fileName)) {
    const file = { name: fileName, size: Number(size) }
    workingDir.files.push(file);
    workingDir.size += file.size;
    incrementParentSize(workingDir, file.size)
  }
})

const dirsToDeleteSmall = [];
function findSmallDirsToDelete (dir) {
  if (dir.size <= 100000) {
    dirsToDeleteSmall.push(dir);
  }
  dir.dirs.forEach(findSmallDirsToDelete)
}
findSmallDirsToDelete(root)
console.log('part1', dirsToDeleteSmall.reduce((sum, dir) => sum += dir.size, 0))

const unusedSpace = 70000000 - root.size;
const sizeToDelete = 30000000 - unusedSpace;
const dirsToDeleteLarge = [];
function findLargeDirsToDelete (dir) {
  if (dir.size >= sizeToDelete) {
    dirsToDeleteLarge.push(dir);
  }
  dir.dirs.forEach(findLargeDirsToDelete)
}
findLargeDirsToDelete(root)
let smallest = dirsToDeleteLarge[0]
dirsToDeleteLarge.forEach(d => {
  if (d.size < smallest.size) {
    smallest = d
  }
})
console.log('part2', smallest.size)
