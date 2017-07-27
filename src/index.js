const Hapi = require('hapi')
const { readdirSync } = require('fs')
const { resolve } = require('path')
const fse = require('fs-extra')

const { exists, isFile } = require('./f')
const configs = require('./configs')

module.exports = function Kibbeling (options) {
  const { host, port, apiDir, generate } = Object.assign(configs, options)

  const server = new Hapi.Server()

  server.connection({
    host,
    port,
    routes: {
      cors: true
    }
  })

  if ( generate ) {

    server.ext('onPreResponse', function (request, reply) {

      let source = request.response.source;
      let path = request.path
      let filePath = `${process.cwd()}/${generate}${path}`

      fse.ensureFileSync(filePath)
      fse.writeJsonSync(filePath, source)
      reply.continue()
    })

  }

  server.route(require('./content'))

  server.ext('onRequest', (req, res) => {
    console.log(`Request: ${req.path}`)
    res.continue()
  })

  // Add Api routes if we find
  if ( apiDir && exists(apiDir) ) {

    readdirSync(apiDir)
      .filter(file =>isFile(resolve(apiDir, file)) && file.indexOf('.js') > -1)
      .forEach(file => {
        try {
          server.route(require(`${apiDir}/${file}`))
        } catch (err){
          console.log(`Error on adding route ${apiDir}/${file}`, err.stack)
        }
      })
  }


  return server
}
