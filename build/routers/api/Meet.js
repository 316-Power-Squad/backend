'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _Meet = require('../../models/Meet');

var _Meet2 = _interopRequireDefault(_Meet);

var _api = require('../../helpers/api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();


router.get('/', function (req, res) {
  _Meet2.default.allMeets(function (result, err) {
    res.send((0, _api.formatResponse)(result, err));
  });
});

router.get('/:id', function (req, res) {
  _Meet2.default.getMeet(req.params.id, function (result, err) {
    res.send((0, _api.formatResponse)(result, err));
  });
});

exports.default = router;
//# sourceMappingURL=Meet.js.map