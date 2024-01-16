require('dotenv').config();
const web3 = require('web3');
const crypto = require('crypto');
const userService = require('../services/user.service');
const { encryptData, decryptedData } = require('../utils/crypto');

class UserController {
  async create(req, res) {
    const { user, hash } = req.body;

    const decrypted = decryptedData(hash);

    const hashedUserId = crypto.createHash('sha256').update(user).digest('hex');
    if (decrypted !== hashedUserId) {
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
