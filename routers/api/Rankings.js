import express from 'express';
const router = express.Router();
import Ranking from '../../models/Ranking';
import { formatResponse } from '../../helpers/api';
import algorithm from '../../kolas_algorithm';

router.get('/', async (req, res) => {
  try {
    // const teams = await Ranking.getRegionals('mens');
    // const meets = await Ranking.getMeets('mens');
    const result = await algorithm();
    res.send(formatResponse(result));
  } catch (err) {
    res.send(formatResponse({}, err));
  }
});

export default router;
