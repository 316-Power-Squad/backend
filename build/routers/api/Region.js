'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _Region = require('../../models/Region');

var _Region2 = _interopRequireDefault(_Region);

var _api = require('../../helpers/api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();


router.get('/', function (req, res) {
  _Region2.default.allRegions(function (result, err) {
    res.send((0, _api.formatResponse)(result, err));
  });
});

router.get('/:id', function (req, res) {
  _Region2.default.getRegion(req.params.id, function (result, err) {
    res.send((0, _api.formatResponse)(result, err));
  });
});

exports.default = router;
//# sourceMappingURL=Region.js.map