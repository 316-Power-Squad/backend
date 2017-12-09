import teamRouter from './Team';
import meetRouter from './Meet';
import regionRouter from './Region';
import rankingsRouter from './Rankings';
import express from 'express';
import jwt from 'jsonwebtoken';
import { jwtAuthError, jwtNotProvidedError } from '../../helpers/errors';
import { formatResponse } from '../../helpers/api';

const router = express.Router();

// route middleware to verify a token
router.use((req, res, next) => {
  // check header or url parameters or post parameters for token
  const token =
    req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.send(formatResponse({}, jwtAuthError));
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send(formatResponse({}, jwtNotProvidedError));
  }
});

router.use('/teams', teamRouter);
router.use('/meets', meetRouter);
router.use('/regions', regionRouter);
router.use('/rankings', rankingsRouter);

export default router;
