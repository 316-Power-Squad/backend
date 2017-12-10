import db from '../../helpers/db';
import { sqlError } from '../../helpers/db';
import { noMeetError } from './errors';

export const getMeet = (id, done) => {
  db.get().query(
    `SELECT Team.name as team, Team.gender, Participates.placement, Region.name as region
    FROM Participates, Team, Region 
    WHERE Participates.meet_id=? and Team.id=Participates.team_id and Region.id=Team.region_id; 
  `,
    [id],
    (err, rows) => {
      if (err) return done({}, err);
      else if (rows.length === 0) {
        return done({}, noMeetError);
      }
      done(rows);
    }
  );
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
