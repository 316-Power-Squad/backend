import express from 'express';
const router = express.Router();
import User from '../models/User';
import { formatResponse } from '../helpers/api';

router.post('/new', (req, res) => {
  // create a new team
  const { name, email, password } = req.body;
  User.newUser(name, email, password, (result, err) => {
    res.send(formatResponse(result, err));
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  User.validateUser(email, password, (result, err) => {
    res.send(formatResponse(result, err));
  });
});

export default router;
