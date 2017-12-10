'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _db = require('./helpers/db');

var _db2 = _interopRequireDefault(_db);

var _api = require('./routers/api');

var _api2 = _interopRequireDefault(_api);

var _User = require('./routers/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PORT = process.env.PORT || 5000;

var app = (0, _express2.default)();
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());
app.use((0, _cors2.default)());

// Request logging
app.use((0, _morgan2.default)('dev'));

var mode = process.env.NODE_ENV === 'production' ? _db.MODE_PRODUCTION : _db.MODE_TEST;

// Connect to MySQL on start
_db2.default.connect(mode, function (err) {
  if (err) {
    console.log('Unable to connect to MySQL.');
    process.exit(1);
  } else {
    // namespaced routes
    app.use('/api', _api2.default);
    app.use('/auth', _User2.default);

    // Define the port we are listening on
    app.listen(PORT, function () {
      console.log('Listening on port ' + PORT + '...');
    });
  }
});
//# sourceMappingURL=index.js.map