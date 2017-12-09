'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newTeam = exports.allTeams = exports.getTeam = undefined;

var _db = require('../../helpers/db');

var _db2 = _interopRequireDefault(_db);

var _errors = require('./errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getTeam = exports.getTeam = function getTeam(id, done) {
  _db2.default.get().query('\n    SELECT Participates.meet_id, Participates.placement, Meet.name as meet, Meet.date\n    FROM Participates, Meet \n    WHERE Participates.team_id=?\n      AND Meet.id = Participates.meet_id \n    ORDER BY Meet.id DESC \n    LIMIT 10\n  ', [id], function (err, rows) {
    if (err) return done({}, _db.sqlError);else if (rows.length === 0) {
      return done({}, _errors.noTeamError);
    }
    done(rows);
  });
}; /**
    * Example model for querying the teams
    */
var allTeams = exports.allTeams = function allTeams(done) {
  _db2.default.get().query('SELECT * FROM Team', function (err, rows) {
    if (err) return done([], _db.sqlError);
    done(rows);
  });
};

var newTeam = exports.newTeam = function newTeam(name, gender, region, done) {
  if (name.length < 2 || !['mens', 'womens'].includes(gender)) {
    done([], _errors.nameError);
  } else {
    _db2.default.get().query('INSERT INTO Team (name, gender, region) VALUES (?, ?, ?)', [name, gender, region], function (err, result) {
      if (err) return done([], _db.sqlError);
      done({
        id: result.insertId
      });
    });
  }
};

exports.default = {
  getTeam: getTeam,
  allTeams: allTeams,
  newTeam: newTeam
};
//# sourceMappingURL=Team.js.map