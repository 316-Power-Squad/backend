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
  _db2.default.get().query('SELECT * FROM Meet WHERE id=?', [id], function (err, rows) {
    if (err) return done({}, err);else if (rows.length === 0) {
      return done({}, _errors.noMeetError);
    }
    done(rows[0]);
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