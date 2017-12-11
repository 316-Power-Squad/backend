'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.allTeams = exports.getMeets = exports.getTeamStats = exports.getTeam = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _db = require('../../helpers/db');

var _db2 = _interopRequireDefault(_db);

var _errors = require('./errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getTeam = exports.getTeam = function getTeam(id) {
  return new _promise2.default(function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
      var res;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return _db2.default.queryAsync('SELECT * from Team WHERE ID=?', [id]);

            case 3:
              res = _context.sent;

              if (res.length === 0) {
                reject(_errors.noTeamError);
              } else {
                resolve(res[0]);
              }
              _context.next = 10;
              break;

            case 7:
              _context.prev = 7;
              _context.t0 = _context['catch'](0);

              reject(_context.t0);

            case 10:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined, [[0, 7]]);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
};

// Get team stats for a graph
/**
 * Example model for querying the teams
 */
var getTeamStats = exports.getTeamStats = function getTeamStats() {
  return new _promise2.default(function (resolve, reject) {
    try {
      var res = _db2.default.queryAsync('', []);
    } catch (err) {}
  });
};

var getMeets = exports.getMeets = function getMeets(id) {
  return new _promise2.default(function (resolve, reject) {
    try {
      var res = _db2.default.queryAsync('\n        SELECT Participates.meet_id, Participates.placement, Meet.name as meet, Meet.date\n        FROM Participates, Meet \n        WHERE Participates.team_id=?\n          AND Meet.id = Participates.meet_id \n        ORDER BY Meet.id DESC \n        LIMIT 10\n        ', [id]);
      resolve(res);
    } catch (err) {
      reject(err);
    }
  });
};

var allTeams = exports.allTeams = function allTeams(done) {
  _db2.default.get().query('SELECT * FROM Team', function (err, rows) {
    if (err) return done([], _db.sqlError);
    done(rows);
  });
};

exports.default = {
  getTeam: getTeam,
  getMeets: getMeets,
  allTeams: allTeams
};
//# sourceMappingURL=Team.js.map