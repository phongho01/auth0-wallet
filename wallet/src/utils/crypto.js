require('dotenv').config();
const crypto = require('crypto');
const fs = require('fs');

const generateKeyPair = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    namedCurve: 'secp256k1',
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: process.env.PASSPHRASE,
    },
  });
  fs.writeFileSync('private.pem', privateKey);
  fs.writeFileSync('public.pem', publicKey);
  res.send();
};

const encryptData = (data) => {
  const publicKey = fs.readFileSync('public.pem', 'utf8');
  const buffer = Buffer.from(data);
  const encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString('base64');
};

const decryptedData = (data) => {
  const privateKey = fs.readFileSync('private.pem', 'utf8');
  const buffer = Buffer.from(hash, 'base64');
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey.toString(),
      passphrase: process.env.PASSPHRASE,
    },
    buffer
  );

  return decrypted.toString('utf8');
};

module.exports = {
  generateKeyPair,
  encryptData,
  decryptedData,
};
