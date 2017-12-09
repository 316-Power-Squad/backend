'use strict';

var _schema = require('./helpers/schema');

var _db = require('./helpers/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mode = process.argv[process.argv.length - 1] === 'prod' ? _db.MODE_PRODUCTION : _db.MODE_TEST;

(0, _schema.seed)(mode, function (err) {
  if (err) console.log(err);
  _db2.default.disconnect();
});
//# sourceMappingURL=seed.js.map