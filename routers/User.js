import express from 'express';
const router = express.Router();
import User from '../models/User';
import { formatResponse } from '../helpers/api';

router.post('/new', (req, res) => {
  // create a new team
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;
  User.newUser(name, username, password, (result, err) => {
    res.send(formatResponse(result, err));
  });
});

router.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  User.validateUser(username, password, (result, err) => {
    res.send(formatResponse(result, err));
  });
});

export default router;
