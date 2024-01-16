const express = require('express');
const cors = require('cors');
const ethers = require('ethers');
const web3 = require('web3');
const requestIp = require('request-ip');
const crypto = require('crypto');
const fs = require('fs');
require('dotenv').config();

const { AUTH0_WHITELIST_IP } = require('./constants');

const port = 3001;

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

app.listen(port);
