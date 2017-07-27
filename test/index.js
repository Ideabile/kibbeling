const { expect } = require('chai')
const Kib = require('./../src/index.js')

describe('Kibbeling constructor', ( ) => {

  it('should be a function', () => {
    expect(Kib).to.be.an('function')
  })

})
