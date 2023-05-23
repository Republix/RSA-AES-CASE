const crypto = require('crypto')

/**
 * generate rsa keys
 */
function generateRSAKeyPair () {
  const options = {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  }
  return crypto.generateKeyPairSync('rsa', options)
}

function segmentedRSAEncrypt (data, publicKey, encryptDataLength = 256) {
  const buffer = Buffer.from(data)
  // sha1 
  const chunkSize = encryptDataLength - 20 * 2 - 2
  const chunks = []
  for (let i = 0; i < buffer.length; i += chunkSize) {
    const chunk = buffer.slice(i, i + chunkSize)
    const encryptedChunk = crypto.publicEncrypt(publicKey, chunk)
    chunks.push(encryptedChunk)
  }
  return Buffer.concat(chunks).toString('base64')
}

function segmentedRSADecrypt (data, privateKey, encryptDataLength = 256) {
  const buffer = Buffer.from(data, 'base64')
  const byteLength = buffer.length

  const chunkSize = encryptDataLength
  const chunks = []

  for (let i = 0; i < byteLength; i += chunkSize) {
    const chunk = buffer.slice(i, i + chunkSize)
    const decryptedChunk = crypto.privateDecrypt({
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
    }, chunk)
    chunks.push(decryptedChunk);
  }
  // handle last chunk
  const lastChunk = chunks[chunks.length - 1]
  const lastChunkLength = lastChunk.length
  if (lastChunkLength < chunkSize) {
    const padding = Buffer.alloc(chunkSize - lastChunkLength)
    chunks[chunks.length - 1] = Buffer.concat([lastChunk, padding])
  }
  return Buffer.concat(chunks).toString('utf-8')
}

function getRandomKey () {
  const keyLength = 32
  return crypto.randomBytes(keyLength)
}

function encryptWithAES (data, key) {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv)

  let encrypted = cipher.update(data)
  encrypted = Buffer.concat([encrypted, cipher.final()])

  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

function decryptWithAES (data, key) {
  const parts = data.split(':')
  const iv = Buffer.from(parts.shift(), 'hex')

  const encryptedText = Buffer.from(parts.join(':'), 'hex')
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv)

  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])

  return decrypted.toString()
}

module.exports = {
  generateRSAKeyPair,
  segmentedRSAEncrypt,
  segmentedRSADecrypt,
  getRandomKey,
  encryptWithAES,
  decryptWithAES
}