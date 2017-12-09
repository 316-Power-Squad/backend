'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.allRegions = exports.getRegion = undefined;

var _db = require('../../helpers/db');

var _db2 = _interopRequireDefault(_db);

var _errors = require('./errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getRegion = exports.getRegion = function getRegion(id, done) {
  _db2.default.get().query('SELECT * FROM Region WHERE id=?', [id], function (err, rows) {
    if (err) return done({}, err);else if (rows.length === 0) {
      return done({}, _errors.noRegionError);
    }
    done(rows[0]);
  });
};

var allRegions = exports.allRegions = function allRegions(done) {
  _db2.default.get().query('SELECT * FROM Region', function (err, rows) {
    if (err) return done([], err);
    done(rows);
  });
};

exports.default = {
  getRegion: getRegion,
  allRegions: allRegions
};
//# sourceMappingURL=Region.js.map