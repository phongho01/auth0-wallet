const User = require('../models/User');

class UserService {
  findOneByCondition(conditions = {}) {
    return User.find(conditions);
  }

  createOne(data) {
    return User.create(data);
  }
}

module.exports = new UserService();
