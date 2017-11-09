import express from 'express';
const router = express.Router();
import Region from '../../models/Region';
import { formatResponse } from '../../helpers/api';

router.get('/', (req, res) => {
  Region.allRegions((result, err) => {
    res.send(formatResponse(result, err));
  });
});

router.get('/:id', (req, res) => {
  Region.getRegion(req.params.id, (result, err) => {
    res.send(formatResponse(result, err));
  });
});

export default router;
