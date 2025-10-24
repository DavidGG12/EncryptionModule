const { contextBridge } = require('electron');
const crypto = require('crypto');
const { Encryption } = require('./js/Encryption');

const inEncryption = Encryption.getInstance();

contextBridge.exposeInMainWorld('instances', {
  _inCrypto: crypto
});

contextBridge.exposeInMainWorld('functions', {
    _encrypt: (word, secretKey) => inEncryption.encrypt(word, secretKey),
    _decrypt: (word, secretKey) => inEncryption.decrypt(word, secretKey)
})