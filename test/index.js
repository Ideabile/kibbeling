const { expect } = require('chai')
const axios  = require('axios')
const hapi = require('hapi')
const config = { port: 3011, contentDir: '.' }

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
    before(() => {
      server.start(_err => {
        err = _err
      })
    })

    it('should return a server', () =>{
      expect(server instanceof hapi.Server).to.equal(true)
    })

    it('should be able to start', () => {
      expect(err).to.equal(undefined)
    })

    after(() => {
      server.stop(() => {
        console.log('Server stop')
      })
    })

  })

  describe('Testing content behavior', () => {
    const server = new Kib(config)

    before(() => {
      server.start(() => {
        console.log(`Server start`)
      })
    })

    it('should return an array', async () => {
      let { data } = await axios('http://localhost:3011/content.json')
      expect(data).to.be.an('array')
    })

    it('should return has a readme', async () => {
      let { data } = await axios('http://localhost:3011/content.json')
      expect(data.filter( file => file.name === 'Readme').length).to.equal(1)
    })


    it('Doesn\'t return body during dir list', async () => {
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

    after(() => {
      server.stop(() => {
        console.log(`Server stop`)
      })
    })

  })

})
