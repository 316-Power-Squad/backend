import mysql from 'mysql';
import async from 'async';

export const PRODUCTION_DB = 'atlargeprod';
export const TEST_DB = 'atlargetest';

export const MODE_TEST = 'MODE_TEST';
export const MODE_PRODUCTION = 'MODE_PRODUCTION';

let state = {
  pool: null,
  mode: null,
};

const connect = (mode, done) => {
  state.pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    // password: 'Powersquad',
    database: mode === MODE_PRODUCTION ? PRODUCTION_DB : TEST_DB,
  });

  state.mode = mode;
  done();
};

const get = () => state.pool;

const disconnect = () => {
  get().end();
};

const queryAsync = async (query, params) => {
  return new Promise((resolve, reject) => {
    state.pool.query(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export default {
  connect,
  get,
  queryAsync,
  disconnect,
};
