const express = require('express');
const cors = require('cors');
const ethers = require('ethers');
const web3 = require('web3');
const requestIp = require('request-ip');
const crypto = require('crypto');
const fs = require('fs');
const morgan = require('morgan');
require('dotenv').config();

const { AUTH0_WHITELIST_IP } = require('./constants');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

app.post('/generate-wallet', (req, res) => {
  const ipInfo = requestIp.getClientIp(req);
  if (ipInfo != '::1') {
    const validIp = AUTH0_WHITELIST_IP.findIndex(
      (value) => '::ffff:' + value == ipInfo || value == ipInfo
    );
    if (validIp < 0) {
      res.status(403).send('Unauthorized');
      return;
    }
  }

  const { user, hash } = req.body;
  const hashedUserId = crypto.createHash('sha256').update(user).digest('hex');

  const privateKey = fs.readFileSync('private.pem', 'utf8');
  const buffer = Buffer.from(hash, 'base64');
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey.toString(),
      passphrase: process.env.PASSPHRASE,
    },
    buffer
  );

  if (decrypted.toString('utf8') !== hashedUserId) {
    res.status(403).send('Unauthorized');
    return;
  }

  const wallet = web3.eth.accounts.create();
  res.json(wallet);
});

// app.post('/generate-key-pair', (req, res) => {
//   const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
//     modulusLength: 4096,
//     namedCurve: 'secp256k1',
//     publicKeyEncoding: {
//       type: 'spki',
//       format: 'pem',
//     },
//     privateKeyEncoding: {
//       type: 'pkcs8',
//       format: 'pem',
//       cipher: 'aes-256-cbc',
//       passphrase: process.env.PASSPHRASE,
//     },
//   });

//   fs.writeFileSync('private.pem', privateKey);
//   fs.writeFileSync('public.pem', publicKey);

//   res.send()
// });

module.exports = app;
