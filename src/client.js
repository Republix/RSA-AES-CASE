const { request } = require('./lib/utils')
const { generateRSAKeyPair, segmentedRSADecrypt, segmentedRSAEncrypt, encryptWithAES, decryptWithAES } = require('./lib/crypto')
const { getLogger } = require('./lib/utils')

const logger = getLogger('[client-server]'.bgCyan)

// Generate client RSA public and private keys
const { publicKey, privateKey } = generateRSAKeyPair()
const RSA_PUBLIC_KEY = publicKey // client rsa public key
const RSA_PRIVATE_KEY = privateKey // client rsa private key

/**
 * Simulate client flow
 */
async function simulateFlow () {
  logger('Request the server to obtain the publickey')
  const serverPublicKey = await request('/publickey', null, 'GET')
  logger('Request the server to obtain the publickey')
  console.log(serverPublicKey)

  // Encrypt the client's private key with the server's public key
  const encryptClientPublickKey = segmentedRSAEncrypt(RSA_PUBLIC_KEY, serverPublicKey)
  logger('Send encrypted client public key', encryptClientPublickKey)
  const encryptAESKey = await request('/exchange', { key: encryptClientPublickKey })
  logger('Obtain the AES encryption returned by the server', encryptAESKey)
  
  // Use the client's private key to decrypt the encrypted AES data returned by the server
  const decryptAESKey = segmentedRSADecrypt(encryptAESKey, RSA_PRIVATE_KEY)
  logger('Decrypt AES to get plaintext AES', decryptAESKey)

  const sendData = JSON.stringify({ username: 'admin', password: 'Administrator!@#DEM0', mark: '~1234567890-+qwertyuiop[]' })
  // Use the decrypted AES to encrypt the sent data
  const encryptSendData = encryptWithAES(sendData, decryptAESKey)
  logger('Encryption using AES requires data to be sent', encryptSendData)

  // Send business (sensitive) data encrypted with AES to the server
  const encryptLoginResponseData = await request('/login', { key: encryptSendData })
  logger('Get the response data and decrypt it', decryptWithAES(encryptLoginResponseData, decryptAESKey))
  logger('end of process')

  process.exit()
}

module.exports = {
  simulateFlow
}