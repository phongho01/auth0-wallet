const User = require('../models/User');

class UserService {
  findOneByCondition(conditions = {}) {
    return User.findOne(conditions);
  }

  createOne(data) {
    return User.create(data);
  }
}

module.exports = new UserService();
