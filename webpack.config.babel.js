import {join} from 'path'
import fs from 'fs'


let nodeModules = {}

fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod
  })

const context = join(__dirname, 'src')

export default {
  context,
  entry: './index',
  target: 'node',
  externals: nodeModules,
  output: {
    path: join(__dirname, 'dist'),
    filename: 'kibbeling.js'
  },
  module: {
    loaders: [
      {test: /\.js$/, loaders: ['babel-loader'], include: context},
      {test: /\.json$/, loaders: ['json-loader'], include: context}
    ]
  }
}
