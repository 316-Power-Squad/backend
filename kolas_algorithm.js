import db, { MODE_TEST } from './helpers/db';

let regionals    = {
great_lakes   : ['Michigan', 'Michigan State', 'Wisconsin', 'Eastern Michigan', 'Indiana', 'Notre Dame', 'Ohio State', 'Dayton', 'Toledo', 'Purdue',  'Miami (Ohio)', 'Marquette', 'Indiana State', 'Xavier  (Ohio)', 'Oakland'],  // PROJECTED
mid_atlantic  : ['Penn State', 'Villanova', 'Georgetown', 'Princeton', 'Pittsburgh', 'Penn', 'West Virginia', 'Bucknell', 'Maryland', 'Temple', 'Duquesne', 'Navy', 'St. Josephs', 'Lehigh', 'American'],  // PROJECTED
midwest       : ['Iowa State', 'Oklahoma State', 'Minnesota', 'Missouri', 'South Dakota', 'Bradley', 'Northern Iowa', 'Tulsa', 'Northwestern', 'Kansas', 'Northern Illinois', 'Iowa', 'Oklahoma', 'Creighton', 'South Dakota St.'],  // PROJECTEDx
mountain      : ['Colorado', 'New Mexico', 'BYU', 'Utah State', 'Utah', 'Air Force', 'Colorado St.', 'Northern Arizona', 'Nevada', 'Montana State', 'Weber State', 'Idaho State', 'Utah Valley', 'UTEP', 'Wyoming'],  // PROJECTED
northeast     : ['Providence', 'Dartmouth', 'Syracuse', 'Columbia', 'Yale', 'Iona', 'Brown',  'Cornell', 'New Hampshire', 'Buffalo',  'Marist', 'Harvard', 'UMass Lowell', 'Boston College', 'UMass Amherst'],  // PROJECTED
south         : ['Ole Miss', 'Georgia', 'Samford', 'Florida State', 'Georgia Tech', 'Auburn', 'Miss State', 'Vanderbilt', 'Alabama', 'Tennessee', 'Jacksonville', 'Southern Miss.', 'North Florida', 'Belmont', 'UAB'],  // PROJECTED
south_central : ['Arkansas', 'Texas', 'Baylor', 'SMU', 'Abilene Christian', 'Texas A&M', 'TCU', 'Tulane', 'North Texas', 'Lamar', 'Rice', 'McNeese State', 'Texas State', 'LSU', 'Arkansas State'],  // PROJECTED
southeast     : ['North Carolina St.', 'Furman', 'Eastern Kentucky', 'Virginia Tech', 'Louisville', 'Wake Forest', 'Virginia', 'Richmond', 'Davidson', 'Duke', 'Kentucky', 'James Madison', 'North Carolina', 'Charlotte', 'Elon'],  // PROJECTED
west          : ['San Francisco', 'Stanford', 'Oregon', 'Boise State', 'California', 'Washington', 'Arizona', 'San Jose St.', 'Arizona State', 'Portland', 'Loyola Marymount', 'UCLA', 'Oregon State', 'Idaho', 'Washington St.']  // PROJECTED
}



let meets                   = {
harry_groves_bucknell_v_georgetown        : ["2017-09-08", ['Georgetown', 'Bucknell']],
harry_groves_bucknell_v_penn_state        : ["2017-09-08", ['Penn State', 'Bucknell']],
harry_groves_bucknell_v_pitt              : ["2017-09-08", ['Pittsburgh', 'Bucknell']],
harry_groves_bucknell_v_syracuse          : ["2017-09-08", ['Syracuse', 'Bucknell']],
harry_groves_bucknell_v_west_virginia     : ["2017-09-08", ['Bucknell', 'West Virginia']],
harry_groves_georgetown_v_penn_state      : ["2017-09-08", ['Penn State', 'Georgetown']],
harry_groves_georgetown_v_pitt            : ["2017-09-08", ['Georgetown', 'Pittsburgh']],
harry_groves_georgetown_v_syracuse        : ["2017-09-08", ['Georgetown', 'Syracuse']],
harry_groves_georgetown_v_west_virginia   : ["2017-09-08", ['Georgetown', 'West Virginia']],
harry_groves_penn_state_v_pitt            : ["2017-09-08", ['Penn State', 'Pittsburgh']],
harry_groves_penn_state_v_syracuse        : ["2017-09-08", ['Penn State', 'Syracuse']],
harry_groves_penn_state_v_west_virginia   : ["2017-09-08", ['Penn State', 'West Virginia']],
harry_groves_pitt_v_syracuse              : ["2017-09-08", ['Syracuse', 'Pittsburgh']],
harry_groves_pitt_v_west_virginia         : ["2017-09-08", ['Pittsburgh', 'West Virginia']],
harry_groves_syracuse_v_west_virginia     : ["2017-09-08", ['Syracuse', 'West Virginia']],
john_mcnichols_invitational               : ["2017-09-09", ['Michigan', 'Louisville']],
commodore_classic                         : ["2017-09-16", ['Ohio State', 'Vanderbilt', 'Missouri', 'Eastern Michigan', 'Lipscomb', 'Miami (Ohio)', 'Belmont']],
sundodger_invitational                    : ["2017-09-16", ['Washington', 'Oregon State', 'Nevada', 'Creighton']],
coast_to_coast_battle_in_beantown         : ["2017-09-22", ['Providence', 'Indiana', 'Georgetown', 'Dartmouth', 'Cornell', 'Syracuse', 'New Hampshire', 'Brown', 'Boston College', 'UMass Lowell', 'UAB', 'Lehigh']],
panorama_farms_invitational               : ["2017-09-23", ['Virginia', 'Yale', 'SMU', 'William and Mary', 'Bucknell', 'Charlotte']],
roy_griak_invitational                    : ["2017-09-23", ['San Francisco', 'Iowa State', 'Minnesota', 'Michigan State', 'South Dakota', 'Colorado St.', 'Abilene Christian', 'Arizona State', 'UCLA', 'James Madison', 'Toledo', 'Northern Illinois']],
texas_am_invitational                    : ["2017-09-23", ['Texas A&M', 'Lamar', 'TCU', 'Rice', 'McNeese State', 'North Texas', 'Texas State']],
chile_pepper_xc_festival                  : ["2017-09-29", ['Arkansas', 'Texas State']],
dellinger_byu_v_cal_poly                  : ["2017-09-29", ['BYU', 'Cal Poly']],
dellinger_byu_v_oregon                    : ["2017-09-29", ['Oregon', 'BYU']],
dellinger_byu_v_oregon_st                 : ["2017-09-29", ['BYU', 'Oregon State']],
dellinger_byu_v_portland                  : ["2017-09-29", ['BYU', 'Portland']],
dellinger_byu_v_stanford                  : ["2017-09-29", ['Stanford', 'BYU']],
dellinger_byu_v_uc_santa_barbara          : ["2017-09-29", ['BYU', 'UC Santa Barbara']],
dellinger_byu_v_washington                : ["2017-09-29", ['BYU', 'Washington']],
dellinger_cal_poly_v_oregon               : ["2017-09-29", ['Oregon', 'Cal Poly']],
dellinger_cal_poly_v_oregon_st            : ["2017-09-29", ['Oregon State', 'Cal Poly']],
dellinger_cal_poly_v_portland             : ["2017-09-29", ['Portland', 'Cal Poly']],
dellinger_cal_poly_v_stanford             : ["2017-09-29", ['Stanford', 'Cal Poly']],
dellinger_cal_poly_v_uc_santa_barbara     : ["2017-09-29", ['Cal Poly', 'UC Santa Barbara']],
dellinger_cal_poly_v_washington           : ["2017-09-29", ['Washington', 'Cal Poly']],
dellinger_oregon_state_v_portland         : ["2017-09-29", ['Portland', 'Oregon State']],
dellinger_oregon_state_v_stanford         : ["2017-09-29", ['Stanford', 'Oregon State']],
dellinger_oregon_state_v_uc_santa_barbara : ["2017-09-29", ['Oregon State', 'UC Santa Barbara']],
dellinger_oregon_state_v_washington       : ["2017-09-29", ['Washington', 'Oregon State']],
dellinger_oregon_v_oregon_state           : ["2017-09-29", ['Oregon', 'Oregon State']],
dellinger_oregon_v_portland               : ["2017-09-29", ['Oregon', 'Portland']],
dellinger_oregon_v_stanford               : ["2017-09-29", ['Oregon', 'Stanford']],
dellinger_oregon_v_uc_santa_barbara       : ["2017-09-29", ['Oregon', 'UC Santa Barbara']],
dellinger_oregon_v_washington             : ["2017-09-29", ['Oregon', 'Washington']],
dellinger_portland_v_stanford             : ["2017-09-29", ['Stanford', 'Portland']],
dellinger_portland_v_uc_santa_barbara     : ["2017-09-29", ['Portland', 'UC Santa Barbara']],
dellinger_portland_v_washington           : ["2017-09-29", ['Washington', 'Portland']],
dellinger_stanford_v_uc_santa_barbara     : ["2017-09-29", ['Stanford', 'UC Santa Barbara']],
dellinger_stanford_v_washington           : ["2017-09-29", ['Stanford', 'Washington']],
dellinger_uc_santa_barbara_v_washington   : ["2017-09-29", ['Washington', 'UC Santa Barbara']],
joe_piane_notre_dame_invitational         : ["2017-09-29", ['Colorado', 'New Mexico', 'North Carolina St.', 'Arkansas', 'Utah', 'Air Force', 'California', 'Ohio State', 'Eastern Michigan', 'Baylor', 'Florida State', 'Texas', 'Notre Dame', 'Washington St.', 'Pittsburgh', 'UTEP', 'Weber State', 'Alabama', 'TCU', 'Tulane']],
paul_short                                : ["2017-09-29", ['Utah State', 'Villanova', 'Georgia', 'Princeton', 'Cornell', 'Duke', 'Arizona', 'Penn', 'Georgia Tech', 'Miss State', 'Wake Forest', 'Richmond', 'Connecticut', 'Lehigh', 'Iona', 'Buffalo', 'Maryland', 'Army West Point', 'Tennessee', 'Navy', 'American', 'Delaware']],
cowboy_jamboree                           : ["2017-09-30", ['Ole Miss', 'Penn State', 'Missouri', 'Oklahoma State', 'Northwestern', 'Tulsa', 'Oklahoma', 'Stephen F. Austin']],
louisville_classic                        : ["2017-09-30", ['Boise State', 'Wisconsin', 'Furman', 'Minnesota', 'Northern Arizona', 'Eastern Kentucky', 'Louisville', 'West Virginia', 'Kentucky', 'Virginia Tech', 'Samford', 'Vanderbilt', 'North Carolina', 'Purdue', 'Marquette', 'Davidson', 'Oakland', 'Lipscomb', 'Central Michigan', 'UAB', 'Belmont']],
crimson_classic                           : ["2017-10-13", ['Georgia Tech', 'Miss State', 'Samford', 'Alabama', 'Texas A&M', 'Belmont', 'Oklahoma', 'North Florida', 'UAB', 'Southern Miss.', 'Florida State', 'Stephen F. Austin', 'Lipscomb']],
nuttycombe_wisconsin_invitational         : ["2017-10-13", ['New Mexico', 'San Francisco', 'North Carolina St.', 'Boise State', 'Providence', 'Furman', 'Washington', 'Stanford', 'Wisconsin', 'Minnesota', 'Michigan State', 'Columbia', 'Iowa State', 'Eastern Michigan', 'California', 'Utah', 'Indiana', 'Syracuse', 'Georgetown', 'Yale', 'Virginia', 'Air Force', 'Baylor', 'Notre Dame', 'UCLA', 'Kentucky', 'Purdue', 'Florida State', 'Colorado St.', 'Tulsa', 'Penn', 'Vanderbilt']],
penn_state_national_open                  : ["2017-10-13", ['Penn State', 'Villanova', 'Dartmouth', 'Princeton', 'Cornell', 'Oklahoma State', 'James Madison', 'West Virginia', 'North Carolina', 'Bucknell', 'Buffalo', 'William and Mary', 'Lehigh']],
adidas_di_pre_nationals                   : ["2017-10-14", ['Oregon', 'Colorado', 'Arkansas', 'Utah State', 'Michigan', 'Georgia', 'BYU', 'Eastern Kentucky', 'Ole Miss', 'Northern Arizona', 'Virginia Tech', 'Louisville', 'Ohio State', 'Duke', 'Arizona', 'Portland', 'Toledo', 'Abilene Christian', 'Northwestern', 'Wake Forest', 'Dayton', 'Arizona State', 'SMU', 'Missouri', 'Pittsburgh', 'Texas', 'Brown', 'UTEP', 'Kansas', 'Miami (Ohio)', 'Richmond', 'Iona', 'Tennessee', 'Weber State', 'Boston College', 'Creighton', 'Central Michigan', 'Tulane', 'UMass Lowell']],
acc_championships                         : ["2017-10-27", ['North Carolina St.', 'Louisville', 'Virginia Tech', 'Syracuse', 'Wake Forest', 'Notre Dame', 'Duke', 'Virginia', 'Florida State', 'Pittsburgh', 'North Carolina', 'Georgia Tech', 'Boston College']],
ivy_league_heptagonal_championships       : ["2017-10-27", ['Columbia', 'Dartmouth', 'Yale', 'Princeton', 'Cornell', 'Brown', 'Penn']],
mountain_west_championships               : ["2017-10-27", ['New Mexico', 'Boise State', 'Utah State', 'Air Force', 'Nevada', 'Colorado St.']],
pac_12_championships                      : ["2017-10-27", ['Colorado', 'Oregon', 'Stanford', 'Washington', 'California', 'Utah', 'Arizona', 'UCLA', 'Arizona State', 'Washington St.', 'Oregon State']],
sec_championships                         : ["2017-10-27", ['Arkansas', 'Georgia', 'Ole Miss', 'Missouri', 'Miss State', 'Kentucky', 'Alabama', 'Texas A&M', 'Vanderbilt', 'Tennessee']],
west_coast_conference                     : ["2017-10-27", ['San Francisco', 'BYU', 'Loyola Marymount', 'Portland']],
big_12_championships                      : ["2017-10-28", ['Iowa State', 'Oklahoma State', 'Texas', 'West Virginia', 'Baylor', 'Kansas', 'Oklahoma', 'TCU']],
big_east_championships                    : ["2017-10-28", ['Villanova', 'Providence', 'Georgetown', 'Marquette', 'Creighton']],
big_sky_championships                     : ["2017-10-28", ['Northern Arizona', 'Montana State', 'Southern Utah', 'Weber State', 'Idaho State']],
big_10_championships                      : ["2017-10-29", ['Michigan', 'Minnesota', 'Wisconsin', 'Penn State', 'Michigan State', 'Ohio State', 'Indiana', 'Northwestern', 'Purdue', 'Maryland', 'Iowa']],
}  // end dictionary of meets

function Meet(name, teams, date="3000-01-01") {
    this.name = name;
    this.date = date;
    this.teams = teams;  // in order of place
}

function Data(teamsin_, curr_inds_, pushes_used_, points_, messages_, dont_push_){
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

  this.createCopy = function() {
    return new Data(this.teamsin, this.curr_inds, this.pushes_used, this.points, this.messages, this.dont_push);
  }
}

let selectTeam = function(cur_data,region,ind,awardpoints) {
  // console.log(cur_data);
  let d2 = cur_data.createCopy();
  let selected = regionals[region].teams[ind];
  d2.teamsin.push(selected);
  d2.curr_inds[region] += 1;
  if (!awardpoints){
    d2.messages.push("\n" + d2.teamsin.length + ": " + selected + " (#" + d2.curr_inds[region] + " " + region + ") is selected, gives no points (pushed in)\n");
    // console.log("no awardpoints");
    return d2;
  }
  //Awarding points
  d2.messages.push(d2.teamsin.length + ": " + selected + " (#" + d2.curr_inds[region] + " " + region + ") is selected");
  let beatme = {}; //map meet to list of teams that beat me there
  let sorted_meets = Object.keys(meets).sort();
  for (let i = 0; i < sorted_meets.length; i++){
    let m = sorted_meets[i];
    let mobj = meets[m];
    let date = mobj.date;
    let l = mobj.teams;
    if(l.indexOf(selected) < 0){
      continue;
    }
    let beatmetemp = [];
  //   # iterate through teams that beat me here, but don't bother listing a team if it's already
  //   #   been selected or if it's in the top 2 in its region
    // console.log("l for " + m + " is " + l);
    for (let j = 0; j < l.length; j++){
      let t = l[j];
      // console.log(t);
      if(t === selected){
        break;
      }
      let addme = true;
      if(d2.teamsin.indexOf(t) > -1){
        addme = false;
      }
      for (let regname in regionals){
        let regobj = regionals[regname];
        let teamlist = regobj.teams;
        if(t === teamlist[0] || t === teamlist[1]){
          addme = false;
        }
      }
      if(addme){
        beatmetemp.push(t);
      }
    }
    if(beatmetemp.length > 0){
      beatme[m] = beatmetemp;
      // console.log(beatme[m]);
    }
  }
  if(Object.keys(beatme).length == 0){
    d2.messages.push(", has no losses to teams remaining")
  }
  else{
    d2.messages.push(", has losses to ")
    for(let m in beatme){
      let l = beatme[m];
      // console.log(l);
      d2.messages.push("(" + meets[m].name + ") " + l.join() + "; ");
      for (let i = 0; i < l.length; i++){ //award points
        let ot = l[i];
        d2.points[ot] += 1;
      }
    }

  }
  d2.messages.push("\n");
  return d2;
}

let getEligible = function(data){
  let ans = [];

  for(let rname in regionals){
    let robj = regionals[rname];

    let l = robj.teams;
    if (data.curr_inds[rname] < l.length){
      ans.push(l[data.curr_inds[rname]]);
      if(data.teamsin.length < 30 && !data.pushes_used[rname] && data.curr_inds[rname]+1 < l.length){
        if(data.dont_push.indexOf(l[data.curr_inds[rname]+1]) > -1){
          ans.push(l[data.curr_inds[rname]+1])
        }
      }
    }
  }
  return ans.sort(function(a, b) {
    return data.points[a] - data.points[b];
  }).reverse(); //pick up from print points etc. do the other methods (dowinner, resolveties, printpoints)
}

let resolveTies = function(oldtied, d){
  let tied = [oldtied];
  if (tied.length == 1){
    return tied[0];
  }

  //Head to Head
  d.messages.push("  Breaking ties between " + tied.join() + " using head-to-head\n");
  let lost = []
  //compare every pair of teams
  for(let i = 0; i < tied.length; i++){
    let ti = tied[i];
    for(let j = i+1; j < tied.length; j++){
      let tj = tied[j];
      let score = 0;
      let relevant = [];
      let all_meets = Object.assign({}, meets, regionals);
      for(let m in all_meets){
        let mobj = all_meets[m];
        let date = mobj.date;
        let teams = mobj.teams;
        if(teams.indexOf(ti) > -1 && teams.indexOf(tj) > -1){
          let dscore = -1;
          if(teams.indexOf(ti) < teams.indexOf(tj)){
            dscore = 1;
          }
          relevant.push([date, m, dscore]);
          score += dscore;
        }
      }
      relevant.sort();
      if(relevant.length == 0){
        d.messages.push("  No head-to-head tiebreaker for " + ti + " and " + tj + "\n");
        continue;
      }
      else if(score < 0){
        d.messages.push("  " + ti + " loses head-to-head vs " + tj + ", is not selected");
        lost.push(ti);
      }
      else if(score < 0){
        d.messages.push("  " + tj + " loses head-to-head vs " + ti + ", is not selected");
        lost.push(tj);
      }
      else{
        dscore = relevant[relevant.length - 1][2];
        if(dscore < 0){
          d.messages.push("  " + ti + " loses head-to-head vs " + tj + " (most recent matchup), is not selected");
          lost.push(ti);
        }
        else{
          d.messages.push("  " + tj + " loses head-to-head vs " + ti + " (most recent matchup), is not selected");
          lost.push(tj);
        }
      }
      let meets_in_msg = [];
      for(let k = 0; k < relevant.length; k++){
        meets_in_msg.push(relevant[k][1]);
      }

      d.messages.push(" (" + meets_in_msg.join() + ")\n")
    }
  }
  for(let i = 0; i < lost.length; i++){
    let t_ind = tied.indexOf(t)
    if(t_ind > -1){
      tied.splice(t_ind,1);
    }
  }
  if(tied.length == 1){
    return tied[0];
  }
  else if(tied.length == 0){
    d.messages.push("  Head-to-head tiebreaker eliminated all teams; ignoring.\n");
    tied = oldtied;
  }

  // Common Opponents
  d.messages.push("  Breaking ties between " + tied.join() + " using common opponents\n");
  lost = [];
  for(let i = 0; i < tied.length; i++){
    let ti = tied[i];
    for(let j = i+1; j < tied.length; j++){
      let tj = tied[j];
      let opps = {};
      let all_meets = Object.assign({}, meets, regionals);
      for(let m in all_meets){
        let mobj = all_meets[m];
        let teams = mobj.teams;
        if(teams.indexOf(ti) > -1){
          //add every team ahead of ti as having beat ti
          for(let k = 0; k < teams.indexOf(ti); k++){
            if(!opps.hasOwnProperty(teams[k])){
              opps[teams[k]] = [0,0,0,0];
            }
            opps[teams[k]][2] += 1; //they played i
          }
          //add every team behind ti as having lost to ti
          for(let k = teams.indexOf(ti) + 1; k < teams.length; k++){
            if(!opps.hasOwnProperty(teams[k])){
              opps[teams[k]] = [0,0,0,0];
            }
            opps[teams[k]][0] += 1; //i beat them
            opps[teams[k]][2] += 1; //played i
          }
        }
        //do same for tj
        if(teams.indexOf(tj) > -1){
          //add every team ahead of ti as having beat ti
          for(let k = 0; k < teams.indexOf(tj); k++){
            if(!opps.hasOwnProperty(teams[k])){
              opps[teams[k]] = [0,0,0,0];
            }
            opps[teams[k]][3] += 1; //they played j
          }
          //add every team behind ti as having lost to ti
          for(let k = teams.indexOf(tj) + 1; k < teams.length; k++){
            if(!opps.hasOwnProperty(teams[k])){
              opps[teams[k]] = [0,0,0,0];
            }
            opps[teams[k]][1] += 1; //i beat them
            opps[teams[k]][3] += 1; //played i
          }
        }
      }
      let common_ops = {};
      for(let o in opps){
        let res = opps[o];
        if(res[2] >= 1 && res[3] >= 1){
          common_opps[o] = res;
        }
      }

      //now have list of common opps
      if(common_opps.length == 0){
        d.messages.push("  No common opponents found for " + ti + ", " + tj);
      }
      else{
        let wins_i = 0;
        let wins_j = 0;
        let total_i = 0;
        let total_j = 0;

        for(let o in common_opps){
          let res = common_ops[o];
          wins_i+= res[0];
          wins_j+= res[1];
          total_i += res[2];
          total_j += res[3];
        }

        let win_percent_i = wins_i/total_i;
        let win_percent_j = wins_j/total_j;

        if(win_percent_i > win_percent_j){
          d.messages.push("  " + tj + " loses common opponents vs " + ti + ", is not selected (win percentages: " + win_percent_i + ", " + win_percent_j + ")");
          lost.push(tj);
        }
        else if(win_percent_i < win_percent_j){
          d.messages.push("  " + ti + " loses common opponents vs " + tj + ", is not selected (win percentages: " + win_percent_j + ", " + win_percent_i + ")");
          lost.push(ti);
        }
        else{
          d.messages.push("  Common opponents are tied for " + ti + ", " + tj + " (win percentages: " + win_percent_i + ", " + win_percent_j + ")");
        }

        let str_com_opps = [];
        for(let o in common_opps){
          str_com_opps.push(o);
        }

        d.messages.push(" (common opponents: " + str_com_opps.join() + ")\n");
      }
    }
  }

  for(let i = 0; i < lost.length; i++){
    let t_ind = tied.indexOf(lost[i]);
    if(t_ind > -1){
      tied.splice(t_ind,1)
    }
  }

  if(tied.length == 1){
    return tied[0]; //got a winner (!)
  }
  else if(tied.length == 0){
    d.messages.push("  Common opponent tiebreaker eliminated all teams; ignoring.\n");
    tied = oldtied; //got a contradiction
  }


  //Highest Place at Regionals
  d.messages.push("  Breaking ties between " + tied + " using highest place at regionals.\n");
  let places = Array(tied.length).fill(20); //20 was picked as a high number

  for(let i = 0; i < tied.length; i++){
    let team = tied[i];
    for(let rname in regionals){
      let robj = regionals[rname];
      let reg = robj.teams;
      let team_ind = reg.indexOf(reg);
      if(team_ind > -1){
        places[i] = team_ind;
        break;
      }
    }
  }
  let best_place = Math.max.apply(null, places);
  let newtied = [];
  for(let i = 0; i < tied.length; i++){
    let team = tied[i];
    if(places[i] == best_place){
      newtied.push(team);
    }
  }

  if(newtied.length == 1){
    d.messages.push("  Broke tie by selecting " + newtied[0] + " (highest regional finish).\n");
    return newtied[0];
  }
  else if(newtied.length == 0){
    //should not happen
    console.log("newtied.length == 0 for some reason during 1st score at regionals");
  }
  else {
    tied = newtied;
  }

  //Closest to 2nd score at regionals
  d.messages.push("  Breaking ties between " + tied + " using closest score to 2nd-place in region.\n");
  let scored_diffs = Array(tied.length).fill(0);
  let best_diff = 10000;
  for(let i = 0; i < tied.length; i++){
    let team = tied[i];
    for(let rname in regionals){
      let robj = regionals[rname];
      let reg = robj.teams;
      let team_ind = reg.indexOf(team);
      if(team_ind > -1){
        let diff = robj.team_scores[team_ind] - robj.team_scores[1];
        scored_diffs[i] = diff;
        best_diff = Math.min(best_diff, diff);
      }
    }
  }
  newtied = [];
  for(let i = 0; i < tied.length; i++){
    let t = tied[i];
    if(scored_diffs[i] == best_diff){
      newtied.push(t);
    }
  }

  if(newtied.length == 1){
    d.messages.push("  Broke tie by selecting " + newtied[0] + " (closest score to regional 2nd-place).\n");
    return newtied[0];
  }
  else if(newtied.length == 0){
    //should not happen
    console.log("newtied.length == 0 for some reason during 2nd score at regionals");
  }
  else{
    tied = newtied;
  }

  d.messages.push("  Could not break ties among " + newtied.join() + "!\n");
  return tied;
}

// # given a data object, a team ("winner") to be selected, and list of other eligible teams
// # try to select this team
// # if there is no push, then just select them and continue
// # otherwise, hairy stuff
let doWinner = function(d, winner, el){
  let regwin = "";
  for(let r in regionals){
    // console.log(regionals[r]);
    if(regionals[r].teams.indexOf(winner) > -1){
      regwin = r;
    }
  }
  let indwin = regionals[regwin].teams.indexOf(winner);

  if(indwin == d.curr_inds[regwin]){
    d = selectTeam(d,regwin,indwin,true);
    return doSelection(d);
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
  let tryme = el;
  tryme.splice(tryme.indexOf(winner),1);
  let d2 = d.createCopy();
  d2.messages.push(winner + " not selected with push (gets in later on their own)\n");
  d2.dont_push.push(winner);
  let final = pickFrom(d2,tryme);
  if(final == null){
    return null;
  }
  // # they did get in on their own
  // # they didn't get in on their own, so use the push and select both teams
  // # the pushed team gives no points
  d = selectTeam(d,regwin,indwin-1,false);
  d = selectTeam(d,regwin,indwin,true);
  d.pushes_used[regwin] = true;
  return doSelection(d);
}

let pickFrom = function(d,el){
  let tied = [];
  for(let i = 0; i < el.length; i++){
    let t = el[i];
    if(d.points[t] == d.points[el[0]]){
      tied.push(t);
    }
  }
  let winner = resolveTies(tied, d);

  if(winner.length > 1){
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
    let choice = winner[0];

    let d2 = d.createCopy();
    d2.messages.push("\nTie between " + winner + " of size " + winner.length + "\n");
    d2.messages.push("Manually broke tie by picking " + choice + "\n\n");
    return doWinner(d2,choice,el);
  }

  d.messages.push("\n");
  return doWinner(d,winner[0],el);
}

// # print out the current status of everything
let printPoints = function(el, data){
  data.messages.push("\nTeams under consideration by points:\n");
  let pts_to_teams = {};
  // data.messages.push("el:" + el + "\n");
  for (let i = 0; i < el.length; i++){
    let e = el[i];
    let pts = data.points[e];
    if (pts_to_teams.hasOwnProperty(pts)){
        // data.messages.push("push adding " + e + "\n");
        pts_to_teams[pts].push(e);
    }
    else{
      // data.messages.push("adding " + e + "\n");
      pts_to_teams[pts] = [e];
    }
  }

  let pts_keys = Object.keys(pts_to_teams).sort(function(a, b) {
    return parseInt(a) - parseInt(b);
  }).reverse();
  data.messages.push("pts: " + pts_keys + "\n");
  for(let i = 0; i < pts_keys.length; i++){
    let pts = pts_keys[i];
    let teamlist = pts_to_teams[pts];
    data.messages.push("  " + pts + " ".repeat((3-pts.toString().length)) + teamlist.join() + "\n");
  }
  data.messages.push("  Others with points: ");
  let all_by_pts = Object.keys(data.points).sort(function(a, b) {
    return data.points[a] - data.points[b];
  }).reverse();
  let others = [];
  for(let i = 0; i < all_by_pts.length; i++){
    let t = all_by_pts[i];
    if(el.indexOf(t) < 0 && data.teamsin.indexOf(t) < 0 && data.points[t] >= 1){
      others.push(t);
    }
  }
  let other_strlist = [];
  for(let i = 0; i < others.length; i++){
    let t = others[i];
    other_strlist.push(t + " (" + data.points[t] + ")");
  }
  data.messages.push(other_strlist.join());
  data.messages.push("\n");
}

export default async () => {
	return new Promise((resolve, reject) => {
    let new_regionals = {};
    for (let rname in regionals) {
      let teamlist = regionals[rname];
      let m = new Meet(rname + " regional", teamlist);
      new_regionals[rname] = m;
    }
    regionals = new_regionals;

    let new_meets = {};
    for (let mname in meets) {
      let pr = meets[mname];
      let m = new Meet(mname, pr[1], pr[0]);
      new_meets[mname] = m;
    }
    meets = new_meets;
    // # print out the current status of everything
    // def printPoints(el,data):


    //"do next step of selection"
    let doSelection = function(d){
      if(d.teamsin.length == 31){
        return d;
      }
      let el = getEligible(d);
      // console.log(el);
      printPoints(el,d);
      return pickFrom(d,el);
    }


    // # Start from a blank slate
    let curr_inds = {};
    let pushes_used = {};
    let points = {};
    let reg_keys = Object.keys(regionals).sort();
    for (let i = 0; i < reg_keys.length; i++){
      let r = reg_keys[i];
      curr_inds[r] = 0;
      pushes_used[r] = false;
      // console.log(reg_keys[r]);
      for (let j = 0; j < regionals[r].teams.length; j++){
        let t = regionals[r].teams[j];
        points[t] = 0;
      }
    }

    for (let m in meets){
      let l = meets[m];
      for(let i = 0; i < l.teams.length; i++){
        let t = l.teams[i];
        points[t] = 0;
      }
    }

    let data = new Data([],curr_inds,pushes_used,points,[],[]);
     // selectTeam(data,"great_lakes",0);
    //
    // # Select automatically the top two in each region
    data.messages.push("Automatically selected:\n");
    for (let i = 0; i < reg_keys.length; i++){
      let r = reg_keys[i];
      // console.log("here is the data" + data.teamsin.length);

      data = selectTeam(data,r,0,true);
      data = selectTeam(data,r,1,true);
    }

    // # Select at-large teams
    let results = doSelection(data);
    if(results == null || results.length == 0){
      console.log("There was an error!!");
    }
    else {
      console.log("\nTeams selected in alpha order:\n");
      let alpha_order_teams = results.teamsin.sort();
      for (let i = 0; i < alpha_order_teams.length; i++){
        console.log(i+1 + " " + alpha_order_teams[i]);
      }
      console.log("");
      console.log("");
      console.log(results.messages.join(""));
    }
		if (err) {
			reject({
				code: 'some_unique_code',
				message: 'some error message'
			});
		}
    
		resolve(results.teamsin);
	})
}
