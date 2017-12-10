'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.allMeets = exports.getMeet = undefined;

var _db = require('../../helpers/db');

var _db2 = _interopRequireDefault(_db);

var _errors = require('./errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getMeet = exports.getMeet = function getMeet(id, done) {
  _db2.default.get().query('SELECT Team.name as team, Team.gender, Participates.placement, Region.name as region\n    FROM Participates, Team, Region \n    WHERE Participates.meet_id=? and Team.id=Participates.team_id and Region.id=Team.region_id; \n  ', [id], function (err, rows) {
    if (err) return done({}, err);else if (rows.length === 0) {
      return done({}, _errors.noMeetError);
    }
    done(rows);
  });
};

var allMeets = exports.allMeets = function allMeets(done) {
  _db2.default.get().query('SELECT * FROM Meet', function (err, rows) {
    if (err) return done([], err);
    done(rows);
  });
};

exports.default = {
  getMeet: getMeet,
  allMeets: allMeets
};
//# sourceMappingURL=Meet.js.map