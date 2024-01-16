require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const userController = require('./controllers/user.controller');
const {
  authenticateIpWhitelist,
} = require('./middlewares/ip-whitelist.middleware');


const app = express();

app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

app.post('/generate-wallet', authenticateIpWhitelist, userController.create);

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
