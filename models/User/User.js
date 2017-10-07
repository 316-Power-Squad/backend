import bcrypt from 'bcrypt';
import Validator from 'password-validator';
import jwt from 'jsonwebtoken';
import emailValidator from 'email-validator';

import db from '../../helpers/db';
import {
  hashingError,
  passwordValidationError,
  emailValidationError,
  invalidPasswordError,
} from './errors';

const passwordValidator = new Validator()
  .is()
  .min(10)
  .has()
  .uppercase()
  .has()
  .symbols();

export const newUser = (name, email, password, done) => {
  if (!passwordValidator.validate(password)) {
    done({}, passwordValidationError);
  } else if (!emailValidator.validate(email)) {
    done({}, emailValidationError);
  } else {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) done({}, hashingError);
      else {
        db
          .get()
          .query(
            `INSERT INTO User (name, email, hash) values (?, ?, ?)`,
            [name, email, hash],
            (err, result) => {
              done({}, err);
            }
          );
      }
    });
  }
};

export const validateUser = (email, password, done) => {
  db
    .get()
    .query(`SELECT hash FROM User WHERE email=?`, [email], (err, rows) => {
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
    });
};

export default {
  newUser,
  validateUser,
};
