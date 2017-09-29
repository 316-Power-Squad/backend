import bcrypt from 'bcrypt';
import Validator from 'password-validator';
import jwt from 'jsonwebtoken';

import db from '../../helpers/db';
import {
  hashingError,
  passwordValidationError,
  usernameValidationError,
  invalidPasswordError,
} from './errors';

const passwordValidator = new Validator()
  .is()
  .min(10)
  .has()
  .uppercase()
  .has()
  .symbols();

const usernameValidator = new Validator()
  .is()
  .min(6)
  .is()
  .max(14)
  .has()
  .not()
  .spaces()
  .has()
  .not()
  .uppercase()
  .has()
  .not()
  .symbols();

export const newUser = (name, username, password, done) => {
  if (!passwordValidator.validate(password)) {
    done({}, passwordValidationError);
  } else if (!usernameValidator.validate(username)) {
    done({}, usernameValidationError);
  } else {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) done({}, hashingError);
      else {
        db
          .get()
          .query(
            `INSERT INTO Users (name, username, hash) values (?, ?, ?)`,
            [name, username, hash],
            (err, result) => {
              done({}, err);
            }
          );
      }
    });
  }
};

export const validateUser = (username, password, done) => {
  db
    .get()
    .query(
      `SELECT hash FROM Users WHERE username=?`,
      [username],
      (err, rows) => {
        if (err) done(false, sqlError);
        else {
          bcrypt.compare(password, rows[0].hash, (err, res) => {
            if (res) {
              // We have a valid user...pass them a signed JWT token
              const token = jwt.sign(rows[0].hash, process.env.JWT_SECRET);
              done({ valid: true, token });
            } else {
              done({ valid: false }, invalidPasswordError);
            }
          });
        }
      }
    );
};

export default {
  newUser,
  validateUser,
};
