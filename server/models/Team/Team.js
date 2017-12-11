/**
 * Example model for querying the teams
 */
import db from '../../helpers/db';
import { sqlError } from '../../helpers/db';
import { noTeamError, nameError } from './errors';

export const getTeam = id => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await db.queryAsync(`SELECT * from Team WHERE ID=?`, [id]);
      if (res.length === 0) {
        reject(noTeamError);
      } else {
        resolve(res[0]);
      }
    } catch (err) {
      reject(err);
    }
  });
};

// Get team stats for a graph
export const getTeamStats = () => {
  return new Promise((resolve, reject) => {
    try {
      const res = db.queryAsync(``, []);
    } catch (err) {}
  });
};

export const getMeets = id => {
  return new Promise((resolve, reject) => {
    try {
      const res = db.queryAsync(
        `
        SELECT Participates.meet_id, Participates.placement, Meet.name as meet, Meet.date
        FROM Participates, Meet 
        WHERE Participates.team_id=?
          AND Meet.id = Participates.meet_id 
        ORDER BY Meet.id DESC 
        LIMIT 10
        `,
        [id]
      );
      resolve(res);
    } catch (err) {
      reject(err);
    }
  });
};

export const allTeams = done => {
  db.get().query(`SELECT * FROM Team`, (err, rows) => {
    if (err) return done([], sqlError);
    done(rows);
  });
};

export default {
  getTeam,
  getMeets,
  allTeams,
};
