require('colors')
const { launch } = require('./server')
const { simulateFlow } = require('./client')

launch().then(() => {
  simulateFlow()
})
