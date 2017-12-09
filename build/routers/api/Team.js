'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _Team = require('../../models/Team');

var _Team2 = _interopRequireDefault(_Team);

var _api = require('../../helpers/api');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router(); /**
                                          * Team controller - handles all the api routes that deal with teams
                                          */


router.get('/', function (req, res) {
  _Team2.default.allTeams(function (result, err) {
    res.send((0, _api.formatResponse)(result, err));
  });
});

router.post('/new', function (req, res) {
  // create a new team
  var _req$body = req.body,
      name = _req$body.name,
      gender = _req$body.gender,
      region = _req$body.region;

  _Team2.default.newTeam(name, gender, region, function (result, err) {
    res.send((0, _api.formatResponse)(result, err));
  });
});

router.get('/:id', function (req, res) {
  _Team2.default.getTeam(req.params.id, function (result, err) {
    res.send((0, _api.formatResponse)(result, err));
  });
});

exports.default = router;
//# sourceMappingURL=Team.js.map