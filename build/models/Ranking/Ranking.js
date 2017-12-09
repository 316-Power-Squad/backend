'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMeets = exports.getRegionals = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _db = require('../../helpers/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Helper function to format the output of the database in a way that the
 * algorithm can actually read
 * @param {* Array} rows
 */
var formatRegions = function formatRegions(rows) {
  var res = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(rows), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var row = _step.value;

      if (!res[row.region_name]) {
        res[row.region_name] = [row.team_name];
      } else {
        var curr_teams = res[row.region_name];
        curr_teams.push(row.team_name);
        res[row.region_name] = curr_teams;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return res;
};

var getRegionals = exports.getRegionals = function getRegionals(gender) {
  return new _promise2.default(function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
      var rows;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return _db2.default.queryAsync('SELECT Region.name as region_name, \n          Team.name as team_name\n         FROM Region, Team, RegionalRank\n         WHERE Region.id = Team.region_id\n         AND Team.id = RegionalRank.team_id\n         AND Team.gender=?\n         AND Region.name <> \'N/A\' \n         ORDER BY Region.name, RegionalRank.rank\n        ', [gender]);

            case 3:
              rows = _context.sent;

              resolve(formatRegions(rows));
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

/**
 * Helper function to format the output of the database in a way that the
 * algorithm can actually read
 * @param {* Array} rows
 */
var formatMeets = function formatMeets(rows) {
  var res = {};
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = (0, _getIterator3.default)(rows), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var row = _step2.value;

      if (!res[row.meet_name]) {
        res[row.meet_name] = [row.meet_date, [row.team_name]];
      } else {
        var curr_teams = res[row.meet_name][1];
        curr_teams.push(row.team_name);
        res[row.meet_name][1] = curr_teams;
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return res;
};

var getMeets = exports.getMeets = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(gender) {
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt('return', new _promise2.default(function () {
              var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve, reject) {
                var rows;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        _context2.prev = 0;
                        _context2.next = 3;
                        return _db2.default.queryAsync('SELECT Team.name as team_name,\n            Meet.id as meet_id, \n            Meet.date as meet_date,\n            Meet.name as meet_name, \n            Participates.placement \n          FROM Meet, Participates, Team \n          WHERE Participates.meet_id = Meet.id\n          AND Participates.team_id = Team.id\n          AND Team.gender = ?\n          ORDER BY Meet.name, Participates.placement\n        ', [gender]);

                      case 3:
                        rows = _context2.sent;

                        resolve(formatMeets(rows));
                        _context2.next = 10;
                        break;

                      case 7:
                        _context2.prev = 7;
                        _context2.t0 = _context2['catch'](0);

                        reject(_context2.t0);

                      case 10:
                      case 'end':
                        return _context2.stop();
                    }
                  }
                }, _callee2, undefined, [[0, 7]]);
              }));

              return function (_x4, _x5) {
                return _ref3.apply(this, arguments);
              };
            }()));

          case 1:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function getMeets(_x3) {
    return _ref2.apply(this, arguments);
  };
}();

exports.default = {
  getRegionals: getRegionals,
  getMeets: getMeets
};
//# sourceMappingURL=Ranking.js.map