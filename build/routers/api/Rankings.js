'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _apicache = require('apicache');

var _apicache2 = _interopRequireDefault(_apicache);

var _Ranking = require('../../models/Ranking');

var _Ranking2 = _interopRequireDefault(_Ranking);

var _api = require('../../helpers/api');

var _kolasAlgorithm = require('../../kolasAlgorithm');

var _kolasAlgorithm2 = _interopRequireDefault(_kolasAlgorithm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var cache = _apicache2.default.middleware;

var qualifyTeams = function qualifyTeams(gender) {
  return new _promise2.default(function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
      var regionals, meets, result;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return _Ranking2.default.getRegionals(gender);

            case 3:
              regionals = _context.sent;
              _context.next = 6;
              return _Ranking2.default.getMeets(gender);

            case 6:
              meets = _context.sent;
              _context.next = 9;
              return (0, _kolasAlgorithm2.default)(regionals, meets);

            case 9:
              result = _context.sent;

              resolve(result);
              _context.next = 16;
              break;

            case 13:
              _context.prev = 13;
              _context.t0 = _context['catch'](0);

              reject(_context.t0);

            case 16:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined, [[0, 13]]);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
};

router.get('/clear', function (req, res) {
  _apicache2.default.clear();
  res.json((0, _api.formatResponse)({ clear: true }));
});

// Need to have separate routes as we need to cache the two
// calls separately
router.get('/mens', cache('1 week'), function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(req, res) {
    var result;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return qualifyTeams('mens');

          case 3:
            result = _context2.sent;

            res.json((0, _api.formatResponse)(result));
            _context2.next = 10;
            break;

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2['catch'](0);

            res.json((0, _api.formatResponse)({}, _context2.t0));

          case 10:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 7]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());

router.get('/womens', cache('1 week'), function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(req, res) {
    var result;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return qualifyTeams('womens');

          case 3:
            result = _context3.sent;

            res.json((0, _api.formatResponse)(result));
            _context3.next = 10;
            break;

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3['catch'](0);

            res.json((0, _api.formatResponse)({}, _context3.t0));

          case 10:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[0, 7]]);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());

exports.default = router;
//# sourceMappingURL=Rankings.js.map