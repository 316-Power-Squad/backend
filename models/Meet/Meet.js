import db from '../../helpers/db';
import { sqlError } from '../../helpers/db';
import { noMeetError } from './errors';

export const getMeet = (id, done) => {
  db.get().query(`SELECT * FROM Meet WHERE id=?`, [id], (err, rows) => {
    if (err) return done({}, err);
    else if (rows.length === 0) {
      return done({}, noMeetError);
    }
    done(rows[0]);
  });
};

export const allMeets = done => {
  db.get().query(`SELECT * FROM Meet`, (err, rows) => {
    if (err) return done([], err);
    done(rows);
  });
};

export default {
  getMeet,
  allMeets,
};
