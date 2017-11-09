/**
 * Example model for querying the teams
 */
import db from '../../helpers/db';
import { sqlError } from '../../helpers/db';
import { noTeamError, nameError } from './errors';

export const getTeam = (id, done) => {
  db.get().query(`SELECT * FROM Team WHERE id=?`, [id], (err, rows) => {
    if (err) return done({}, sqlError);
    else if (rows.length === 0) {
      return done({}, noTeamError);
    }
    done(rows[0]);
  });
};

export const allTeams = done => {
  db.get().query(`SELECT * FROM Team`, (err, rows) => {
    if (err) return done([], sqlError);
    done(rows);
  });
};

export const newTeam = (name, gender, region, done) => {
  if (name.length < 2 || !['mens', 'womens'].includes(gender)) {
    done([], nameError);
  } else {
    db
      .get()
      .query(
        `INSERT INTO Team (name, gender, region) VALUES (?, ?, ?)`,
        [name, gender, region],
        (err, result) => {
          if (err) return done([], sqlError);
          done({
            id: result.insertId,
          });
        }
      );
  }
};

export default {
  getTeam,
  allTeams,
  newTeam,
};
