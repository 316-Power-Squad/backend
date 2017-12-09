'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Team = require('./Team');

var _Team2 = _interopRequireDefault(_Team);

var _Meet = require('./Meet');

var _Meet2 = _interopRequireDefault(_Meet);

var _Region = require('./Region');

var _Region2 = _interopRequireDefault(_Region);

var _Rankings = require('./Rankings');

var _Rankings2 = _interopRequireDefault(_Rankings);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _errors = require('../../helpers/errors');

var _api = require('../../helpers/api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// route middleware to verify a token
router.use(function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    _jsonwebtoken2.default.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        res.send((0, _api.formatResponse)({}, _errors.jwtAuthError));
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send((0, _api.formatResponse)({}, _errors.jwtNotProvidedError));
  }
});

router.use('/teams', _Team2.default);
router.use('/meets', _Meet2.default);
router.use('/regions', _Region2.default);
router.use('/rankings', _Rankings2.default);

exports.default = router;
//# sourceMappingURL=index.js.map