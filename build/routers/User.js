'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _api = require('../helpers/api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();


router.post('/new', function (req, res) {
  // create a new team
  var _req$body = req.body,
      name = _req$body.name,
      email = _req$body.email,
      password = _req$body.password;

  _User2.default.newUser(name, email, password, function (result, err) {
    res.send((0, _api.formatResponse)(result, err));
  });
});

router.post('/login', function (req, res) {
  var _req$body2 = req.body,
      email = _req$body2.email,
      password = _req$body2.password;

  _User2.default.validateUser(email, password, function (result, err) {
    res.send((0, _api.formatResponse)(result, err));
  });
});

exports.default = router;
//# sourceMappingURL=User.js.map