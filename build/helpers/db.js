'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MODE_PRODUCTION = exports.MODE_TEST = exports.TEST_DB = exports.PRODUCTION_DB = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PRODUCTION_DB = exports.PRODUCTION_DB = 'atlargeprod';
var TEST_DB = exports.TEST_DB = 'atlargetest';

var MODE_TEST = exports.MODE_TEST = 'MODE_TEST';
var MODE_PRODUCTION = exports.MODE_PRODUCTION = 'MODE_PRODUCTION';

var state = {
  pool: null,
  mode: null
};

var connect = function connect(mode, done) {
  state.pool = _mysql2.default.createPool({
    host: mode === MODE_PRODUCTION ? process.env.PRODUCTION_HOST : 'localhost',
    user: mode === MODE_PRODUCTION ? process.env.MYSQL_USERNAME : 'root',
    password: process.env.MYSQL_PASSWORD,
    // password: 'Powersquad',
    database: mode === MODE_PRODUCTION ? PRODUCTION_DB : TEST_DB
  });

  state.mode = mode;
  done();
};

var get = function get() {
  return state.pool;
};

var disconnect = function disconnect() {
  get().end();
};

var queryAsync = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(query, params) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', new _promise2.default(function (resolve, reject) {
              state.pool.query(query, params, function (err, rows) {
                if (err) reject(err);else resolve(rows);
              });
            }));

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function queryAsync(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = {
  connect: connect,
  get: get,
  queryAsync: queryAsync,
  disconnect: disconnect
};
//# sourceMappingURL=db.js.map