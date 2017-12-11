/**
 * Team controller - handles all the api routes that deal with teams
 */
import express from 'express';
const router = express.Router();
import Team from '../../models/Team';
import { formatResponse } from '../../helpers/api';

router.get('/', (req, res) => {
  Team.allTeams((result, err) => {
    res.send(formatResponse(result, err));
  });
});

router.post('/new', (req, res) => {
  // create a new team
  const { name, gender, region } = req.body;
  Team.newTeam(name, gender, region, (result, err) => {
    res.send(formatResponse(result, err));
  });
});

router.get('/:id', async (req, res) => {
  try {
    const team = await Team.getTeam(req.params.id);
    const meets = await Team.getMeets(req.params.id);
    res.send(formatResponse({ team, meets }));
  } catch (err) {
    res.send(formatResponse({}, err));
    console.log(err);
  }
});

export default router;
