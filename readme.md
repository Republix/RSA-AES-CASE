# RSA+AES混合加密演示
> 模拟双方(node)加密通信的流程，使用分段加密解密RSA

[english](/doc/readme-en.md)

## 演示

```
# 安装依赖
yarn

# 执行演示
yarn run start
```

## 流程
> 简化流程: 
> 
> 1 拿到服务端`publicKey`
>
> 2 通过双向加密通信交换`publicKey`，服务端返回加密的AES给客户端
>
> 3 客户端利用获取到的aes进行数据加密传送业务(敏感)数据

> 在流程开始前 服务端应有RSA公钥(`serverPublicKey`)私钥(`serverPrivateKey`)，以及AES密钥(`serverAESKey`)，客户端应有RSA公钥(`clientPublicKey`)私钥(`clientPrivateKey`)

1. **(第一次请求)** 客户端请求服务端获取`serverPublicKey`
2. 服务端将`serverPublicKey`返回给客户端
3. **(第一次响应)** 客户端收到明文`serverPublicKey`
4. **(第二次请求)** 客户端利用`serverPublicKey`将`clientPublicKey`进行加密得到加密后的公钥数据`encryptedClientPublicKey`,  将`encryptedClientPublicKey`发送给服务端
5. 服务端利用`serverPrivateKey`对`encryptedClientPublicKey`进行解密，解密后得到的`clientPublicKey`
6. 服务端利用`clientPublicKey`对`serverAESKey`进行加密得到`encryptedAesKey`并将其返回给客户端
7. **(第二次响应)** 客户端拿到加密的AES数据`encryptedAesKey`， 利用自己的`clientPrivateKey`对其解密得到`serverAESKey`
8. **(第三次请求)** 客户端将数据利用`serverAESKey`对要发送给后台的业务(敏感)数据进行加密, 发送利用aes加密后的数据
9. 服务端拿到加密后的业务(敏感)数据并利用`serverAESKey`进行解密
10. **(第三次响应)** 处理业务逻辑. 返回经`serverAESKey`加密的业务数据给客户端, 客户端利用`serverAESKey`进行aes解密得到关键数据