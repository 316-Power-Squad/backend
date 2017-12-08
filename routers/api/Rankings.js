import express from 'express';
import apicache from 'apicache';
import Ranking from '../../models/Ranking';
import { formatResponse } from '../../helpers/api';
import algorithm from '../../kolas_algorithm';

const router = express.Router();
let cache = apicache.middleware;

const qualifyTeams = gender => {
  return new Promise(async (resolve, reject) => {
    try {
      const regionals = await Ranking.getRegionals(gender);
      const meets = await Ranking.getMeets(gender);
      const result = await algorithm(regionals, meets);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
};

router.get('/clear', (req, res) => {
  apicache.clear();
  res.json(formatResponse({ clear: true }));
});

// Need to have separate routes as we need to cache the two
// calls separately
router.get('/mens', cache('1 week'), async (req, res) => {
  try {
    const result = await qualifyTeams('mens');
    res.json(formatResponse(result));
  } catch (err) {
    res.json(formatResponse({}, err));
  }
});

router.get('/womens', cache('1 week'), async (req, res) => {
  try {
    const result = await qualifyTeams('womens');
    res.json(formatResponse(result));
  } catch (err) {
    res.json(formatResponse({}, err));
  }
});

export default router;
