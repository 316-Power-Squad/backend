'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TEST = process.argv[process.argv.length - 1] === 'test';

var testRegionals = {
  great_lakes: ['Michigan', 'Michigan State', 'Wisconsin', 'Eastern Michigan', 'Indiana', 'Notre Dame', 'Ohio State', 'Dayton', 'Toledo', 'Purdue', 'Miami (Ohio)', 'Marquette', 'Indiana State', 'Xavier  (Ohio)', 'Oakland'], // PROJECTED
  mid_atlantic: ['Penn State', 'Villanova', 'Georgetown', 'Princeton', 'Pittsburgh', 'Penn', 'West Virginia', 'Bucknell', 'Maryland', 'Temple', 'Duquesne', 'Navy', 'St. Josephs', 'Lehigh', 'American'], // PROJECTED
  midwest: ['Iowa State', 'Oklahoma State', 'Minnesota', 'Missouri', 'South Dakota', 'Bradley', 'Northern Iowa', 'Tulsa', 'Northwestern', 'Kansas', 'Northern Illinois', 'Iowa', 'Oklahoma', 'Creighton', 'South Dakota St.'], // PROJECTEDx
  mountain: ['Colorado', 'New Mexico', 'BYU', 'Utah State', 'Utah', 'Air Force', 'Colorado St.', 'Northern Arizona', 'Nevada', 'Montana State', 'Weber State', 'Idaho State', 'Utah Valley', 'UTEP', 'Wyoming'], // PROJECTED
  northeast: ['Providence', 'Dartmouth', 'Syracuse', 'Columbia', 'Yale', 'Iona', 'Brown', 'Cornell', 'New Hampshire', 'Buffalo', 'Marist', 'Harvard', 'UMass Lowell', 'Boston College', 'UMass Amherst'], // PROJECTED
  south: ['Ole Miss', 'Georgia', 'Samford', 'Florida State', 'Georgia Tech', 'Auburn', 'Miss State', 'Vanderbilt', 'Alabama', 'Tennessee', 'Jacksonville', 'Southern Miss.', 'North Florida', 'Belmont', 'UAB'], // PROJECTED
  south_central: ['Arkansas', 'Texas', 'Baylor', 'SMU', 'Abilene Christian', 'Texas A&M', 'TCU', 'Tulane', 'North Texas', 'Lamar', 'Rice', 'McNeese State', 'Texas State', 'LSU', 'Arkansas State'], // PROJECTED
  southeast: ['North Carolina St.', 'Furman', 'Eastern Kentucky', 'Virginia Tech', 'Louisville', 'Wake Forest', 'Virginia', 'Richmond', 'Davidson', 'Duke', 'Kentucky', 'James Madison', 'North Carolina', 'Charlotte', 'Elon'], // PROJECTED
  west: ['San Francisco', 'Stanford', 'Oregon', 'Boise State', 'California', 'Washington', 'Arizona', 'San Jose St.', 'Arizona State', 'Portland', 'Loyola Marymount', 'UCLA', 'Oregon State', 'Idaho', 'Washington St.'] // PROJECTED
};

var testMeets = {
  harry_groves_bucknell_v_georgetown: ['2017-09-08', ['Georgetown', 'Bucknell']],
  harry_groves_bucknell_v_penn_state: ['2017-09-08', ['Penn State', 'Bucknell']],
  harry_groves_bucknell_v_pitt: ['2017-09-08', ['Pittsburgh', 'Bucknell']],
  harry_groves_bucknell_v_syracuse: ['2017-09-08', ['Syracuse', 'Bucknell']],
  harry_groves_bucknell_v_west_virginia: ['2017-09-08', ['Bucknell', 'West Virginia']],
  harry_groves_georgetown_v_penn_state: ['2017-09-08', ['Penn State', 'Georgetown']],
  harry_groves_georgetown_v_pitt: ['2017-09-08', ['Georgetown', 'Pittsburgh']],
  harry_groves_georgetown_v_syracuse: ['2017-09-08', ['Georgetown', 'Syracuse']],
  harry_groves_georgetown_v_west_virginia: ['2017-09-08', ['Georgetown', 'West Virginia']],
  harry_groves_penn_state_v_pitt: ['2017-09-08', ['Penn State', 'Pittsburgh']],
  harry_groves_penn_state_v_syracuse: ['2017-09-08', ['Penn State', 'Syracuse']],
  harry_groves_penn_state_v_west_virginia: ['2017-09-08', ['Penn State', 'West Virginia']],
  harry_groves_pitt_v_syracuse: ['2017-09-08', ['Syracuse', 'Pittsburgh']],
  harry_groves_pitt_v_west_virginia: ['2017-09-08', ['Pittsburgh', 'West Virginia']],
  harry_groves_syracuse_v_west_virginia: ['2017-09-08', ['Syracuse', 'West Virginia']],
  john_mcnichols_invitational: ['2017-09-09', ['Michigan', 'Louisville']],
  commodore_classic: ['2017-09-16', ['Ohio State', 'Vanderbilt', 'Missouri', 'Eastern Michigan', 'Lipscomb', 'Miami (Ohio)', 'Belmont']],
  sundodger_invitational: ['2017-09-16', ['Washington', 'Oregon State', 'Nevada', 'Creighton']],
  coast_to_coast_battle_in_beantown: ['2017-09-22', ['Providence', 'Indiana', 'Georgetown', 'Dartmouth', 'Cornell', 'Syracuse', 'New Hampshire', 'Brown', 'Boston College', 'UMass Lowell', 'UAB', 'Lehigh']],
  panorama_farms_invitational: ['2017-09-23', ['Virginia', 'Yale', 'SMU', 'William and Mary', 'Bucknell', 'Charlotte']],
  roy_griak_invitational: ['2017-09-23', ['San Francisco', 'Iowa State', 'Minnesota', 'Michigan State', 'South Dakota', 'Colorado St.', 'Abilene Christian', 'Arizona State', 'UCLA', 'James Madison', 'Toledo', 'Northern Illinois']],
  texas_am_invitational: ['2017-09-23', ['Texas A&M', 'Lamar', 'TCU', 'Rice', 'McNeese State', 'North Texas', 'Texas State']],
  chile_pepper_xc_festival: ['2017-09-29', ['Arkansas', 'Texas State']],
  dellinger_byu_v_cal_poly: ['2017-09-29', ['BYU', 'Cal Poly']],
  dellinger_byu_v_oregon: ['2017-09-29', ['Oregon', 'BYU']],
  dellinger_byu_v_oregon_st: ['2017-09-29', ['BYU', 'Oregon State']],
  dellinger_byu_v_portland: ['2017-09-29', ['BYU', 'Portland']],
  dellinger_byu_v_stanford: ['2017-09-29', ['Stanford', 'BYU']],
  dellinger_byu_v_uc_santa_barbara: ['2017-09-29', ['BYU', 'UC Santa Barbara']],
  dellinger_byu_v_washington: ['2017-09-29', ['BYU', 'Washington']],
  dellinger_cal_poly_v_oregon: ['2017-09-29', ['Oregon', 'Cal Poly']],
  dellinger_cal_poly_v_oregon_st: ['2017-09-29', ['Oregon State', 'Cal Poly']],
  dellinger_cal_poly_v_portland: ['2017-09-29', ['Portland', 'Cal Poly']],
  dellinger_cal_poly_v_stanford: ['2017-09-29', ['Stanford', 'Cal Poly']],
  dellinger_cal_poly_v_uc_santa_barbara: ['2017-09-29', ['Cal Poly', 'UC Santa Barbara']],
  dellinger_cal_poly_v_washington: ['2017-09-29', ['Washington', 'Cal Poly']],
  dellinger_oregon_state_v_portland: ['2017-09-29', ['Portland', 'Oregon State']],
  dellinger_oregon_state_v_stanford: ['2017-09-29', ['Stanford', 'Oregon State']],
  dellinger_oregon_state_v_uc_santa_barbara: ['2017-09-29', ['Oregon State', 'UC Santa Barbara']],
  dellinger_oregon_state_v_washington: ['2017-09-29', ['Washington', 'Oregon State']],
  dellinger_oregon_v_oregon_state: ['2017-09-29', ['Oregon', 'Oregon State']],
  dellinger_oregon_v_portland: ['2017-09-29', ['Oregon', 'Portland']],
  dellinger_oregon_v_stanford: ['2017-09-29', ['Oregon', 'Stanford']],
  dellinger_oregon_v_uc_santa_barbara: ['2017-09-29', ['Oregon', 'UC Santa Barbara']],
  dellinger_oregon_v_washington: ['2017-09-29', ['Oregon', 'Washington']],
  dellinger_portland_v_stanford: ['2017-09-29', ['Stanford', 'Portland']],
  dellinger_portland_v_uc_santa_barbara: ['2017-09-29', ['Portland', 'UC Santa Barbara']],
  dellinger_portland_v_washington: ['2017-09-29', ['Washington', 'Portland']],
  dellinger_stanford_v_uc_santa_barbara: ['2017-09-29', ['Stanford', 'UC Santa Barbara']],
  dellinger_stanford_v_washington: ['2017-09-29', ['Stanford', 'Washington']],
  dellinger_uc_santa_barbara_v_washington: ['2017-09-29', ['Washington', 'UC Santa Barbara']],
  joe_piane_notre_dame_invitational: ['2017-09-29', ['Colorado', 'New Mexico', 'North Carolina St.', 'Arkansas', 'Utah', 'Air Force', 'California', 'Ohio State', 'Eastern Michigan', 'Baylor', 'Florida State', 'Texas', 'Notre Dame', 'Washington St.', 'Pittsburgh', 'UTEP', 'Weber State', 'Alabama', 'TCU', 'Tulane']],
  paul_short: ['2017-09-29', ['Utah State', 'Villanova', 'Georgia', 'Princeton', 'Cornell', 'Duke', 'Arizona', 'Penn', 'Georgia Tech', 'Miss State', 'Wake Forest', 'Richmond', 'Connecticut', 'Lehigh', 'Iona', 'Buffalo', 'Maryland', 'Army West Point', 'Tennessee', 'Navy', 'American', 'Delaware']],
  cowboy_jamboree: ['2017-09-30', ['Ole Miss', 'Penn State', 'Missouri', 'Oklahoma State', 'Northwestern', 'Tulsa', 'Oklahoma', 'Stephen F. Austin']],
  louisville_classic: ['2017-09-30', ['Boise State', 'Wisconsin', 'Furman', 'Minnesota', 'Northern Arizona', 'Eastern Kentucky', 'Louisville', 'West Virginia', 'Kentucky', 'Virginia Tech', 'Samford', 'Vanderbilt', 'North Carolina', 'Purdue', 'Marquette', 'Davidson', 'Oakland', 'Lipscomb', 'Central Michigan', 'UAB', 'Belmont']],
  crimson_classic: ['2017-10-13', ['Georgia Tech', 'Miss State', 'Samford', 'Alabama', 'Texas A&M', 'Belmont', 'Oklahoma', 'North Florida', 'UAB', 'Southern Miss.', 'Florida State', 'Stephen F. Austin', 'Lipscomb']],
  nuttycombe_wisconsin_invitational: ['2017-10-13', ['New Mexico', 'San Francisco', 'North Carolina St.', 'Boise State', 'Providence', 'Furman', 'Washington', 'Stanford', 'Wisconsin', 'Minnesota', 'Michigan State', 'Columbia', 'Iowa State', 'Eastern Michigan', 'California', 'Utah', 'Indiana', 'Syracuse', 'Georgetown', 'Yale', 'Virginia', 'Air Force', 'Baylor', 'Notre Dame', 'UCLA', 'Kentucky', 'Purdue', 'Florida State', 'Colorado St.', 'Tulsa', 'Penn', 'Vanderbilt']],
  penn_state_national_open: ['2017-10-13', ['Penn State', 'Villanova', 'Dartmouth', 'Princeton', 'Cornell', 'Oklahoma State', 'James Madison', 'West Virginia', 'North Carolina', 'Bucknell', 'Buffalo', 'William and Mary', 'Lehigh']],
  adidas_di_pre_nationals: ['2017-10-14', ['Oregon', 'Colorado', 'Arkansas', 'Utah State', 'Michigan', 'Georgia', 'BYU', 'Eastern Kentucky', 'Ole Miss', 'Northern Arizona', 'Virginia Tech', 'Louisville', 'Ohio State', 'Duke', 'Arizona', 'Portland', 'Toledo', 'Abilene Christian', 'Northwestern', 'Wake Forest', 'Dayton', 'Arizona State', 'SMU', 'Missouri', 'Pittsburgh', 'Texas', 'Brown', 'UTEP', 'Kansas', 'Miami (Ohio)', 'Richmond', 'Iona', 'Tennessee', 'Weber State', 'Boston College', 'Creighton', 'Central Michigan', 'Tulane', 'UMass Lowell']],
  acc_championships: ['2017-10-27', ['North Carolina St.', 'Louisville', 'Virginia Tech', 'Syracuse', 'Wake Forest', 'Notre Dame', 'Duke', 'Virginia', 'Florida State', 'Pittsburgh', 'North Carolina', 'Georgia Tech', 'Boston College']],
  ivy_league_heptagonal_championships: ['2017-10-27', ['Columbia', 'Dartmouth', 'Yale', 'Princeton', 'Cornell', 'Brown', 'Penn']],
  mountain_west_championships: ['2017-10-27', ['New Mexico', 'Boise State', 'Utah State', 'Air Force', 'Nevada', 'Colorado St.']],
  pac_12_championships: ['2017-10-27', ['Colorado', 'Oregon', 'Stanford', 'Washington', 'California', 'Utah', 'Arizona', 'UCLA', 'Arizona State', 'Washington St.', 'Oregon State']],
  sec_championships: ['2017-10-27', ['Arkansas', 'Georgia', 'Ole Miss', 'Missouri', 'Miss State', 'Kentucky', 'Alabama', 'Texas A&M', 'Vanderbilt', 'Tennessee']],
  west_coast_conference: ['2017-10-27', ['San Francisco', 'BYU', 'Loyola Marymount', 'Portland']],
  big_12_championships: ['2017-10-28', ['Iowa State', 'Oklahoma State', 'Texas', 'West Virginia', 'Baylor', 'Kansas', 'Oklahoma', 'TCU']],
  big_east_championships: ['2017-10-28', ['Villanova', 'Providence', 'Georgetown', 'Marquette', 'Creighton']],
  big_sky_championships: ['2017-10-28', ['Northern Arizona', 'Montana State', 'Southern Utah', 'Weber State', 'Idaho State']],
  big_10_championships: ['2017-10-29', ['Michigan', 'Minnesota', 'Wisconsin', 'Penn State', 'Michigan State', 'Ohio State', 'Indiana', 'Northwestern', 'Purdue', 'Maryland', 'Iowa']]
}; // end dictionary of meets

function Meet(name, teams) {
  var date = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '3000-01-01';

  this.name = name;
  this.date = date;
  this.teams = teams; // in order of place
}

function Data(teamsin_, curr_inds_, pushes_used_, points_, messages_, dont_push_) {
  //might have to instantiate when initialized
  this.teamsin = teamsin_;
  this.curr_inds = curr_inds_;
  this.pushes_used = pushes_used_;
  this.points = points_;
  this.messages = messages_;
  this.dont_push = dont_push_;
  // self.teamsin = list(teamsin_)    # list of teams currently in
  // self.curr_inds = dict(curr_inds_)    # current index in each regional we're considering (like 3rd or 4th)
  // self.pushes_used = dict(pushes_used_)  # list of regions that we used the push in (so can't use it again)
  // self.points = dict(points_)      # map team name to points scored
  // self.messages = list(messages_)  # list of what to print out at the end
  // self.dont_push = list(dont_push_)      # list of teams not to use the push on (because we're testing it out)

  this.createCopy = function () {
    return new Data(this.teamsin, this.curr_inds, this.pushes_used, this.points, this.messages, this.dont_push);
  };
}

var selectTeam = function selectTeam(cur_data, region, ind, awardpoints, meets, regionals) {
  // console.log(cur_data);
  var d2 = cur_data.createCopy();
  var selected = regionals[region].teams[ind];
  d2.teamsin.push(selected);
  d2.curr_inds[region] += 1;
  if (!awardpoints) {
    d2.messages.push('\n' + d2.teamsin.length + ': ' + selected + ' (#' + d2.curr_inds[region] + ' ' + region + ') is selected, gives no points (pushed in)\n');
    // console.log("no awardpoints");
    return d2;
  }
  //Awarding points
  d2.messages.push(d2.teamsin.length + ': ' + selected + ' (#' + d2.curr_inds[region] + ' ' + region + ') is selected');
  var beatme = {}; //map meet to list of teams that beat me there
  var sorted_meets = (0, _keys2.default)(meets).sort();
  for (var i = 0; i < sorted_meets.length; i++) {
    var m = sorted_meets[i];
    var mobj = meets[m];
    var date = mobj.date;
    var l = mobj.teams;
    if (l.indexOf(selected) < 0) {
      continue;
    }
    var beatmetemp = [];
    //   # iterate through teams that beat me here, but don't bother listing a team if it's already
    //   #   been selected or if it's in the top 2 in its region
    // console.log("l for " + m + " is " + l);
    for (var j = 0; j < l.length; j++) {
      var _t = l[j];
      // console.log(t);
      if (_t === selected) {
        break;
      }
      var addme = true;
      if (d2.teamsin.indexOf(_t) > -1) {
        addme = false;
      }
      for (var regname in regionals) {
        var regobj = regionals[regname];
        var teamlist = regobj.teams;
        if (_t === teamlist[0] || _t === teamlist[1]) {
          addme = false;
        }
      }
      if (addme) {
        beatmetemp.push(_t);
      }
    }
    if (beatmetemp.length > 0) {
      beatme[m] = beatmetemp;
      // console.log(beatme[m]);
    }
  }
  if ((0, _keys2.default)(beatme).length == 0) {
    d2.messages.push(', has no losses to teams remaining');
  } else {
    d2.messages.push(', has losses to ');
    for (var _m in beatme) {
      var _l = beatme[_m];
      // console.log(l);
      d2.messages.push('(' + meets[_m].name + ') ' + _l.join() + '; ');
      for (var _i = 0; _i < _l.length; _i++) {
        //award points
        var ot = _l[_i];
        d2.points[ot] += 1;
      }
    }
  }
  d2.messages.push('\n');
  return d2;
};

var getEligible = function getEligible(data, regionals) {
  var ans = [];

  for (var rname in regionals) {
    var robj = regionals[rname];

    var l = robj.teams;
    if (data.curr_inds[rname] < l.length) {
      ans.push(l[data.curr_inds[rname]]);
      if (data.teamsin.length < 30 && !data.pushes_used[rname] && data.curr_inds[rname] + 1 < l.length) {
        if (data.dont_push.indexOf(l[data.curr_inds[rname] + 1]) > -1) {
          ans.push(l[data.curr_inds[rname] + 1]);
        }
      }
    }
  }
  return ans.sort(function (a, b) {
    return data.points[a] - data.points[b];
  }).reverse(); //pick up from print points etc. do the other methods (dowinner, resolveties, printpoints)
};

var resolveTies = function resolveTies(oldtied, d, meets, regionals) {
  var tied = [oldtied];
  if (tied.length == 1) {
    return tied[0];
  }

  //Head to Head
  d.messages.push('  Breaking ties between ' + tied.join() + ' using head-to-head\n');
  var lost = [];
  //compare every pair of teams
  for (var i = 0; i < tied.length; i++) {
    var ti = tied[i];
    for (var j = i + 1; j < tied.length; j++) {
      var tj = tied[j];
      var score = 0;
      var relevant = [];
      var all_meets = (0, _assign2.default)({}, meets, regionals);
      for (var m in all_meets) {
        var mobj = all_meets[m];
        var date = mobj.date;
        var teams = mobj.teams;
        if (teams.indexOf(ti) > -1 && teams.indexOf(tj) > -1) {
          var _dscore = -1;
          if (teams.indexOf(ti) < teams.indexOf(tj)) {
            _dscore = 1;
          }
          relevant.push([date, m, _dscore]);
          score += _dscore;
        }
      }
      relevant.sort();
      if (relevant.length == 0) {
        d.messages.push('  No head-to-head tiebreaker for ' + ti + ' and ' + tj + '\n');
        continue;
      } else if (score < 0) {
        d.messages.push('  ' + ti + ' loses head-to-head vs ' + tj + ', is not selected');
        lost.push(ti);
      } else if (score < 0) {
        d.messages.push('  ' + tj + ' loses head-to-head vs ' + ti + ', is not selected');
        lost.push(tj);
      } else {
        dscore = relevant[relevant.length - 1][2];
        if (dscore < 0) {
          d.messages.push('  ' + ti + ' loses head-to-head vs ' + tj + ' (most recent matchup), is not selected');
          lost.push(ti);
        } else {
          d.messages.push('  ' + tj + ' loses head-to-head vs ' + ti + ' (most recent matchup), is not selected');
          lost.push(tj);
        }
      }
      var meets_in_msg = [];
      for (var k = 0; k < relevant.length; k++) {
        meets_in_msg.push(relevant[k][1]);
      }

      d.messages.push(' (' + meets_in_msg.join() + ')\n');
    }
  }
  for (var _i2 = 0; _i2 < lost.length; _i2++) {
    var t_ind = tied.indexOf(t);
    if (t_ind > -1) {
      tied.splice(t_ind, 1);
    }
  }
  if (tied.length == 1) {
    return tied[0];
  } else if (tied.length == 0) {
    d.messages.push('  Head-to-head tiebreaker eliminated all teams; ignoring.\n');
    tied = oldtied;
  }

  // Common Opponents
  d.messages.push('  Breaking ties between ' + tied.join() + ' using common opponents\n');
  lost = [];
  for (var _i3 = 0; _i3 < tied.length; _i3++) {
    var _ti = tied[_i3];
    for (var _j = _i3 + 1; _j < tied.length; _j++) {
      var _tj = tied[_j];
      var opps = {};
      var _all_meets = (0, _assign2.default)({}, meets, regionals);
      for (var _m2 in _all_meets) {
        var _mobj = _all_meets[_m2];
        var _teams = _mobj.teams;
        if (_teams.indexOf(_ti) > -1) {
          //add every team ahead of ti as having beat ti
          for (var _k = 0; _k < _teams.indexOf(_ti); _k++) {
            if (!opps.hasOwnProperty(_teams[_k])) {
              opps[_teams[_k]] = [0, 0, 0, 0];
            }
            opps[_teams[_k]][2] += 1; //they played i
          }
          //add every team behind ti as having lost to ti
          for (var _k2 = _teams.indexOf(_ti) + 1; _k2 < _teams.length; _k2++) {
            if (!opps.hasOwnProperty(_teams[_k2])) {
              opps[_teams[_k2]] = [0, 0, 0, 0];
            }
            opps[_teams[_k2]][0] += 1; //i beat them
            opps[_teams[_k2]][2] += 1; //played i
          }
        }
        //do same for tj
        if (_teams.indexOf(_tj) > -1) {
          //add every team ahead of ti as having beat ti
          for (var _k3 = 0; _k3 < _teams.indexOf(_tj); _k3++) {
            if (!opps.hasOwnProperty(_teams[_k3])) {
              opps[_teams[_k3]] = [0, 0, 0, 0];
            }
            opps[_teams[_k3]][3] += 1; //they played j
          }
          //add every team behind ti as having lost to ti
          for (var _k4 = _teams.indexOf(_tj) + 1; _k4 < _teams.length; _k4++) {
            if (!opps.hasOwnProperty(_teams[_k4])) {
              opps[_teams[_k4]] = [0, 0, 0, 0];
            }
            opps[_teams[_k4]][1] += 1; //i beat them
            opps[_teams[_k4]][3] += 1; //played i
          }
        }
      }
      var common_ops = {};
      for (var o in opps) {
        var res = opps[o];
        if (res[2] >= 1 && res[3] >= 1) {
          common_opps[o] = res;
        }
      }

      //now have list of common opps
      if (common_opps.length == 0) {
        d.messages.push('  No common opponents found for ' + _ti + ', ' + _tj);
      } else {
        var wins_i = 0;
        var wins_j = 0;
        var total_i = 0;
        var total_j = 0;

        for (var _o in common_opps) {
          var _res = common_ops[_o];
          wins_i += _res[0];
          wins_j += _res[1];
          total_i += _res[2];
          total_j += _res[3];
        }

        var win_percent_i = wins_i / total_i;
        var win_percent_j = wins_j / total_j;

        if (win_percent_i > win_percent_j) {
          d.messages.push('  ' + _tj + ' loses common opponents vs ' + _ti + ', is not selected (win percentages: ' + win_percent_i + ', ' + win_percent_j + ')');
          lost.push(_tj);
        } else if (win_percent_i < win_percent_j) {
          d.messages.push('  ' + _ti + ' loses common opponents vs ' + _tj + ', is not selected (win percentages: ' + win_percent_j + ', ' + win_percent_i + ')');
          lost.push(_ti);
        } else {
          d.messages.push('  Common opponents are tied for ' + _ti + ', ' + _tj + ' (win percentages: ' + win_percent_i + ', ' + win_percent_j + ')');
        }

        var str_com_opps = [];
        for (var _o2 in common_opps) {
          str_com_opps.push(_o2);
        }

        d.messages.push(' (common opponents: ' + str_com_opps.join() + ')\n');
      }
    }
  }

  for (var _i4 = 0; _i4 < lost.length; _i4++) {
    var _t_ind = tied.indexOf(lost[_i4]);
    if (_t_ind > -1) {
      tied.splice(_t_ind, 1);
    }
  }

  if (tied.length == 1) {
    return tied[0]; //got a winner (!)
  } else if (tied.length == 0) {
    d.messages.push('  Common opponent tiebreaker eliminated all teams; ignoring.\n');
    tied = oldtied; //got a contradiction
  }

  //Highest Place at Regionals
  d.messages.push('  Breaking ties between ' + tied + ' using highest place at regionals.\n');
  var places = Array(tied.length).fill(20); //20 was picked as a high number

  for (var _i5 = 0; _i5 < tied.length; _i5++) {
    var team = tied[_i5];
    for (var rname in regionals) {
      var robj = regionals[rname];
      var reg = robj.teams;
      var team_ind = reg.indexOf(reg);
      if (team_ind > -1) {
        places[_i5] = team_ind;
        break;
      }
    }
  }
  var best_place = Math.max.apply(null, places);
  var newtied = [];
  for (var _i6 = 0; _i6 < tied.length; _i6++) {
    var _team = tied[_i6];
    if (places[_i6] == best_place) {
      newtied.push(_team);
    }
  }

  if (newtied.length == 1) {
    d.messages.push('  Broke tie by selecting ' + newtied[0] + ' (highest regional finish).\n');
    return newtied[0];
  } else if (newtied.length == 0) {
    //should not happen
    console.log('newtied.length == 0 for some reason during 1st score at regionals');
  } else {
    tied = newtied;
  }

  //Closest to 2nd score at regionals
  d.messages.push('  Breaking ties between ' + tied + ' using closest score to 2nd-place in region.\n');
  var scored_diffs = Array(tied.length).fill(0);
  var best_diff = 10000;
  for (var _i7 = 0; _i7 < tied.length; _i7++) {
    var _team2 = tied[_i7];
    for (var _rname in regionals) {
      var _robj = regionals[_rname];
      var _reg = _robj.teams;
      var _team_ind = _reg.indexOf(_team2);
      if (_team_ind > -1) {
        var diff = _robj.team_scores[_team_ind] - _robj.team_scores[1];
        scored_diffs[_i7] = diff;
        best_diff = Math.min(best_diff, diff);
      }
    }
  }
  newtied = [];
  for (var _i8 = 0; _i8 < tied.length; _i8++) {
    var _t2 = tied[_i8];
    if (scored_diffs[_i8] == best_diff) {
      newtied.push(_t2);
    }
  }

  if (newtied.length == 1) {
    d.messages.push('  Broke tie by selecting ' + newtied[0] + ' (closest score to regional 2nd-place).\n');
    return newtied[0];
  } else if (newtied.length == 0) {
    //should not happen
    console.log('newtied.length == 0 for some reason during 2nd score at regionals');
  } else {
    tied = newtied;
  }

  d.messages.push('  Could not break ties among ' + newtied.join() + '!\n');
  return tied;
};

//"do next step of selection"
var doSelection = function doSelection(d, meets, regionals) {
  if (d.teamsin.length == 31) {
    return d;
  }
  var el = getEligible(d, regionals);
  // console.log(el);
  printPoints(el, d);
  return pickFrom(d, el, meets, regionals);
};

// # given a data object, a team ("winner") to be selected, and list of other eligible teams
// # try to select this team
// # if there is no push, then just select them and continue
// # otherwise, hairy stuff
var doWinner = function doWinner(d, winner, el, meets, regionals) {
  var regwin = '';
  for (var r in regionals) {
    // console.log(regionals[r]);
    if (regionals[r].teams.indexOf(winner) > -1) {
      regwin = r;
    }
  }
  var indwin = regionals[regwin].teams.indexOf(winner);

  if (indwin == d.curr_inds[regwin]) {
    d = selectTeam(d, regwin, indwin, true, meets, regionals);
    return doSelection(d, meets, regionals);
  }
  // # if not, then this is a push situation
  // # first, we create a copy of the data object and continue running without this team being eligible
  // # to do this, add it to the no-push list so it doesn't try to push in again later
  // # we add the message that it gets in later on its own just because we assume
  // # that it works (if not, we'll throw out this selection anyway)
  // # then we call pickFrom(), which runs the entire rest of the process and returns
  // # a data object that has all 31 teams selected.
  // # we check if our team made it. If so, fine, return that data object; otherwise,
  // # throw it out, do the push instead and continue with the process.
  var tryme = el;
  tryme.splice(tryme.indexOf(winner), 1);
  var d2 = d.createCopy();
  d2.messages.push(winner + ' not selected with push (gets in later on their own)\n');
  d2.dont_push.push(winner);
  var final = pickFrom(d2, tryme, meets, regionals);
  if (final == null) {
    return null;
  }
  // # they did get in on their own
  // # they didn't get in on their own, so use the push and select both teams
  // # the pushed team gives no points
  d = selectTeam(d, regwin, indwin - 1, false, meets, regionals);
  d = selectTeam(d, regwin, indwin, true, meets, regionals);
  d.pushes_used[regwin] = true;
  return doSelection(d, meets, regionals);
};

var pickFrom = function pickFrom(d, el, meets, regionals) {
  var tied = [];
  for (var i = 0; i < el.length; i++) {
    var _t3 = el[i];
    if (d.points[_t3] == d.points[el[0]]) {
      tied.push(_t3);
    }
  }
  var winner = resolveTies(tied, d, meets, regionals);

  if (winner.length > 1) {
    // console.log(d.messages.join("") + "\n\n");
    // let results = [];
    // console.log("Couldn't break the tie, please pick from " + winner);
    // let choice = "";
    // while(true){
    //   choice = readline();
    //   if(winner.indexOf(choice) > -1){
    //     break;
    //   }
    //   console.log("Not in list, select again");
    // }
    var choice = winner[0];

    var d2 = d.createCopy();
    d2.messages.push('\nTie between ' + winner + ' of size ' + winner.length + '\n');
    d2.messages.push('Manually broke tie by picking ' + choice + '\n\n');
    return doWinner(d2, choice, el, meets, regionals);
  }

  d.messages.push('\n');
  return doWinner(d, winner[0], el, meets, regionals);
};

// # print out the current status of everything
var printPoints = function printPoints(el, data) {
  data.messages.push('\nTeams under consideration by points:\n');
  var pts_to_teams = {};
  // data.messages.push("el:" + el + "\n");
  for (var i = 0; i < el.length; i++) {
    var e = el[i];
    var pts = data.points[e];
    if (pts_to_teams.hasOwnProperty(pts)) {
      // data.messages.push("push adding " + e + "\n");
      pts_to_teams[pts].push(e);
    } else {
      // data.messages.push("adding " + e + "\n");
      pts_to_teams[pts] = [e];
    }
  }

  var pts_keys = (0, _keys2.default)(pts_to_teams).sort(function (a, b) {
    return parseInt(a) - parseInt(b);
  }).reverse();
  data.messages.push('pts: ' + pts_keys + '\n');
  for (var _i9 = 0; _i9 < pts_keys.length; _i9++) {
    var _pts = pts_keys[_i9];
    var teamlist = pts_to_teams[_pts];
    data.messages.push('  ' + _pts + ' '.repeat(3 - _pts.toString().length) + teamlist.join() + '\n');
  }
  data.messages.push('  Others with points: ');
  var all_by_pts = (0, _keys2.default)(data.points).sort(function (a, b) {
    return data.points[a] - data.points[b];
  }).reverse();
  var others = [];
  for (var _i10 = 0; _i10 < all_by_pts.length; _i10++) {
    var _t4 = all_by_pts[_i10];
    if (el.indexOf(_t4) < 0 && data.teamsin.indexOf(_t4) < 0 && data.points[_t4] >= 1) {
      others.push(_t4);
    }
  }
  var other_strlist = [];
  for (var _i11 = 0; _i11 < others.length; _i11++) {
    var _t5 = others[_i11];
    other_strlist.push(_t5 + ' (' + data.points[_t5] + ')');
  }
  data.messages.push(other_strlist.join());
  data.messages.push('\n');
};

// Map the teams that made it to their point values for use in API
var mapTeams = function mapTeams(results) {
  return results.teamsin.map(function (team) {
    return {
      name: team,
      points: results.points[team]
    };
  }).sort(function (a, b) {
    return a.points - b.points;
  }).map(function (team) {
    return (0, _extends3.default)({}, team, {
      points: team.points === 0 ? 'Auto bid' : team.points
    });
  });
};

var execute = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(regionals, meets) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', new _promise2.default(function (resolve, reject) {
              var new_regionals = {};
              for (var rname in regionals) {
                var teamlist = regionals[rname];
                var m = new Meet(rname + ' regional', teamlist);
                new_regionals[rname] = m;
              }
              regionals = new_regionals;

              var new_meets = {};
              for (var mname in meets) {
                var pr = meets[mname];
                var _m3 = new Meet(mname, pr[1], pr[0]);
                new_meets[mname] = _m3;
              }
              meets = new_meets;
              // # print out the current status of everything
              // def printPoints(el,data):

              // # Start from a blank slate
              var curr_inds = {};
              var pushes_used = {};
              var points = {};
              var reg_keys = (0, _keys2.default)(regionals).sort();
              for (var i = 0; i < reg_keys.length; i++) {
                var r = reg_keys[i];
                curr_inds[r] = 0;
                pushes_used[r] = false;
                // console.log(reg_keys[r]);
                for (var j = 0; j < regionals[r].teams.length; j++) {
                  var _t6 = regionals[r].teams[j];
                  points[_t6] = 0;
                }
              }

              for (var _m4 in meets) {
                var l = meets[_m4];
                for (var _i12 = 0; _i12 < l.teams.length; _i12++) {
                  var _t7 = l.teams[_i12];
                  points[_t7] = 0;
                }
              }

              var data = new Data([], curr_inds, pushes_used, points, [], []);
              // selectTeam(data,"great_lakes",0);
              //
              // # Select automatically the top two in each region
              data.messages.push('Automatically selected:\n');
              for (var _i13 = 0; _i13 < reg_keys.length; _i13++) {
                var _r = reg_keys[_i13];
                data = selectTeam(data, _r, 0, true, meets, regionals);
                data = selectTeam(data, _r, 1, true, meets, regionals);
              }

              // # Select at-large teams
              var results = doSelection(data, meets, regionals);
              if (results == null || results.length == 0) {
                console.log('There was an error!!');
              } else {
                var alpha_order_teams = results.teamsin.sort();
                if (TEST) {
                  console.log('\nTeams selected in alpha order:\n');
                  for (var _i14 = 0; _i14 < alpha_order_teams.length; _i14++) {
                    console.log(_i14 + 1 + ' ' + alpha_order_teams[_i14]);
                  }
                  console.log('');
                  console.log('');
                  console.log(results.messages.join(''));
                }
              }
              resolve(mapTeams(results));
            }));

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function execute(_x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var runLocally = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
    var res;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return execute(testRegionals, testMeets);

          case 3:
            res = _context2.sent;

            console.log(res);
            _context2.next = 10;
            break;

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2['catch'](0);

            console.log(_context2.t0);

          case 10:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 7]]);
  }));

  return function runLocally() {
    return _ref2.apply(this, arguments);
  };
}();

if (TEST) {
  runLocally();
}

exports.default = execute;
//# sourceMappingURL=kolasAlgorithm.js.map