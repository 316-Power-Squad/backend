import express from 'express';
import db, { MODE_TEST, MODE_PRODUCTION } from './helpers/db';
const app = express();

// Connect to MySQL on start
db.connect(MODE_TEST, function(err) {
  if (err) {
    console.log('Unable to connect to MySQL.');
    process.exit(1);
  } else {
    // Define the API endpoints
    app.get('/api', (req, res) => {
      res.send('Hello world');
    });

    // Define the port we are listening on
    app.listen(3001, () => {
      console.log('Listening on port 3001...');
    });
  }
});
