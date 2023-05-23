const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const { getLogger, printSeparator } = require('./lib/utils')
const { generateRSAKeyPair, segmentedRSADecrypt, segmentedRSAEncrypt, getRandomKey, decryptWithAES, encryptWithAES } = require('./lib/crypto')

const { publicKey, privateKey } = generateRSAKeyPair()
const logger = getLogger('[server]'.bgGreen)

const app = new Koa()
app.use(bodyParser())

const PORT = 10001
const RSA_PUBLIC_KEY = publicKey
const RSA_PRIVATE_KEY = privateKey
const AES_KEY = getRandomKey().toString('hex')

const router = new Router()
router
  // API for provides PUBLICKEY
  .get('/publickey', (ctx) => {
    logger('Return publickey to the client')
    ctx.body = RSA_PUBLIC_KEY
  })
  // API for key exchange
  .post('/exchange', (ctx) => {
    const clientRSAEncryptPublicKey = ctx.request.body.key
    logger('Get the encrypted client publickey sent from the client')
    const clientRSAPublicKey = segmentedRSADecrypt(clientRSAEncryptPublicKey, RSA_PRIVATE_KEY)
    logger('Decrypt the encrypted client publickey sent from the client: ')
    console.log(clientRSAPublicKey)

    const encryptAESKey = segmentedRSAEncrypt(AES_KEY, clientRSAPublicKey)
    logger("Use the client's publicKey to encrypt the server's AES key", encryptAESKey)
    logger('Return the encrypted AES to the client')

    ctx.body = encryptAESKey
  })
  // API for business (sensitive) data processing
  .post('/login', (ctx) => {
    const encryptData = ctx.request.body.key
    logger('Receive encrypted data sent by the client', encryptData)
    const decryptData = decryptWithAES(encryptData, AES_KEY)
    logger('The business (sensitive) data after AES decryption is', decryptData)
    logger('Return encrypted response data')

    const responseData = { token: 'xxxx', succ: true }
    ctx.body = encryptWithAES(JSON.stringify(responseData), AES_KEY)
  })

app.use(router.routes(), router.allowedMethods())

function launch () {
  return new Promise((resolve) => {
    app.listen(PORT, () => {
      logger('Main server startup completed'.bgGreen, `http://127.0.0.1:${PORT}`)
      printSeparator()
      resolve()
    })
  })
}

module.exports = {
  launch
}