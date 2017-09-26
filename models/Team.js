/**
 * Example model for querying the teams
 */
import db from '../helpers/db';

export const getTeam = (id, done) => {
  db.get().query(`SELECT * FROM Team WHERE id=${id}`, (err, rows) => {
    if (err) return done(null, err);
    else if (rows.length === 0) {
      return done(null, 'No team was found');
    }
    done(rows[0]);
  });
};

export const allTeams = done => {
  db.get().query(`SELECT * FROM Team`, (err, rows) => {
    if (err) return done(null, err);
    done(rows);
  });
};

export const addTeam = (name, done) => {
  db.get().query(`INSERT INTO Team (name) VALUES ('${name}')`, (err, rows) => {
    if (err) return done(null, err);
    // TODO: standardize API results with success / failure, etc
    return { result: true };
  });
};

export default {
  getTeam,
  allTeams,
};
