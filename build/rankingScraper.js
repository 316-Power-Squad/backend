'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _db = require('./helpers/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var specialCases = new _map2.default([['Miami (Ohio)', 'Miami OH'], ['Boston University', 'Boston U'], ['Dartmouth', 'Dartmouth College'], ['Manhattan', 'Manhattan College'], ['Ole Miss', 'Mississippi'], ['UT Martin', 'Tennessee Martin'], ['ETSU', 'East Tenn St'], ['Louisiana-Lafayette', 'UL Lafayette'], ['NC State', 'North Carolina St'], ['Middle Tennessee', 'Mid Tenn St'], ['Saint Joseph’s', 'St Josephs PA'], ['Ohio State', 'Ohio State University'], ['Maryland', 'Maryland College Park'], ['Loyola-Chicago', 'Loyola University Chicago'], ['Nevada', 'Nevada Las Vegas'], ['Mississippi State', 'Mississippi Valley State'], ['Southern Miss', 'Southern Mississippi'], ['UAB', 'Alabama Birmingham'], ['SMU', 'Southern Methodist'], ['TCU', 'Texas Christian'], ['Texas A&M-Corpus Christi', 'Texas A&M University–Corpus Christi'], ['Stephen F. Austin', 'Stephen F. Austin State'], ['Davidson', 'Davidson College']]);

var dbMode = process.argv[process.argv.length - 1] === 'prod' ? _db.MODE_PRODUCTION : _db.MODE_TEST;

var fetchRankings = function fetchRankings(url, gender) {
  return new _promise2.default(function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(resolve, reject) {
      var response, $, regionName, teamName, counter, regionCount;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return (0, _requestPromise2.default)({ uri: url, resolveWithFullResponse: true });

            case 2:
              response = _context2.sent;

              if (response.statusCode !== 200) reject('Incorrect status');
              $ = _cheerio2.default.load(response.body);
              regionName = '';
              teamName = '';
              counter = 0;
              regionCount = 0;

              $('td').each(function () {
                var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(i, elem) {
                  var team;
                  return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          if (['#f2dddc', '#A6CAFF'].includes($(this).attr('bgcolor'))) {
                            counter = 0;
                            regionCount++;
                            regionName = $(this).text().toLowerCase();
                          }

                          if (!(counter >= 15)) {
                            _context.next = 4;
                            break;
                          }

                          if (regionCount > 8) resolve();
                          return _context.abrupt('return');

                        case 4:
                          if (!($(this).children().first().attr('target') === '_blank')) {
                            _context.next = 17;
                            break;
                          }

                          teamName = $(this).children().first().text();
                          counter++;

                          if (!(regionName !== '' && teamName !== '')) {
                            _context.next = 17;
                            break;
                          }

                          _context.prev = 8;

                          // If there is a naming disparity look it up
                          team = specialCases.has(teamName) ? specialCases.get(teamName) : teamName;
                          _context.next = 12;
                          return insertRank(team, gender, regionName, counter);

                        case 12:
                          _context.next = 17;
                          break;

                        case 14:
                          _context.prev = 14;
                          _context.t0 = _context['catch'](8);

                          reject(_context.t0);

                        case 17:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, this, [[8, 14]]);
                }));

                return function (_x3, _x4) {
                  return _ref2.apply(this, arguments);
                };
              }());

            case 10:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
};

var insertRank = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(team, gender, region, rank) {
    var lastIndex, actualRegion;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            lastIndex = region.lastIndexOf(' ');
            actualRegion = region.substring(0, lastIndex);

            console.log('Inserting a team ' + team + ' with region ' + actualRegion + ' and rank ' + rank);
            // if (gender === 'womens') console.log('womens team inserted');
            return _context3.abrupt('return', new _promise2.default(function (resolve, reject) {
              _db2.default.get().query('INSERT INTO RegionalRank (team_id, region_id, rank) values (\n          ( SELECT id from Team WHERE Team.name=? AND Team.gender=? ), \n          ( SELECT id from Region WHERE Region.name=? ), \n          ?\n        )', [team, gender, actualRegion, rank], function (err) {
                if (err) {
                  console.log(err);
                  reject(err);
                } else resolve();
              });
            }));

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function insertRank(_x5, _x6, _x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}();

// line 5 shouldn't be hardcoded -- in the future it should call a helper message like the following to get the url

var getMostRecentUrls = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            return _context5.abrupt('return', new _promise2.default(function () {
              var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(resolve, reject) {
                var urls, sourceUrl, response, $, allArchivesDiv, paragraphs;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        urls = [];
                        sourceUrl = 'http://www.ustfccca.org/category/rankings-polls/cross-country-polls/div-1-cross-country';
                        _context4.next = 4;
                        return (0, _requestPromise2.default)({
                          uri: sourceUrl,
                          resolveWithFullResponse: true
                        });

                      case 4:
                        response = _context4.sent;

                        if (response.statusCode !== 200) reject('Incorrect status code');
                        $ = _cheerio2.default.load(response.body);
                        allArchivesDiv = $('div[class=facetwp-template]');
                        paragraphs = allArchivesDiv.children();

                        paragraphs.each(function (i, elem) {
                          var link = $(this).children().first();
                          if (link !== undefined) {
                            var url = link.attr('href');
                            if (url !== undefined && url.indexOf('regional') > -1) {
                              urls.push(url);
                            } else if (url !== undefined && url.indexOf('region') > -1) {
                              urls.push(url);
                              resolve(urls);
                            }
                          }
                        });

                      case 10:
                      case 'end':
                        return _context4.stop();
                    }
                  }
                }, _callee4, undefined);
              }));

              return function (_x9, _x10) {
                return _ref5.apply(this, arguments);
              };
            }()));

          case 1:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function getMostRecentUrls() {
    return _ref4.apply(this, arguments);
  };
}();

var insertRankings = function insertRankings(mode) {
  _db2.default.connect(mode, (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6() {
    var urls;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return getMostRecentUrls();

          case 3:
            urls = _context6.sent;
            _context6.next = 6;
            return fetchRankings(urls[1], 'mens');

          case 6:
            _context6.next = 8;
            return fetchRankings(urls[0], 'womens');

          case 8:
            _context6.next = 13;
            break;

          case 10:
            _context6.prev = 10;
            _context6.t0 = _context6['catch'](0);

            console.log(_context6.t0);

          case 13:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined, [[0, 10]]);
  })));
};

insertRankings(dbMode);
//# sourceMappingURL=rankingScraper.js.map