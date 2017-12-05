import db from '../../helpers/db';

export const getRegionals = gender => {
  return new Promise(async (resolve, reject) => {
    try {
      let regions = [];
      const rows = await db.queryAsync(
        `SELECT * FROM Region, Team WHERE Region.id = Team.region_id and Team.gender=?`,
        [gender]
      );
      // Iterate over each region
      for (let row of rows) {
        regions.push(row.name);
      }
      resolve(regions);
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Helper function to format the output of the database in a way that the
 * algorithm can actually read
 * @param {* Array} rows
 */
const formatMeets = rows => {
  let res = {};
  for (let row of rows) {
    if (!res[row.meet_name]) {
      res[row.meet_name] = ['2017-09-29', [row.team_name]];
    } else {
      let curr_teams = res[row.meet_name][1];
      curr_teams.push(row.team_name);
      res[row.meet_name][1] = curr_teams;
    }
  }
  return res;
};

export const getMeets = async gender => {
  return new Promise(async (resolve, reject) => {
    try {
      const rows = await db.queryAsync(
        `SELECT Team.name as team_name,
            Meet.id as meet_id, 
            Meet.name as meet_name, 
            Participates.placement 
          FROM Meet, Participates, Team 
          WHERE Participates.meet_id = Meet.id
          AND Participates.team_id = Team.id
          AND Team.gender = ?
        `,
        [gender]
      );
      resolve(formatMeets(rows));
    } catch (err) {
      reject(err);
    }
  });
};

export default {
  getRegionals,
  getMeets,
};
