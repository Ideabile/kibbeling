const parseArg = require('minimist')
const Kib = require('./index')

const configs = require('./configs')

const argv = parseArg(process.argv.slice(2), {
  alias: {
    H: 'help',
    h: 'host',
    p: 'port',
    c: 'contentDir',
    a: 'apiDir',
    g: 'generate'
  },
  boolean: ['h'],
  string: ['c'],
  default: {
    p: configs.port,
    h: configs.host,
    c: configs.contentDir,
    a: configs.apiDir,
    g: configs.generate
  }
});

if ( argv['_'].indexOf('generate') > -1 ) {
  argv.generate = argv.generate || 'dist'
}

const server = new Kib(argv)

server.start((err) => {
    if (err) throw err
    console.log('Server running at:', server.info.uri)
})
