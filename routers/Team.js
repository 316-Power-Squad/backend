/**
 * Team controller - handles all the api routes that deal with teams
 */
import express from 'express';
const router = express.Router();
import Team from '../models/Team';

router.get('/', (req, res) => {
  Team.allTeams((result, err) => {
    if (err) res.send(err);
    else res.send(result);
  });
});

router.post('/new', (req, res) => {
  // create a new team
  res.send('NOT IMPLEMENTED');
});

router.get('/:id', (req, res) => {
  Team.getTeam(req.params.id, (result, err) => {
    if (err) res.send(err);
    else res.send(result);
  });
});

export default router;
