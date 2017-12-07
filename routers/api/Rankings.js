import express from 'express';
const router = express.Router();
import { formatResponse } from '../../helpers/api';

router.get('/', async (req, res) => {
  try {
    const data = await fakeFunction();
    res.send(formatResponse(data));
  } catch (err) {
    res.send(formatResponse({}, err));
  }
});

export default router;
