'use strict';

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _db = require('./helpers/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mode = process.env.NODE_ENV === 'production' ? _db.MODE_PRODUCTION : _db.MODE_TEST;

var urls = [];
// ex. https://www.tfrrs.org/teams/xc/NC_college_m_Duke.html
var teamBaseUrl = 'https://www.tfrrs.org/teams/xc/';

//ex. https://www.tfrrs.org/results/xc/11563.html
var resultBaseUrl = 'https://www.tfrrs.org/results/xc/';

var notTitle = function notTitle(s) {
  if (s == 'Primary Conference' || s == 'Making Transition' || s == 'Full Membership' || s == 'Future Conference') {
    return false;
  }
  if (s == 'Savannah State University' || s == 'California Baptist University' || s == 'North Alabama !University of North Alabama') {
    return false;
  }
  return true;
};

var getAbbrev = function getAbbrev(state) {
  var states = new _map2.default([['Arizona', 'AZ'], ['Alabama', 'AL'], ['Alaska', 'AK'], ['Arizona', 'AZ'], ['Arkansas', 'AR'], ['California', 'CA'], ['Colorado', 'CO'], ['Connecticut', 'CT'], ['Delaware', 'DE'], ['Florida', 'FL'], ['Georgia', 'GA'], ['Hawaii', 'HI'], ['Idaho', 'ID'], ['Illinois', 'IL'], ['Indiana', 'IN'], ['Iowa', 'IA'], ['Kansas', 'KS'], ['Kentucky', 'KY'], ['Kentucky', 'KY'], ['Louisiana', 'LA'], ['Maine', 'ME'], ['Maryland', 'MD'], ['Massachusetts', 'MA'], ['Michigan', 'MI'], ['Minnesota', 'MN'], ['Mississippi', 'MS'], ['Missouri', 'MO'], ['Montana', 'MT'], ['Nebraska', 'NE'], ['Nevada', 'NV'], ['New Hampshire', 'NH'], ['New Jersey', 'NJ'], ['New Mexico', 'NM'], ['New York', 'NY'], ['North Carolina', 'NC'], ['North Dakota', 'ND'], ['Ohio', 'OH'], ['Oklahoma', 'OK'], ['Oregon', 'OR'], ['Pennsylvania', 'PA'], ['Rhode Island', 'RI'], ['South Carolina', 'SC'], ['South Dakota', 'SD'], ['Tennessee', 'TN'], ['Texas', 'TX'], ['Utah', 'UT'], ['Vermont', 'VT'], ['Virginia', 'VA'], ['Washington', 'WA'], ['District of Columbia', 'DC'], ['West Virginia', 'WV'], ['Wisconsin', 'WI'], ['Wyoming', 'WY']]);
  var answer = states.get(state);
  return answer ? answer : '';
};

var getCalifornia = function getCalifornia(school) {
  var splitSchool = school.split(' ');
  var usableWords = [];
  for (var i = 0; i < splitSchool.length; i++) {
    if (splitSchool[i].includes('!')) {
      break;
    } else {
      usableWords.push(splitSchool[i]);
    }
  }
  if (school.includes('Los Angeles')) {
    return 'UCLA';
  }
  if (school.includes('Berkeley')) {
    return 'California';
  }
  if (school.includes('University of California')) {
    usableWords[0] = 'UC';
    return usableWords.join('_');
  }
  if (school.includes('California State University')) {
    if (splitSchool[splitSchool.length - 1] == 'Fresno' || splitSchool[splitSchool.length - 1] == 'Sacramento' || splitSchool[splitSchool.length - 1] == 'Long Beach') {
      return splitSchool[splitSchool.length - 1].concat('_State');
    } else {
      return 'Cal_St_'.concat(splitSchool[splitSchool.length - 1]);
    }
  }
};

var getNC = function getNC(school) {
  var splitSchool = school.split(' ');
  if (school.includes('Chapel Hill')) {
    return 'North Carolina';
  } else if (school.includes('Charlotte')) {
    return 'Charlotte';
  } else {
    return 'UNC_'.concat(splitSchool[2]);
  }
};

var getWisco = function getWisco(school) {
  var splitSchool = school.split(' ');
  if (school.includes('Madison')) {
    return 'Wisconsin';
  } else {
    return 'Wis_'.concat(splitSchool[1]);
  }
};

var getTexas = function getTexas(school) {
  var splitSchool = school.split(' ');
  var usableWords = [];
  for (var i = 0; i < splitSchool.length; i++) {
    if (splitSchool[i].includes('!')) {
      break;
    } else {
      usableWords.push(splitSchool[i]);
    }
  }
  if (school.includes('Austin')) {
    return 'Texas';
  } else if (school.includes('El Paso')) {
    return 'UTEP';
  } else {
    return 'UT_'.concat(usableWords.splice(1, usableWords.length - 1).join('_'));
  }
};

var getTeamName = function getTeamName(school) {
  var usableWords = [];
  var splitSchool = school.split(' ');
  if (school == 'Boston University') {
    return 'Boston_U';
  }
  if (school.includes('Brigham Young')) {
    return 'BYU';
  }
  if (school.includes('California State University') || school.includes('University of California')) {
    return getCalifornia(school);
  }
  if (school.includes('California Polytechnic')) {
    return 'Cal_Poly';
  }
  if (school.includes('University of North Carolina')) {
    return getNC(school);
  }
  if (school.includes('University of Wisconsin')) {
    return getWisco(school);
  }
  if (school.includes('University of Texas')) {
    return getTexas(school);
  }
  if (splitSchool[0] == 'Pennsylvania') {
    splitSchool[0] = 'Penn';
  }
  if (school == 'University of Mississippi') {
    return 'Ole_Miss';
  }
  if (school == 'Mississippi State University') {
    return 'Miss_State';
  }
  if (school == 'Colorado Boulder !University of Colorado Boulder') {
    return 'Colorado';
  }
  if (school.includes('Virginia Tech')) {
    return 'Virginia_Tech';
  }
  if (school.includes('East Tennessee State University')) {
    return 'East_Tenn_St';
  }
  if (school.includes('Providence College')) {
    return 'Providence';
  }
  if (school.includes('Iona College')) {
    return 'Iona';
  }
  if (school.includes('Army')) {
    return 'Army_West_Point';
  }
  if (school.includes('Indiana University Purdue University Indianapolis')) {
    return 'IUPUI';
  }
  if (school.includes('Bowling Green')) {
    return 'Bowling_Green';
  }
  if (school.includes('Miami University')) {
    return 'Miami_OH';
  }
  if (school.includes('Ohio University')) {
    return 'Ohio';
  }
  if (school.includes('Bloomington')) {
    return 'Indiana';
  }
  if (school.includes('University–Stillwater')) {
    return 'Oklahoma_State';
  }
  if (school.includes('Urbana')) {
    return 'Illinois';
  }
  if (school.includes('Lincoln')) {
    return 'Nebraska';
  }
  if (school.includes('Kansas City')) {
    return 'UMKC';
  }
  if (school.includes('Lowell')) {
    return 'UMass_Lowell';
  }
  if (school.includes('Middle Tennessee')) {
    return 'Mid_Tenn_State';
  }
  if (school.includes('Georgia Institute of Technology')) {
    return 'Georgia_Tech';
  }
  if (school.includes('University of Louisiana at Lafayette')) {
    return 'UL_Lafayette';
  }
  if (school.includes('Louisiana State University')) {
    return 'LSU';
  }
  if (school.includes('Charlotte')) {
    return 'Charlotte';
  }
  if (school.includes('Saint Joseph\'s University')) {
    return 'St_Josephs_PA';
  }
  for (var i = 0; i < splitSchool.length; i++) {
    if (splitSchool[i].includes('!')) {
      return usableWords.join('_');
    } else {
      usableWords.push(splitSchool[i]);
    }
  }
  if (usableWords[usableWords.length - 1] == 'University') {
    usableWords[usableWords.length - 1] = '';
    usableWords = usableWords.splice(0, usableWords.length - 1);
    return usableWords.join('_');
  }
  return school;
};

var getSchoolNames = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', new _promise2.default(function (resolve, reject) {
              var names = [];
              var count = 0;
              (0, _request2.default)('https://en.wikipedia.org/wiki/List_of_NCAA_Division_I_institutions', function (err, resp, body) {
                if (!err && resp.statusCode == 200) {
                  var $ = _cheerio2.default.load(body);
                  var count = 0;
                  $('tr', '.sortable').each(function () {
                    var row = $(this).text().split('\n');
                    var data = [getTeamName(row[1]).split(' ').join('_'), getAbbrev(row[4])];
                    names.push(data);
                    var splitData = data[0].split('_');
                    if (splitData[splitData.length - 1] == 'State') {
                      splitData[splitData.length - 1] = 'St';
                      names.push([splitData.join('_'), getAbbrev(row[4])]);
                    }
                    count++;
                  });
                  resolve(names);
                } else {
                  console.log(resp.statusCode);
                  reject(err);
                }
              });
            }));

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function getSchoolNames() {
    return _ref.apply(this, arguments);
  };
}();

var parseDate = function parseDate(date) {
  return new Date(date);
};

var earliestDate = parseDate('09/08/2017');

var delay = function delay(ms) {
  return new _promise2.default(function (resolve) {
    return setTimeout(resolve, ms);
  });
};

var sleep = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log('Taking a break...');
            _context2.next = 3;
            return delay((Math.random() * 5 + 1) * 1000);

          case 3:
            console.log('Two second later');

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function sleep() {
    return _ref2.apply(this, arguments);
  };
}();

var parseMonth = function parseMonth(month) {
  if (month == 'Jan') {
    return '1';
  }
  if (month == 'Feb') {
    return '2';
  }
  if (month == 'Mar') {
    return '3';
  }
  if (month == 'Apr') {
    return '4';
  }
  if (month == 'May') {
    return '5';
  }
  if (month == 'Jun') {
    return '6';
  }
  if (month == 'Jul') {
    return '7';
  }
  if (month == 'Aug') {
    return '8';
  }
  if (month == 'Sep') {
    return '9';
  }
  if (month == 'Oct') {
    return '10';
  }
  if (month == 'Nov') {
    return '11';
  }
  if (month == 'Dec') {
    return '12';
  }
};

var formatDate = function formatDate(date) {
  if (date == '#' || date.split(' ').length != 3 || date.includes('-')) {
    return '01/01/2000';
  }
  var parts = date.split(' ');
  parts[0] = parseMonth(parts[0]);
  parts[1] = parts[1].replace(',', '');
  var result = parts.join('/');
  return result;
};

var fetchMeets = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(url) {
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt('return', new _promise2.default(function (resolve, reject) {
              if (url.endsWith('Northwestern')) {
                url = url.replace('Northwestern', 'Northwestern_IL');
              } else if (url.endsWith('California')) {
                url = url.replace('California', 'California_CA');
              } else if (url.endsWith('Ohio')) {
                url = url.replace('Ohio', 'Ohio_U');
              } else if (url.toLowerCase().includes('in_college_f_indiana')) {
                url = url.toLowerCase().replace('in_college_f_indiana', 'IN_college_f_Indiana_IN');
              } else if (url.endsWith('Miami')) {
                url = url.replace('Miami', 'Miami_FL');
              } else if (url.endsWith('William_and_Mary')) {
                url.replace('William_and_Mary', 'William__Mary');
              } else if (url.includes('Joseph')) {
                url.replace('Saint_Joseph\'s', 'St_Josephs_PA');
              } else if (url.includes('Manhattan_College')) {
                url = url.replace('Manhattan College', 'Manhattan');
              }
              if (url.includes('Notre_Dame')) {
                url = url.replace('Notre_Dame_IN');
              }
              if (url.endsWith('Georgetown')) {
                url = url.replace('Georgetown', 'Georgetown_DC');
              }
              var meets = new _map2.default();
              var meetDates = new _map2.default();
              var finalRegion = '';
              (0, _request2.default)(url, function () {
                var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(err, resp, body) {
                  var splitUrl, team, $;
                  return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          splitUrl = url.split('_');
                          team = splitUrl.splice(3, splitUrl.length).join('_');

                          if (!err && resp.statusCode == 200 && team) {
                            $ = _cheerio2.default.load(body);

                            $('a', 'span.panel-heading-normal-text').each(function () {
                              var splitRegion = $(this).text().split(' ');
                              var region = splitRegion.splice(1, splitRegion.length).join(' ');
                              if (splitRegion.includes('DI')) {
                                finalRegion = region.toLowerCase();
                              }
                            });
                            $('tr').each(function () {
                              var row = $(this).text().split('\n');
                              var date = parseDate(formatDate(row[1]));
                              if (!date) {} else if (date.getTime() >= earliestDate.getTime()) {
                                var meetName = row[3];
                                var meetUrl = $(this).find('a').attr('href').replace('//', '');
                                if (meetUrl.includes('www')) {
                                  meets.set(meetName, 'https://'.concat(meetUrl));
                                  meetDates.set(meetName, formatDate(row[1]).split('/').join('-'));
                                }
                              }
                            });
                          }
                          resolve({
                            dates: meetDates,
                            meets: meets,
                            region: finalRegion
                          });

                        case 4:
                        case 'end':
                          return _context3.stop();
                      }
                    }
                  }, _callee3, undefined);
                }));

                return function (_x2, _x3, _x4) {
                  return _ref4.apply(this, arguments);
                };
              }());
            }));

          case 1:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function fetchMeets(_x) {
    return _ref3.apply(this, arguments);
  };
}();

var joinLists = function joinLists(list1, list2) {
  for (var i = 0; i < list2.length; i++) {
    if (!list1.includes(list2[i])) {
      list1.push(list2[i]);
    }
  }
  return list1;
};

var convertTime = function convertTime(time) {
  var splitTime = time.split(':');
  var minutes = parseInt(splitTime[0]) * 60;
  var seconds = parseInt(splitTime[1]);
  return minutes + seconds;
};

var populateTeams = function populateTeams(t) {
  var teamNames = [];
  for (var i = 0; i < t.length; i++) {
    teamNames.push(t[i][0]);
  }
  return teamNames;
};

var getResults = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
    var teams, teamNames, meets, meetDates, i, region, url, newMeets;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return getSchoolNames();

          case 2:
            teams = _context5.sent;
            teamNames = populateTeams(teams);
            meets = new _map2.default();
            meetDates = new _map2.default();
            i = 0;

          case 7:
            if (!(i < teams.length)) {
              _context5.next = 39;
              break;
            }

            region = '';

            if (!(teams[i][0] === 'School')) {
              _context5.next = 11;
              break;
            }

            return _context5.abrupt('continue', 36);

          case 11:
            url = teamBaseUrl.concat(teams[i][1]).concat('_college_m_').concat(teams[i][0]);
            _context5.next = 14;
            return fetchMeets(url);

          case 14:
            newMeets = _context5.sent;

            meets = new _map2.default([].concat((0, _toConsumableArray3.default)(meets), (0, _toConsumableArray3.default)(newMeets.meets)));
            meetDates = new _map2.default([].concat((0, _toConsumableArray3.default)(meetDates), (0, _toConsumableArray3.default)(newMeets.dates)));
            region = newMeets.region;
            url = teamBaseUrl.concat(teams[i][1]).concat('_college_f_').concat(teams[i][0]);
            _context5.next = 21;
            return fetchMeets(url);

          case 21:
            newMeets = _context5.sent;

            meets = new _map2.default([].concat((0, _toConsumableArray3.default)(meets), (0, _toConsumableArray3.default)(newMeets.meets)));
            meetDates = new _map2.default([].concat((0, _toConsumableArray3.default)(meetDates), (0, _toConsumableArray3.default)(newMeets.dates)));
            region = region ? region : newMeets.region;
            _context5.prev = 25;
            _context5.next = 28;
            return insertTeam(teams[i][0], 'mens', region);

          case 28:
            _context5.next = 30;
            return insertTeam(teams[i][0], 'womens', region);

          case 30:
            _context5.next = 36;
            break;

          case 32:
            _context5.prev = 32;
            _context5.t0 = _context5['catch'](25);

            console.log(_context5.t0);
            console.log('Error inserting team ' + teams[i][0]);

          case 36:
            i++;
            _context5.next = 7;
            break;

          case 39:
            return _context5.abrupt('return', [meets, meetDates]);

          case 40:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined, [[25, 32]]);
  }));

  return function getResults() {
    return _ref5.apply(this, arguments);
  };
}();

var scrapeResult = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(meetUrl, meetName) {
    var teams, teamNames;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return getSchoolNames();

          case 2:
            teams = _context6.sent;
            teamNames = populateTeams(teams);
            return _context6.abrupt('return', new _promise2.default(function (resolve, reject) {
              (0, _request2.default)(meetUrl, function (err, resp, body) {
                var results = new _map2.default();
                var count = 0;
                if (!err && resp.statusCode == 200) {
                  var $ = _cheerio2.default.load(body);
                  var mens = new _map2.default();
                  var womens = new _map2.default();
                  results.set(meetName, [mens, womens]);
                  $('tr').each(function () {
                    var data = $(this);
                    var row = data.text().split('\n');
                    if (row.length == 40) {
                      count++;
                    }
                    var link = data.find('a').attr('href');
                    if (count <= 11000) {
                      try {
                        var rank = parseInt(row[2]);
                        var school = row[5].trim().split(' ').join('_').split('.').join('');
                        count++;
                        if (teamNames.includes(school)) {
                          if (link.toLowerCase().includes('_f_')) {
                            results.get(meetName)[1].set(school, rank);
                          } else if (link.toLowerCase().includes('_m_')) {
                            results.get(meetName)[0].set(school, rank);
                          }
                        }
                      } catch (error) {}
                    }
                  });
                }
                resolve(results);
              });
            }));

          case 5:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function scrapeResult(_x5, _x6) {
    return _ref6.apply(this, arguments);
  };
}();

var insertRegions = function () {
  var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(region) {
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            console.log('Inserting Regions');
            return _context7.abrupt('return', new _promise2.default(function (resolve, reject) {
              _db2.default.get().query('INSERT INTO Region (name) values\n      (\'northeast\'),\n      (\'mid-atlantic\'),\n      (\'southeast\'),\n      (\'south\'),\n      (\'south central\'),\n      (\'great lakes\'),\n      (\'midwest\'),\n      (\'mountain\'),\n      (\'west\'),\n      (\'N/A\')\n    ', [], function (err) {
                if (err) reject(err);else resolve();
              });
            }));

          case 2:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  }));

  return function insertRegions(_x7) {
    return _ref7.apply(this, arguments);
  };
}();

var insertMeet = function () {
  var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(name, date) {
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            console.log('Inserting a meet ' + name);
            return _context8.abrupt('return', new _promise2.default(function (resolve, reject) {
              _db2.default.get().query('INSERT INTO Meet (name, date) values (?, ?)', [name, date], function (err) {
                if (err) reject(err);else resolve();
              });
            }));

          case 2:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  }));

  return function insertMeet(_x8, _x9) {
    return _ref8.apply(this, arguments);
  };
}();

var insertTeam = function () {
  var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(name, gender, region) {
    var lastIndex, actualRegion, team;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            lastIndex = region.lastIndexOf(' ');
            actualRegion = region.substring(0, lastIndex);

            if (!actualRegion) {
              actualRegion = 'N/A';
            }
            team = name.replace(/_/g, ' ');

            console.log('Inserting a team ' + team + ' with region ' + region);
            return _context9.abrupt('return', new _promise2.default(function (resolve, reject) {
              _db2.default.get().query('INSERT INTO Team (name, gender, region_id) values (?, ?, (\n          SELECT id from Region WHERE Region.name=?\n        ))', [team, gender, actualRegion], function (err) {
                if (err) reject(err);else resolve();
              });
            }));

          case 6:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, undefined);
  }));

  return function insertTeam(_x10, _x11, _x12) {
    return _ref9.apply(this, arguments);
  };
}();

var insertParticipates = function () {
  var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(meet, team, gender, place) {
    var teamName;
    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            console.log('Inserting a participates record ' + meet + ', ' + team + ', ' + gender + ', ' + place);
            teamName = team.replace(/_/g, ' ');
            return _context10.abrupt('return', new _promise2.default(function (resolve, reject) {
              var query = 'INSERT INTO Participates (team_id, meet_id, placement) values (\n      (SELECT ID FROM Team WHERE name=? and gender=?),\n      (SELECT ID FROM Meet WHERE name=?),\n      ?\n    )';
              _db2.default.get().query(query, [teamName, gender, meet, place], function (err, result) {
                if (err) reject(err);else resolve();
              });
            }));

          case 3:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, undefined);
  }));

  return function insertParticipates(_x13, _x14, _x15, _x16) {
    return _ref10.apply(this, arguments);
  };
}();

var mapResults = function () {
  var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12() {
    return _regenerator2.default.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            return _context12.abrupt('return', new _promise2.default(function () {
              var _ref12 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(resolve, reject) {
                var results, meetData, meets, meetDates, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step$value, meetName, meetUrl, newResult;

                return _regenerator2.default.wrap(function _callee11$(_context11) {
                  while (1) {
                    switch (_context11.prev = _context11.next) {
                      case 0:
                        results = new _map2.default();
                        _context11.next = 3;
                        return getResults();

                      case 3:
                        meetData = _context11.sent;
                        meets = meetData[0];
                        meetDates = meetData[1];
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context11.prev = 9;
                        _iterator = (0, _getIterator3.default)(meets);

                      case 11:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                          _context11.next = 30;
                          break;
                        }

                        _step$value = (0, _slicedToArray3.default)(_step.value, 2), meetName = _step$value[0], meetUrl = _step$value[1];
                        _context11.prev = 13;
                        _context11.next = 16;
                        return insertMeet(meetName, meetDates.get(meetName));

                      case 16:
                        _context11.next = 21;
                        break;

                      case 18:
                        _context11.prev = 18;
                        _context11.t0 = _context11['catch'](13);

                        console.log('Error inserting meet', _context11.t0);

                      case 21:
                        console.log('Scraping ', meetUrl);
                        _context11.next = 24;
                        return scrapeResult(meetUrl, meetName);

                      case 24:
                        newResult = _context11.sent;

                        results = new _map2.default([].concat((0, _toConsumableArray3.default)(results), (0, _toConsumableArray3.default)(newResult)));
                        console.log(results);

                      case 27:
                        _iteratorNormalCompletion = true;
                        _context11.next = 11;
                        break;

                      case 30:
                        _context11.next = 36;
                        break;

                      case 32:
                        _context11.prev = 32;
                        _context11.t1 = _context11['catch'](9);
                        _didIteratorError = true;
                        _iteratorError = _context11.t1;

                      case 36:
                        _context11.prev = 36;
                        _context11.prev = 37;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                          _iterator.return();
                        }

                      case 39:
                        _context11.prev = 39;

                        if (!_didIteratorError) {
                          _context11.next = 42;
                          break;
                        }

                        throw _iteratorError;

                      case 42:
                        return _context11.finish(39);

                      case 43:
                        return _context11.finish(36);

                      case 44:
                        resolve(results);

                      case 45:
                      case 'end':
                        return _context11.stop();
                    }
                  }
                }, _callee11, undefined, [[9, 32, 36, 44], [13, 18], [37,, 39, 43]]);
              }));

              return function (_x17, _x18) {
                return _ref12.apply(this, arguments);
              };
            }()));

          case 1:
          case 'end':
            return _context12.stop();
        }
      }
    }, _callee12, undefined);
  }));

  return function mapResults() {
    return _ref11.apply(this, arguments);
  };
}();

var insertResults = function () {
  var _ref13 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee14() {
    return _regenerator2.default.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            return _context14.abrupt('return', new _promise2.default(function () {
              var _ref14 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee13(resolve, reject) {
                var results, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, meet, r, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, mensTeam, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, womensTeam;

                return _regenerator2.default.wrap(function _callee13$(_context13) {
                  while (1) {
                    switch (_context13.prev = _context13.next) {
                      case 0:
                        _context13.next = 2;
                        return insertRegions();

                      case 2:
                        _context13.next = 4;
                        return mapResults();

                      case 4:
                        results = _context13.sent;

                        //console.log(results);
                        _iteratorNormalCompletion2 = true;
                        _didIteratorError2 = false;
                        _iteratorError2 = undefined;
                        _context13.prev = 8;
                        _iterator2 = (0, _getIterator3.default)(results.keys());

                      case 10:
                        if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                          _context13.next = 81;
                          break;
                        }

                        meet = _step2.value;
                        r = results.get(meet);

                        console.log(meet);
                        _iteratorNormalCompletion3 = true;
                        _didIteratorError3 = false;
                        _iteratorError3 = undefined;
                        _context13.prev = 17;
                        _iterator3 = (0, _getIterator3.default)(r[0].keys());

                      case 19:
                        if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                          _context13.next = 32;
                          break;
                        }

                        mensTeam = _step3.value;
                        _context13.prev = 21;
                        _context13.next = 24;
                        return insertParticipates(meet, mensTeam, 'mens', r[0].get(mensTeam));

                      case 24:
                        _context13.next = 29;
                        break;

                      case 26:
                        _context13.prev = 26;
                        _context13.t0 = _context13['catch'](21);

                        console.log('Error inserting men\'s participation', _context13.t0);

                      case 29:
                        _iteratorNormalCompletion3 = true;
                        _context13.next = 19;
                        break;

                      case 32:
                        _context13.next = 38;
                        break;

                      case 34:
                        _context13.prev = 34;
                        _context13.t1 = _context13['catch'](17);
                        _didIteratorError3 = true;
                        _iteratorError3 = _context13.t1;

                      case 38:
                        _context13.prev = 38;
                        _context13.prev = 39;

                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                          _iterator3.return();
                        }

                      case 41:
                        _context13.prev = 41;

                        if (!_didIteratorError3) {
                          _context13.next = 44;
                          break;
                        }

                        throw _iteratorError3;

                      case 44:
                        return _context13.finish(41);

                      case 45:
                        return _context13.finish(38);

                      case 46:
                        _iteratorNormalCompletion4 = true;
                        _didIteratorError4 = false;
                        _iteratorError4 = undefined;
                        _context13.prev = 49;
                        _iterator4 = (0, _getIterator3.default)(r[1].keys());

                      case 51:
                        if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                          _context13.next = 64;
                          break;
                        }

                        womensTeam = _step4.value;
                        _context13.prev = 53;
                        _context13.next = 56;
                        return insertParticipates(meet, womensTeam, 'womens', r[1].get(womensTeam));

                      case 56:
                        _context13.next = 61;
                        break;

                      case 58:
                        _context13.prev = 58;
                        _context13.t2 = _context13['catch'](53);

                        console.log('Error inserting women\'s participation', _context13.t2);

                      case 61:
                        _iteratorNormalCompletion4 = true;
                        _context13.next = 51;
                        break;

                      case 64:
                        _context13.next = 70;
                        break;

                      case 66:
                        _context13.prev = 66;
                        _context13.t3 = _context13['catch'](49);
                        _didIteratorError4 = true;
                        _iteratorError4 = _context13.t3;

                      case 70:
                        _context13.prev = 70;
                        _context13.prev = 71;

                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                          _iterator4.return();
                        }

                      case 73:
                        _context13.prev = 73;

                        if (!_didIteratorError4) {
                          _context13.next = 76;
                          break;
                        }

                        throw _iteratorError4;

                      case 76:
                        return _context13.finish(73);

                      case 77:
                        return _context13.finish(70);

                      case 78:
                        _iteratorNormalCompletion2 = true;
                        _context13.next = 10;
                        break;

                      case 81:
                        _context13.next = 87;
                        break;

                      case 83:
                        _context13.prev = 83;
                        _context13.t4 = _context13['catch'](8);
                        _didIteratorError2 = true;
                        _iteratorError2 = _context13.t4;

                      case 87:
                        _context13.prev = 87;
                        _context13.prev = 88;

                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                          _iterator2.return();
                        }

                      case 90:
                        _context13.prev = 90;

                        if (!_didIteratorError2) {
                          _context13.next = 93;
                          break;
                        }

                        throw _iteratorError2;

                      case 93:
                        return _context13.finish(90);

                      case 94:
                        return _context13.finish(87);

                      case 95:
                        resolve();

                      case 96:
                      case 'end':
                        return _context13.stop();
                    }
                  }
                }, _callee13, undefined, [[8, 83, 87, 95], [17, 34, 38, 46], [21, 26], [39,, 41, 45], [49, 66, 70, 78], [53, 58], [71,, 73, 77], [88,, 90, 94]]);
              }));

              return function (_x19, _x20) {
                return _ref14.apply(this, arguments);
              };
            }()));

          case 1:
          case 'end':
            return _context14.stop();
        }
      }
    }, _callee14, undefined);
  }));

  return function insertResults() {
    return _ref13.apply(this, arguments);
  };
}();

_db2.default.connect(mode, (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee15() {
  return _regenerator2.default.wrap(function _callee15$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.next = 2;
          return insertResults();

        case 2:
          _db2.default.disconnect();

        case 3:
        case 'end':
          return _context15.stop();
      }
    }
  }, _callee15, undefined);
})));
//# sourceMappingURL=scraper.js.map