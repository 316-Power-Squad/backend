import express from 'express';
import bodyParser from 'body-parser';
import db, { MODE_TEST, MODE_PRODUCTION } from './helpers/db';
import teamRouter from './routers/Team';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

    // namespaced routes
    app.use('/api/teams', teamRouter);

    // Define the port we are listening on
    app.listen(3001, () => {
      console.log('Listening on port 3001...');
    });
  }
});
