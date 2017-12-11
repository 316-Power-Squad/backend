'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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

router.get('/:id', function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res) {
    var team, meets;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _Team2.default.getTeam(req.params.id);

          case 3:
            team = _context.sent;
            _context.next = 6;
            return _Team2.default.getMeets(req.params.id);

          case 6:
            meets = _context.sent;

            res.send((0, _api.formatResponse)({ team: team, meets: meets }));
            _context.next = 14;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context['catch'](0);

            res.send((0, _api.formatResponse)({}, _context.t0));
            console.log(_context.t0);

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 10]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

exports.default = router;
//# sourceMappingURL=Team.js.map