const app = require('./server');
const connectDB = require('./config/db');
const port = 3001;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log('App is listening on port', port);
    });
  })
  .catch(console.error);
