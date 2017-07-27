const { expect } = require('chai')
const axios  = require('axios')
const hapi = require('hapi')
const { existsSync, unlinkSync, readFileSync } = require('fs')
const { removeSync } = require('fs-extra')
const config = { port: 3011, contentDir: '.' }

const startServer = (server, done) => {
  server.start(_err => {
    if (done) done()
  })
}
const stopServer = (server, done) => {
  server.stop(() => {
    if( done) done()
  })
}

describe('Kibbeling', () => {
  const Kib = require('./../src/index.js')

  describe('Kibbeling constructor', () => {

    it('should be a function', () => {
      expect(Kib).to.be.an('function')
    })

  })

  describe('Should start a server', () => {
    const server = new Kib(config)

    let err
    before(startServer.bind(null, server))

    it('should return a server', () =>{
      expect(server instanceof hapi.Server).to.equal(true)
    })

    it('should be able to start', () => {
      expect(err).to.equal(undefined)
    })

    after(stopServer.bind(null, server))

  })

  describe('Testing content behavior', () => {
    const server = new Kib(config)

    before(startServer.bind(null, server))

    it('should return an array', async () => {
      let { data } = await axios('http://localhost:3011/content.json')
      expect(data).to.be.an('array')
    })

    it('should return has a readme', async () => {
      let { data } = await axios('http://localhost:3011/content.json')
      expect(data.filter( file => file.name === 'Readme').length).to.equal(1)
    })

    it("Doesn't return body during dir list", async () => {
      let { data } = await axios('http://localhost:3011/content.json')
      expect(data.filter( file => file.body).length).to.equal(0)
    })

    it('should return an object when query single file', async () => {
      let { data } = await axios('http://localhost:3011/content/Readme.json')
      expect(data).to.be.an('object')
    })

    it('has attributes declared', async () => {
      let { data } = await axios('http://localhost:3011/content/Readme.json')
      expect(data.attributes).to.be.an('object')
    })

    it('has body', async () => {
      let { data } = await axios('http://localhost:3011/content/Readme.json')
      expect(data.body).to.be.an('string')
    })

    after(stopServer.bind(null, server))

  })

  describe('Caching', () => {
    const path = `content/Readme.json`
    const generate = `.test_cache`

    const server = new Kib(Object.assign(config, { generate }))
    const basePath = `${process.cwd()}/${generate}`
    const expected = `${basePath}/${path}`

    before(startServer.bind(null, server))

    it('Should create a file', async () => {
      let { data } = await axios(`http://localhost:3011/${path}`)
      let fileString = JSON.stringify(JSON.parse(readFileSync(expected).toString()))
      expect(fileString.length).to.equal(JSON.stringify(data).length)
      expect(existsSync(expected)).to.equal(true)
    })

    after(() => {
      if ( existsSync(expected) ) removeSync(basePath)
      stopServer(server)
    })

  })

})
