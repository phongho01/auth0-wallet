const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
  {
    uid_auth0: { type: String, unique: true, index: true },
    address: { type: String, unique: true, index: true },
    private_key: { type: String, require: true },
    chain: { type: String, default: 'eth' },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', UserSchema);
