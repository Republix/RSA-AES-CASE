const http = require('http')

function request (path, data, method = 'POST') {
  const options = {
    hostname: '127.0.0.1',
    port: 10001,
    path,
    method
  }
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = ''

      res.on('data', (chunk) => {
        responseData += chunk;
      })

      res.on('end', () => {
        resolve(responseData);
      })
    });

    req.on('error', (error) => {
      reject(error)
    })

    req.setHeader('Content-Type', 'application/json')
    data && req.write(JSON.stringify(data))
    req.end()
  })
}

function getLogger (prefix) {
  return console.log.bind(console, prefix)
}

function printSeparator () {
  console.log('')
}

module.exports = {
  request,
  getLogger,
  printSeparator
}