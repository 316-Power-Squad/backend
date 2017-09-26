import express from 'express';
import db, { MODE_TEST, MODE_PRODUCTION } from './helpers/db';
import Team from './models/Team';
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

    app.get('/api/teams', (req, res) => {
      Team.allTeams((result, err) => {
        if (err) res.send(err);
        else res.send(result);
      });
    });

    app.post('/api/teams/new', (req, res) => {
      // create a new team
      res.send('NOT IMPLEMENTED');
    });

    app.get('/api/teams/:id', (req, res) => {
      Team.getTeam(req.params.id, (result, err) => {
        if (err) res.send(err);
        else res.send(result);
      });
    });

    // Define the port we are listening on
    app.listen(3001, () => {
      console.log('Listening on port 3001...');
    });
  }
});
