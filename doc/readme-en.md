# RSA+AES Hybrid Encryption Demo
> Simulate the process of encrypted communication between two parties (nodes) using segmented RSA encryption and decryption

## Demo

```
# Install dependencies
yarn

# Run the demo
yarn run start
```

## Process
> Simplified process:
> 
> 1. Obtain the server `publicKey`
>
> 2. Exchange `publicKey` through bidirectional encrypted communication, and the server returns the encrypted AES to the client
>
> 3. The client uses the obtained AES to encrypt and transmit business (sensitive) data

> Before the process starts, the server should have RSA public key (`serverPublicKey`) and private key (`serverPrivateKey`), as well as AES key (`serverAESKey`). The client should have RSA public key (`clientPublicKey`) and private key (`clientPrivateKey`).

1. **(First request)** The client requests the server to obtain `serverPublicKey`.
2. The server returns `serverPublicKey` to the client.
3. **(First response)** The client receives the plaintext `serverPublicKey`.
4. **(Second request)** The client uses `serverPublicKey` to encrypt `clientPublicKey` and obtain the encrypted public key data `encryptedClientPublicKey`, and sends it to the server.
5. The server decrypts `encryptedClientPublicKey` using `serverPrivateKey` and obtains `clientPublicKey`.
6. The server uses `clientPublicKey` to encrypt `serverAESKey` and obtain `encryptedAesKey`, and returns it to the client.
7. **(Second response)** The client obtains the encrypted AES data `encryptedAesKey`, and decrypts it using its own `clientPrivateKey` to obtain `serverAESKey`.
8. **(Third request)** The client encrypts the business (sensitive) data to be sent to the backend using `serverAESKey`, and sends the data encrypted with AES.
9. The server obtains the encrypted business (sensitive) data and decrypts it using `serverAESKey`.
10. **(Third response)** Process the business logic. Return the business data encrypted with `serverAESKey` to the client, and the client uses `serverAESKey` to decrypt the AES and obtain the key data.