const mongoose = require('mongoose');

const DB_URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@personal.jxtjoyv.mongodb.net/auth0?retryWrites=true&w=majority`;

const connectDB = async () => {
  return mongoose.connect(DB_URL);
};

module.exports = connectDB;
