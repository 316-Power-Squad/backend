import db from '../../helpers/db';
import { sqlError } from '../../helpers/db';
import { noRegionError } from './errors';

export const getRegion = (id, done) => {
  db.get().query(`SELECT * FROM Region WHERE id=?`, [id], (err, rows) => {
    if (err) return done({}, err);
    else if (rows.length === 0) {
      return done({}, noRegionError);
    }
    done(rows[0]);
  });
};

export const allRegions = done => {
  db.get().query(`SELECT * FROM Region`, (err, rows) => {
    if (err) return done([], err);
    done(rows);
  });
};

export default {
  getRegion,
  allRegions,
};
