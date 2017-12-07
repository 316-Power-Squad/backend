import db from '../../helpers/db';

/**
 * Helper function to format the output of the database in a way that the
 * algorithm can actually read
 * @param {* Array} rows
 */
const formatRegions = rows => {
  let res = {};
  for (let row of rows) {
    if (!res[row.region_name]) {
      res[row.region_name] = [row.team_name];
    } else {
      let curr_teams = res[row.region_name];
      curr_teams.push(row.team_name);
      res[row.region_name] = curr_teams;
    }
  }
  return res;
};

export const getRegionals = gender => {
  return new Promise(async (resolve, reject) => {
    try {
      const rows = await db.queryAsync(
        `SELECT Region.name as region_name, 
          Team.name as team_name
         FROM Region, Team 
         WHERE Region.id = Team.region_id
         AND Team.gender=?
         AND Region.name <> 'N/A' 
        `,
        [gender]
      );
      resolve(formatRegions(rows));
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
          ORDER BY Meet.name, Participates.placement
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
