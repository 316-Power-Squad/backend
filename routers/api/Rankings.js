import express from 'express';
const router = express.Router();
import Ranking from '../../models/Ranking';
import { formatResponse } from '../../helpers/api';

router.get('/', async (req, res) => {
  try {
    // const teams = await Ranking.getRegionals('mens');
    const meets = await Ranking.getMeets('mens');
    res.send(
      formatResponse({
        meets,
      })
    );
  } catch (err) {
    res.send(formatResponse({}, err));
  }
});

export default router;
