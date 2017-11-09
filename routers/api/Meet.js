import express from 'express';
const router = express.Router();
import Meet from '../../models/Meet';
import { formatResponse } from '../../helpers/api';

router.get('/', (req, res) => {
  Meet.allMeets((result, err) => {
    res.send(formatResponse(result, err));
  });
});

router.get('/:id', (req, res) => {
  Meet.getMeet(req.params.id, (result, err) => {
    res.send(formatResponse(result, err));
  });
});

export default router;
