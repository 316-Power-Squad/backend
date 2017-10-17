import mysql from 'mysql';
import async from 'async';

const PRODUCTION_DB = 'atlargeprod';
const TEST_DB = 'atlargetest';

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
    database: mode === MODE_PRODUCTION ? PRODUCTION_DB : TEST_DB,
  });

  state.mode = mode;
  done();
};

const get = () => state.pool;

const disconnect = () => {
  get().end();
};

const fixtures = data => {
  const pool = state.pool;
  if (!pool) return done(new Error('Missing database connection.'));

  var names = Object.keys(data.tables);
  async.each(
    names,
    function(name, cb) {
      async.each(
        data.tables[name],
        function(row, cb) {
          var keys = Object.keys(row),
            values = keys.map(function(key) {
              return "'" + row[key] + "'";
            });

          pool.query(
            'INSERT INTO ' +
              name +
              ' (' +
              keys.join(',') +
              ') VALUES (' +
              values.join(',') +
              ')',
            cb
          );
        },
        cb
      );
    },
    done
  );
};

const drop = (tables, done) => {
  const pool = state.pool;
  if (!pool) return done(new Error('Missing database connection.'));

  async.each(
    tables,
    function(name, cb) {
      pool.query('DELETE * FROM ' + name, cb);
    },
    done
  );
};

connect(MODE_TEST, () => {
  return
});


export default {
  connect,
  get,
  fixtures,
  drop,
  disconnect,
};
