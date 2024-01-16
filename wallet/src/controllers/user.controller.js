require('dotenv').config();
const web3 = require('web3');
const crypto = require('crypto');
const userService = require('../services/user.service');
const { encryptData, decryptedData } = require('../utils/crypto');

class UserController {
  async create(req, res) {
    try {
      const { user, hash } = req.body;

      const decrypted = decryptedData(hash);

      const hashedUserId = crypto
        .createHash('sha256')
        .update(user)
        .digest('hex');
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
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async show(req, res) {
    try {
      const user = await userService.findOneByCondition({
        uid_auth0: req.params.uid_auth0,
      });
      if (!user) {
        res.status(404).send('User not found');
        return;
      }
      const { private_key, ...data } = user;
      res.json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = new UserController();
