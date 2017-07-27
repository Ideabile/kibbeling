// File shortcut Utils
const fs = require('fs')

module.exports = {
  exists: file => fs.existsSync(file),
  isFile: file => !fs.lstatSync(file).isDirectory(),
  getFile: file => fs.readFileSync(file, {encoding: 'utf-8'}),
  isMarkdown: file => file.indexOf('.md') > -1,
  rdir: path => fs.readdirSync(path)
}
