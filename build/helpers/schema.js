'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.seed = exports.Views = exports.Schemas = exports.createDatabaseQueries = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Put all table creation code here. Make sure to include the line where we drop
// the table if it exists - otherwise our create table query will fail

var createDatabaseQueries = exports.createDatabaseQueries = ['DROP DATABASE IF EXISTS atlargetest', 'DROP DATABASE IF EXISTS atlargeprod', 'CREATE DATABASE atlargetest', 'CREATE DATABASE atlargeprod']; /**
                                                                                                                                                                                                           * In this file we define the schema for the database. We also provide a function for
                                                                                                                                                                                                           * intitializing the schema. Need to worry about updating the schema as well (migrations)
                                                                                                                                                                                                           */
var Schemas = exports.Schemas = ['DROP TABLE IF EXISTS User, Team, Region, RegionalRank, Meet, Participates', '\n  CREATE TABLE User (\n    email varchar(255) NOT NULL,\n    name varchar(255) NOT NULL,\n    hash varchar(255) NOT NULL,\n    PRIMARY KEY (email)\n  )\n', '\n  CREATE TABLE Team (\n    ID int NOT NULL AUTO_INCREMENT,\n    name varchar(255) NOT NULL,\n    region_id int NOT NULL REFERENCES Region(id),\n    gender ENUM(\'mens\', \'womens\') NOT NULL,\n    PRIMARY KEY (ID),\n    UNIQUE(name, gender)\n  )\n', '\n  CREATE TABLE Region (\n    ID int NOT NULL AUTO_INCREMENT,\n    name varchar(255) NOT NULL,\n    PRIMARY KEY (ID),\n    UNIQUE(name)\n  )\n', '\n  CREATE TABLE RegionalRank (\n    team_id int NOT NULL REFERENCES Team(id),\n    region_id int NOT NULL REFERENCES Region(id),\n    rank int NOT NULL,\n    PRIMARY KEY (team_id)\n  )\n', '\n  CREATE TABLE Meet (\n    ID int NOT NULL AUTO_INCREMENT,\n    name varchar(255) NOT NULL,\n    date varchar(255) NOT NULL,\n    PRIMARY KEY (ID)\n  )\n', '\n  CREATE TABLE Participates (\n    team_id int NOT NULL REFERENCES Team(id),\n    meet_id int NOT NULL REFERENCES Meet(id),\n    placement int NOT NULL,\n    PRIMARY KEY (team_id, meet_id)\n  )\n'];

var Views = exports.Views = [];

var asyncQuery = function asyncQuery(conn, query) {
  return new _promise2.default(function (resolve, reject) {
    conn.query(query, function (err, rows) {
      if (err) reject(err);else resolve(rows);
    });
  });
};

var executeQueries = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(conn, queryArray) {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt('return', new _promise2.default(function () {
              var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
                var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, query;

                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context.prev = 3;
                        _iterator = (0, _getIterator3.default)(queryArray);

                      case 5:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                          _context.next = 18;
                          break;
                        }

                        query = _step.value;
                        _context.prev = 7;
                        _context.next = 10;
                        return asyncQuery(conn, query);

                      case 10:
                        _context.next = 15;
                        break;

                      case 12:
                        _context.prev = 12;
                        _context.t0 = _context['catch'](7);

                        reject(_context.t0);

                      case 15:
                        _iteratorNormalCompletion = true;
                        _context.next = 5;
                        break;

                      case 18:
                        _context.next = 24;
                        break;

                      case 20:
                        _context.prev = 20;
                        _context.t1 = _context['catch'](3);
                        _didIteratorError = true;
                        _iteratorError = _context.t1;

                      case 24:
                        _context.prev = 24;
                        _context.prev = 25;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                          _iterator.return();
                        }

                      case 27:
                        _context.prev = 27;

                        if (!_didIteratorError) {
                          _context.next = 30;
                          break;
                        }

                        throw _iteratorError;

                      case 30:
                        return _context.finish(27);

                      case 31:
                        return _context.finish(24);

                      case 32:
                        resolve();

                      case 33:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined, [[3, 20, 24, 32], [7, 12], [25,, 27, 31]]);
              }));

              return function (_x3, _x4) {
                return _ref2.apply(this, arguments);
              };
            }()));

          case 1:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function executeQueries(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// This is what callback hell looks like - should use async / await
var seed = exports.seed = function seed(mode) {
  var prod = mode === _db.MODE_PRODUCTION;
  // Create a separate connection for creating the database. Don't do this on
  // prod as we only get one database
  var initialConnection = prod ? null : _mysql2.default.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PASSWORD
  });

  var seedConnection = _mysql2.default.createConnection({
    host: prod ? process.env.DATABASE_HOST : 'localhost',
    user: prod ? process.env.MYSQL_USERNAME : 'root',
    password: process.env.MYSQL_PASSWORD,
    database: prod ? _db.PRODUCTION_DB : _db.TEST_DB
  });

  return new _promise2.default(function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(resolve, reject) {
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;

              if (prod) {
                _context3.next = 5;
                break;
              }

              _context3.next = 4;
              return executeQueries(initialConnection, createDatabaseQueries);

            case 4:
              initialConnection.end();

            case 5:
              _context3.next = 7;
              return executeQueries(seedConnection, Schemas);

            case 7:
              _context3.next = 9;
              return executeQueries(seedConnection, Views);

            case 9:
              seedConnection.end();
              process.exit(0);
              _context3.next = 16;
              break;

            case 13:
              _context3.prev = 13;
              _context3.t0 = _context3['catch'](0);

              console.log(_context3.t0);

            case 16:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined, [[0, 13]]);
    }));

    return function (_x5, _x6) {
      return _ref3.apply(this, arguments);
    };
  }());
};
//# sourceMappingURL=schema.js.map