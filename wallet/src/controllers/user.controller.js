const ethers = require('ethers');
const web3 = require('web3');
const requestIp = require('request-ip');
const crypto = require('crypto');
const fs = require('fs');
const userService = require('../services/user.service');

class UserController {
  async create(req, res) {
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
    console.log(user, hash);
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

    const isExistedUser = await userService.findOneByCondition({
      uid_auth0: user,
    });
    if (isExistedUser) {
      res.status(429).send('User already exists');
      return;
    }

    const wallet = web3.eth.accounts.create();

    const newUser = await userService.createOne({
      uid_auth0: user,
      address: wallet.address,
      private_key: wallet.privateKey,
      chain: 'eth',
    });

    res.json(newUser);
  }
}

module.exports = new UserController();
