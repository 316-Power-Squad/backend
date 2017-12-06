# Year: 2017
# Gender: F
#
# Determine the national qualifiers for NCAA XC.
# Has a hardcoded list of season and regionals results.
#
# This software is free.
#
# Note to self: In the future, move the results to a different file than the code!


# How it works:
# For the rules, see the rulebook on the ncaa website.
# http://www.ncaa.org/sites/default/files/2017DIMWCC_PreChamps_DI_CrossCountry_20170920.pdf
#
# There is a "data" object that holds all the information describing where we
# currently are in the process.
# Each round, we get a list of eligible teams and pick the top team.
# If that would create a "push" scenario, we:
#   -- copy the current data object (everything that's been done so far)
#   -- modify the copy to tell it NOT to use the push on this team
#   -- recursively call our procedure to figure out the winner
#   -- If that team would have made the qualifying list, then we're done.
#   -- Otherwise, throw out that recursive call and select this team and the team
#      ahead of them with a push.
#
# The data object also contains a list of "messages" describing what's going on;
# these all get printed out at the end.


import sys,operator

regionals    = dict(
great_lakes   = ['Michigan', 'Michigan State', 'Wisconsin', 'Eastern Michigan', 'Indiana', 'Notre Dame', 'Ohio State', 'Dayton', 'Toledo', 'Purdue',  'Miami (Ohio)', 'Marquette', 'Indiana State', 'Xavier  (Ohio)', 'Oakland'],  # PROJECTED
mid_atlantic  = ['Penn State', 'Villanova', 'Georgetown', 'Princeton', 'Pittsburgh', 'Penn', 'West Virginia', 'Bucknell', 'Maryland', 'Temple', 'Duquesne', 'Navy', 'St. Josephs', 'Lehigh', 'American'],  # PROJECTED
midwest       = ['Iowa State', 'Oklahoma State', 'Minnesota', 'Missouri', 'South Dakota', 'Bradley', 'Northern Iowa', 'Tulsa', 'Northwestern', 'Kansas', 'Northern Illinois', 'Iowa', 'Oklahoma', 'Creighton', 'South Dakota St.'],  # PROJECTEDx
mountain      = ['Colorado', 'New Mexico', 'BYU', 'Utah State', 'Utah', 'Air Force', 'Colorado St.', 'Northern Arizona', 'Nevada', 'Montana State', 'Weber State', 'Idaho State', 'Utah Valley', 'UTEP', 'Wyoming'],  # PROJECTED
northeast     = ['Providence', 'Dartmouth', 'Syracuse', 'Columbia', 'Yale', 'Iona', 'Brown',  'Cornell', 'New Hampshire', 'Buffalo',  'Marist', 'Harvard', 'UMass Lowell', 'Boston College', 'UMass Amherst'],  # PROJECTED
south         = ['Ole Miss', 'Georgia', 'Samford', 'Florida State', 'Georgia Tech', 'Auburn', 'Miss State', 'Vanderbilt', 'Alabama', 'Tennessee', 'Jacksonville', 'Southern Miss.', 'North Florida', 'Belmont', 'UAB'],  # PROJECTED
south_central = ['Arkansas', 'Texas', 'Baylor', 'SMU', 'Abilene Christian', 'Texas A&M', 'TCU', 'Tulane', 'North Texas', 'Lamar', 'Rice', 'McNeese State', 'Texas State', 'LSU', 'Arkansas State'],  # PROJECTED
southeast     = ['North Carolina St.', 'Furman', 'Eastern Kentucky', 'Virginia Tech', 'Louisville', 'Wake Forest', 'Virginia', 'Richmond', 'Davidson', 'Duke', 'Kentucky', 'James Madison', 'North Carolina', 'Charlotte', 'Elon'],  # PROJECTED
west          = ['San Francisco', 'Stanford', 'Oregon', 'Boise State', 'California', 'Washington', 'Arizona', 'San Jose St.', 'Arizona State', 'Portland', 'Loyola Marymount', 'UCLA', 'Oregon State', 'Idaho', 'Washington St.']  # PROJECTED
)



meets                   = dict(
harry_groves_bucknell_v_georgetown        = ("2017-09-08", ['Georgetown', 'Bucknell']),
harry_groves_bucknell_v_penn_state        = ("2017-09-08", ['Penn State', 'Bucknell']),
harry_groves_bucknell_v_pitt              = ("2017-09-08", ['Pittsburgh', 'Bucknell']),
harry_groves_bucknell_v_syracuse          = ("2017-09-08", ['Syracuse', 'Bucknell']),
harry_groves_bucknell_v_west_virginia     = ("2017-09-08", ['Bucknell', 'West Virginia']),
harry_groves_georgetown_v_penn_state      = ("2017-09-08", ['Penn State', 'Georgetown']),
harry_groves_georgetown_v_pitt            = ("2017-09-08", ['Georgetown', 'Pittsburgh']),
harry_groves_georgetown_v_syracuse        = ("2017-09-08", ['Georgetown', 'Syracuse']),
harry_groves_georgetown_v_west_virginia   = ("2017-09-08", ['Georgetown', 'West Virginia']),
harry_groves_penn_state_v_pitt            = ("2017-09-08", ['Penn State', 'Pittsburgh']),
harry_groves_penn_state_v_syracuse        = ("2017-09-08", ['Penn State', 'Syracuse']),
harry_groves_penn_state_v_west_virginia   = ("2017-09-08", ['Penn State', 'West Virginia']),
harry_groves_pitt_v_syracuse              = ("2017-09-08", ['Syracuse', 'Pittsburgh']),
harry_groves_pitt_v_west_virginia         = ("2017-09-08", ['Pittsburgh', 'West Virginia']),
harry_groves_syracuse_v_west_virginia     = ("2017-09-08", ['Syracuse', 'West Virginia']),
john_mcnichols_invitational               = ("2017-09-09", ['Michigan', 'Louisville']),
commodore_classic                         = ("2017-09-16", ['Ohio State', 'Vanderbilt', 'Missouri', 'Eastern Michigan', 'Lipscomb', 'Miami (Ohio)', 'Belmont']),
sundodger_invitational                    = ("2017-09-16", ['Washington', 'Oregon State', 'Nevada', 'Creighton']),
coast_to_coast_battle_in_beantown         = ("2017-09-22", ['Providence', 'Indiana', 'Georgetown', 'Dartmouth', 'Cornell', 'Syracuse', 'New Hampshire', 'Brown', 'Boston College', 'UMass Lowell', 'UAB', 'Lehigh']),
panorama_farms_invitational               = ("2017-09-23", ['Virginia', 'Yale', 'SMU', 'William and Mary', 'Bucknell', 'Charlotte']),
roy_griak_invitational                    = ("2017-09-23", ['San Francisco', 'Iowa State', 'Minnesota', 'Michigan State', 'South Dakota', 'Colorado St.', 'Abilene Christian', 'Arizona State', 'UCLA', 'James Madison', 'Toledo', 'Northern Illinois']),
texas_am_invitational                    = ("2017-09-23", ['Texas A&M', 'Lamar', 'TCU', 'Rice', 'McNeese State', 'North Texas', 'Texas State']),
chile_pepper_xc_festival                  = ("2017-09-29", ['Arkansas', 'Texas State']),
dellinger_byu_v_cal_poly                  = ("2017-09-29", ['BYU', 'Cal Poly']),
dellinger_byu_v_oregon                    = ("2017-09-29", ['Oregon', 'BYU']),
dellinger_byu_v_oregon_st                 = ("2017-09-29", ['BYU', 'Oregon State']),
dellinger_byu_v_portland                  = ("2017-09-29", ['BYU', 'Portland']),
dellinger_byu_v_stanford                  = ("2017-09-29", ['Stanford', 'BYU']),
dellinger_byu_v_uc_santa_barbara          = ("2017-09-29", ['BYU', 'UC Santa Barbara']),
dellinger_byu_v_washington                = ("2017-09-29", ['BYU', 'Washington']),
dellinger_cal_poly_v_oregon               = ("2017-09-29", ['Oregon', 'Cal Poly']),
dellinger_cal_poly_v_oregon_st            = ("2017-09-29", ['Oregon State', 'Cal Poly']),
dellinger_cal_poly_v_portland             = ("2017-09-29", ['Portland', 'Cal Poly']),
dellinger_cal_poly_v_stanford             = ("2017-09-29", ['Stanford', 'Cal Poly']),
dellinger_cal_poly_v_uc_santa_barbara     = ("2017-09-29", ['Cal Poly', 'UC Santa Barbara']),
dellinger_cal_poly_v_washington           = ("2017-09-29", ['Washington', 'Cal Poly']),
dellinger_oregon_state_v_portland         = ("2017-09-29", ['Portland', 'Oregon State']),
dellinger_oregon_state_v_stanford         = ("2017-09-29", ['Stanford', 'Oregon State']),
dellinger_oregon_state_v_uc_santa_barbara = ("2017-09-29", ['Oregon State', 'UC Santa Barbara']),
dellinger_oregon_state_v_washington       = ("2017-09-29", ['Washington', 'Oregon State']),
dellinger_oregon_v_oregon_state           = ("2017-09-29", ['Oregon', 'Oregon State']),
dellinger_oregon_v_portland               = ("2017-09-29", ['Oregon', 'Portland']),
dellinger_oregon_v_stanford               = ("2017-09-29", ['Oregon', 'Stanford']),
dellinger_oregon_v_uc_santa_barbara       = ("2017-09-29", ['Oregon', 'UC Santa Barbara']),
dellinger_oregon_v_washington             = ("2017-09-29", ['Oregon', 'Washington']),
dellinger_portland_v_stanford             = ("2017-09-29", ['Stanford', 'Portland']),
dellinger_portland_v_uc_santa_barbara     = ("2017-09-29", ['Portland', 'UC Santa Barbara']),
dellinger_portland_v_washington           = ("2017-09-29", ['Washington', 'Portland']),
dellinger_stanford_v_uc_santa_barbara     = ("2017-09-29", ['Stanford', 'UC Santa Barbara']),
dellinger_stanford_v_washington           = ("2017-09-29", ['Stanford', 'Washington']),
dellinger_uc_santa_barbara_v_washington   = ("2017-09-29", ['Washington', 'UC Santa Barbara']),
joe_piane_notre_dame_invitational         = ("2017-09-29", ['Colorado', 'New Mexico', 'North Carolina St.', 'Arkansas', 'Utah', 'Air Force', 'California', 'Ohio State', 'Eastern Michigan', 'Baylor', 'Florida State', 'Texas', 'Notre Dame', 'Washington St.', 'Pittsburgh', 'UTEP', 'Weber State', 'Alabama', 'TCU', 'Tulane']),
paul_short                                = ("2017-09-29", ['Utah State', 'Villanova', 'Georgia', 'Princeton', 'Cornell', 'Duke', 'Arizona', 'Penn', 'Georgia Tech', 'Miss State', 'Wake Forest', 'Richmond', 'Connecticut', 'Lehigh', 'Iona', 'Buffalo', 'Maryland', 'Army West Point', 'Tennessee', 'Navy', 'American', 'Delaware']),
cowboy_jamboree                           = ("2017-09-30", ['Ole Miss', 'Penn State', 'Missouri', 'Oklahoma State', 'Northwestern', 'Tulsa', 'Oklahoma', 'Stephen F. Austin']),
louisville_classic                        = ("2017-09-30", ['Boise State', 'Wisconsin', 'Furman', 'Minnesota', 'Northern Arizona', 'Eastern Kentucky', 'Louisville', 'West Virginia', 'Kentucky', 'Virginia Tech', 'Samford', 'Vanderbilt', 'North Carolina', 'Purdue', 'Marquette', 'Davidson', 'Oakland', 'Lipscomb', 'Central Michigan', 'UAB', 'Belmont']),
crimson_classic                           = ("2017-10-13", ['Georgia Tech', 'Miss State', 'Samford', 'Alabama', 'Texas A&M', 'Belmont', 'Oklahoma', 'North Florida', 'UAB', 'Southern Miss.', 'Florida State', 'Stephen F. Austin', 'Lipscomb']),
nuttycombe_wisconsin_invitational         = ("2017-10-13", ['New Mexico', 'San Francisco', 'North Carolina St.', 'Boise State', 'Providence', 'Furman', 'Washington', 'Stanford', 'Wisconsin', 'Minnesota', 'Michigan State', 'Columbia', 'Iowa State', 'Eastern Michigan', 'California', 'Utah', 'Indiana', 'Syracuse', 'Georgetown', 'Yale', 'Virginia', 'Air Force', 'Baylor', 'Notre Dame', 'UCLA', 'Kentucky', 'Purdue', 'Florida State', 'Colorado St.', 'Tulsa', 'Penn', 'Vanderbilt']),
penn_state_national_open                  = ("2017-10-13", ['Penn State', 'Villanova', 'Dartmouth', 'Princeton', 'Cornell', 'Oklahoma State', 'James Madison', 'West Virginia', 'North Carolina', 'Bucknell', 'Buffalo', 'William and Mary', 'Lehigh']),
adidas_di_pre_nationals                   = ("2017-10-14", ['Oregon', 'Colorado', 'Arkansas', 'Utah State', 'Michigan', 'Georgia', 'BYU', 'Eastern Kentucky', 'Ole Miss', 'Northern Arizona', 'Virginia Tech', 'Louisville', 'Ohio State', 'Duke', 'Arizona', 'Portland', 'Toledo', 'Abilene Christian', 'Northwestern', 'Wake Forest', 'Dayton', 'Arizona State', 'SMU', 'Missouri', 'Pittsburgh', 'Texas', 'Brown', 'UTEP', 'Kansas', 'Miami (Ohio)', 'Richmond', 'Iona', 'Tennessee', 'Weber State', 'Boston College', 'Creighton', 'Central Michigan', 'Tulane', 'UMass Lowell']),
acc_championships                         = ("2017-10-27", ['North Carolina St.', 'Louisville', 'Virginia Tech', 'Syracuse', 'Wake Forest', 'Notre Dame', 'Duke', 'Virginia', 'Florida State', 'Pittsburgh', 'North Carolina', 'Georgia Tech', 'Boston College']),
ivy_league_heptagonal_championships       = ("2017-10-27", ['Columbia', 'Dartmouth', 'Yale', 'Princeton', 'Cornell', 'Brown', 'Penn']),
mountain_west_championships               = ("2017-10-27", ['New Mexico', 'Boise State', 'Utah State', 'Air Force', 'Nevada', 'Colorado St.']),
pac_12_championships                      = ("2017-10-27", ['Colorado', 'Oregon', 'Stanford', 'Washington', 'California', 'Utah', 'Arizona', 'UCLA', 'Arizona State', 'Washington St.', 'Oregon State']),
sec_championships                         = ("2017-10-27", ['Arkansas', 'Georgia', 'Ole Miss', 'Missouri', 'Miss State', 'Kentucky', 'Alabama', 'Texas A&M', 'Vanderbilt', 'Tennessee']),
west_coast_conference                     = ("2017-10-27", ['San Francisco', 'BYU', 'Loyola Marymount', 'Portland']),
big_12_championships                      = ("2017-10-28", ['Iowa State', 'Oklahoma State', 'Texas', 'West Virginia', 'Baylor', 'Kansas', 'Oklahoma', 'TCU']),
big_east_championships                    = ("2017-10-28", ['Villanova', 'Providence', 'Georgetown', 'Marquette', 'Creighton']),
big_sky_championships                     = ("2017-10-28", ['Northern Arizona', 'Montana State', 'Southern Utah', 'Weber State', 'Idaho State']),
big_10_championships                      = ("2017-10-29", ['Michigan', 'Minnesota', 'Wisconsin', 'Penn State', 'Michigan State', 'Ohio State', 'Indiana', 'Northwestern', 'Purdue', 'Maryland', 'Iowa']),
)  # end dictionary of meets



## print out list of all teams (so you can inspect for typos)
#teamlist = {}
#for _,meet in regionals.items():
#  for team in meet:
#    teamlist[team] = True
#for _,meetpr in meets.items():
#  for team in meetpr[1]:
#    teamlist[team] = True
#for t in sorted(teamlist.keys()):
#  print(t)
#sys.exit()



class Meet:
  def __init__(self, name, teams, date="3000-01-01"):
    self.name = name
    self.date = date
    self.teams = teams  # in order of place
    self.team_scores = [0]*len(teams)  # ditto, currently unused
    self.loc = ""    # location, currently unused
    self.rosters = {}  # map team name to list of runner names, currently unused
    self.inds = []  # list of runner names in order of place, currently unused
    self.ind_scores = []  # list of runner scores (after taking out 8th+ runners), currently unused


new_regionals = {}
for rname, teamlist in regionals.items():
  m = Meet(rname + " regional", teamlist)
  new_regionals[rname] = m
regionals = new_regionals

new_meets = {}
for mname, pr in meets.items():
  m = Meet(mname, pr[1], pr[0])
  new_meets[mname] = m
meets = new_meets




# --------------------------------

class Data:
  def __init__(self, teamsin_, curr_inds_, pushes_used_, points_, messages_, dont_push_):
    self.teamsin = list(teamsin_)    # list of teams currently in
    self.curr_inds = dict(curr_inds_)    # current index in each regional we're considering (like 3rd or 4th)
    self.pushes_used = dict(pushes_used_)  # list of regions that we used the push in (so can't use it again)
    self.points = dict(points_)      # map team name to points scored
    self.messages = list(messages_)  # list of what to print out at the end
    self.dont_push = list(dont_push_)      # list of teams not to use the push on (because we're testing it out)
  def createCopy(self):
    return Data(self.teamsin, self.curr_inds, self.pushes_used, self.points, self.messages, self.dont_push)


# pick a team from the given region at the given index
# if awardpoints if false, then don't award any points for beating that team
# return a copy of data updated with this team selected.
def selectTeam(data,region,ind,awardpoints=True):
  d2 = data.createCopy()
  selected = regionals[region].teams[ind]
  d2.teamsin.append(selected)
  d2.curr_inds[region] += 1
  if not awardpoints:
    d2.messages.append(str(len(d2.teamsin)) + ": " + selected + " (#" + str(d2.curr_inds[region]) + " " + region + ") is selected, gives no points (pushed in)\n")
    return d2
  d2.messages.append(str(len(d2.teamsin)) + ": " + selected + " (#" + str(d2.curr_inds[region]) + " " + region + ") is selected")
  beatme = {}  # map meet to list of teams that beat me there
  for m,mobj in sorted(meets.items()):
    date = mobj.date
    l = mobj.teams
    if not selected in l:
      continue
    beatmetemp = []
    # iterate through teams that beat me here, but don't bother listing a team if it's already
    #   been selected or if it's in the top 2 in its region
    for t in l[:l.index(selected)]:
      addme = True
      if t in d2.teamsin:
        addme = False
      for regname,regobj in regionals.items():
        teamlist = regobj.teams
        if t == teamlist[0] or t == teamlist[1]:
          addme = False
      if addme:
        beatmetemp.append(t)
    if len(beatmetemp) > 0:
      beatme[m] = beatmetemp
  if len(beatme.keys()) == 0:
    d2.messages.append(", has no losses to teams remaining")
  else:
    d2.messages.append(", has losses to ")
    for m,l in beatme.items():
      d2.messages.append("(" + meets[m].name + ") " + ", ".join(l) + "; ")
      for ot in l: # award the points!!
        d2.points[ot] += 1
  d2.messages.append("\n")
  return d2


# get list of teams currently eligible to be selected
# for each region, check whether we've already used a push
# and for each potentially pushing team, see if they're on the "no-push" list
def getEligible(data):
  ans = []
  for rname,robj in regionals.items():
    l = robj.teams
    if data.curr_inds[rname] < len(l):
      ans.append(l[data.curr_inds[rname]])
      if len(data.teamsin) < 30 and not data.pushes_used[rname] and data.curr_inds[rname]+1 < len(l):
        if l[data.curr_inds[rname]+1] not in data.dont_push:
          ans.append(l[data.curr_inds[rname]+1])
  return sorted(ans, key=lambda k: data.points[k], reverse=True)

# print out the current status of everything
def printPoints(el,data):
  data.messages.append("\nTeams under consideration by points:\n")
  pts_to_teams = {}
  for e in el:
    pts = data.points[e]
    if pts in pts_to_teams:
      pts_to_teams[pts].append(e)
    else:
      pts_to_teams[pts] = [e]
  for pts,teamlist in sorted(pts_to_teams.items(), reverse=True):
    data.messages.append("  " + str(pts) + " "*(3-len(str(pts))) + ", ".join(teamlist) + "\n")
  data.messages.append("  Others with points: ")
  all_by_pts = sorted(data.points.keys(), key=lambda k: data.points[k], reverse=True)
  others = [t for t in all_by_pts if t not in el and t not in data.teamsin and data.points[t] >= 1]
  other_strlist = [t + " (" + str(data.points[t]) + ")" for t in others]
  data.messages.append(", ".join(other_strlist))
  data.messages.append("\n")


# given a list of tied teams and a data object, attempt to resolve ties
# by eliminating teams that definitely should not be selected
# the first tiebreaker is head-to-head
#  cannot select X ahead of Y if X has a losing record vs Y
# second is common opponents, which I interpret as
#  cannot select X ahead of Y if, of the teams that both faced,
#  X has more wins
def resolveTies(oldtied,d):
  tied = list(oldtied)
  if len(tied) == 1:
    return tied[0]

  # HEAD TO HEAD
  d.messages.append("  Breaking ties between " + ", ".join(tied) + " using head-to-head\n")
  lost = []
  # compare every pair of teams
  for i in range(len(tied)):
    ti = tied[i]
    for j in range(i+1,len(tied)):
      tj = tied[j]
      score = 0
      relevant = []
      for m,mobj in list(meets.items()) + list(regionals.items()):
        date = mobj.date
        teams = mobj.teams
        if ti in teams and tj in teams:
          dscore = 1 if teams.index(ti) < teams.index(tj) else -1
          relevant.append((date, m, dscore))
          score += dscore
      relevant.sort()  # sorts by date, earliest to latest
      if len(relevant) == 0:
        d.messages.append("  No head-to-head tiebreaker for " + ti + " and " + tj + "\n")
        continue
      elif score < 0:
        d.messages.append("  " + ti + " loses head-to-head vs " + tj + ", is not selected")
        lost.append(ti)
      elif score > 0:
        d.messages.append("  " + tj + " loses head-to-head vs " + ti + ", is not selected")
        lost.append(tj)
      else:
        dscore = relevant[-1][2]
        if dscore < 0:
          d.messages.append("  " + ti + " loses head-to-head vs " + tj + " (most recent matchup), is not selected")
          lost.append(ti)
        else:
          d.messages.append("  " + tj + " loses head-to-head vs " + ti + " (most recent matchup), is not selected")
          lost.append(tj)
      d.messages.append(" (" + ", ".join([r[1] for r in relevant]) + ")\n")
  for t in lost:
    if t in tied:
      tied.remove(t)
  if len(tied) == 1:
    return tied[0]  # this team won the head-to-head tiebreakers
  elif len(tied) == 0:
    d.messages.append("  Head-to-head tiebreaker eliminated all teams; ignoring.\n")
    tied = oldtied     # got some contradiction with head-to-head tiebreakers ...


  # COMMON OPPONENTS
  d.messages.append("  Breaking ties between " + ", ".join(tied) + " using common opponents\n")
  lost = []
  for i in range(len(tied)):
    ti = tied[i]
    for j in range(i+1,len(tied)):
      tj = tied[j]
      opps = {}  # maps teamname --> [i's wins, j's wins, times_faced_i, times_faced_j]
      for m,mobj in list(meets.items()) + list(regionals.items()):
        teams = mobj.teams
        if ti in teams:
          # add every team ahead of ti as having beaten ti
          for k in range(teams.index(ti)):
            if teams[k] not in opps:
              opps[teams[k]] = [0,0,0,0]
            opps[teams[k]][2] += 1  # they played i
          # add every team behind ti as having lost to ti
          for k in range(teams.index(ti)+1,len(teams)):
            if teams[k] not in opps:
              opps[teams[k]] = [0,0,0,0]
            opps[teams[k]][0] += 1  # i beat them
            opps[teams[k]][2] += 1  # they played i
        # do the same thing for tj
        if tj in teams:
          for k in range(teams.index(tj)):
            if teams[k] not in opps:
              opps[teams[k]] = [0,0,0,0]
            opps[teams[k]][3] += 1
          for k in range(teams.index(tj)+1,len(teams)):
            if teams[k] not in opps:
              opps[teams[k]] = [0,0,0,0]
            opps[teams[k]][1] += 1
            opps[teams[k]][3] += 1
      common_opps = {}
      for o,res in opps.items():
        if res[2] >= 1 and res[3] >= 1:
          common_opps[o] = res

      # now we have the list of common opponents
      if len(common_opps) == 0:
        d.messages.append("  No common opponents found for " + ti + ", " + tj)
      else:
        wins_i = sum([res[0] for o,res in common_opps.items()])
        wins_j = sum([res[1] for o,res in common_opps.items()])
        total_i = sum([res[2] for o,res in common_opps.items()])
        total_j = sum([res[3] for o,res in common_opps.items()])
        win_percent_i = float(wins_i) / float(total_i)
        win_percent_j = float(wins_j) / float(total_j)
        if win_percent_i > win_percent_j:
          d.messages.append("  " + tj + " loses common opponents vs " + ti + ", is not selected (win percentages: " + str(win_percent_i) + ", " + str(win_percent_j) + ")")
          lost.append(tj)
        elif win_percent_i < win_percent_j:
          d.messages.append("  " + ti + " loses common opponents vs " + tj + ", is not selected (win percentages: " + str(win_percent_j) + ", " + str(win_percent_i) + ")")
          lost.append(ti)
        else:
          d.messages.append("  Common opponents are tied for " + ti + ", " + tj + " (win percentages: " + str(win_percent_i) + ", " + str(win_percent_j) + ")")
        d.messages.append(" (common opponents: " + ', '.join([o for o,res in common_opps.items()]) + ")\n")

  for t in lost:
    if t in tied:
      tied.remove(t)
  if len(tied) == 1:
    return tied[0]  # got a winner!
  elif len(tied) == 0:
    d.messages.append("  Common opponent tiebreaker eliminated all teams; ignoring.\n")
    tied = oldtied  # got a contradiction


  # HIGHEST PLACE AT REGIONALS
  d.messages.append("  Breaking ties between " + str(tied) + " using highest place at regionals.\n")
  places = [20]*len(tied)  # just picked 20 as a high number
  for i,team in enumerate(tied):
    for rname,robj in regionals.items():
      reg = robj.teams
      if team in reg:
        places[i] = reg.index(team)
        break
  best_place = min(places)
  newtied = []
  for i,team in enumerate(tied):
    if places[i] == best_place:
      newtied.append(team)

  if len(newtied) == 1:
    d.messages.append("  Broke tie by selecting " + newtied[0] + " (highest regional finish).\n")
    return newtied[0]
  elif len(newtied) == 0:
    pass  # ?? shouldn't happen
  else:
    tied = newtied


  # CLOSEST TO 2ND SCORE AT REGIONALS
  d.messages.append("  Breaking ties between " + str(tied) + " using closest score to 2nd-place in region.\n")
  scored_diffs = [0]*len(tied)
  best_diff = 10000
  for i,team in enumerate(tied):
    for rname,robj in regionals.items():
      reg = robj.teams
      if team in reg:
        diff = robj.team_scores[reg.index(team)] - robj.team_scores[1]
        scored_diffs[i] = diff
        best_diff = min(best_diff, diff)
  newtied = [t for i,t in enumerate(tied) if scored_diffs[i] == best_diff]
  if len(newtied) == 1:
    d.messages.append("  Broke tie by selecting " + newtied[0] + " (closest score to regional 2nd-place).\n")
    return newtied[0]
  elif len(newtied) == 0:
    pass  # ?? shouldn't happen
  else:
    tied = newtied

  d.messages.append("  Could not break ties among " + ", ".join(newtied) + "!\n")
  return tied


# given a data object, a team ("winner") to be selected, and list of other eligible teams
# try to select this team
# if there is no push, then just select them and continue
# otherwise, hairy stuff
def doWinner(d,winner,el):
  regwin = [r for r in regionals.keys() if winner in regionals[r].teams][0]  # get the regional this team is in
  indwin = regionals[regwin].teams.index(winner)
  # if there is no push, select and continue
  if indwin == d.curr_inds[regwin]:
    d = selectTeam(d,regwin,indwin)
    return doSelection(d)
  # if not, then this is a push situation
  # first, we create a copy of the data object and continue running without this team being eligible
  # to do this, add it to the no-push list so it doesn't try to push in again later
  # we add the message that it gets in later on its own just because we assume
  # that it works (if not, we'll throw out this selection anyway)
  # then we call pickFrom(), which runs the entire rest of the process and returns
  # a data object that has all 31 teams selected.
  # we check if our team made it. If so, fine, return that data object; otherwise,
  # throw it out, do the push instead and continue with the process.
  tryme = list(el)
  tryme.remove(winner)
  d2 = d.createCopy()
  d2.messages.append(winner + " not selected with push (gets in later on their own)\n")
  d2.dont_push.append(winner)
  final = pickFrom(d2,tryme)
  if final is None: return None
  if winner in final.teamsin:
    return final  # they did get in on their own
  # they didn't get in on their own, so use the push and select both teams
  # the pushed team gives no points
  d = selectTeam(d,regwin,indwin-1,awardpoints=False)
  d = selectTeam(d,regwin,indwin)
  d.pushes_used[regwin] = True
  return doSelection(d)


# given a data object and list of eligible teams,
# pick a team, make a selection, and continue on with the rest of the process
def pickFrom(d,el):
  tied = [i for i in el if d.points[i]==d.points[el[0]]]
  winner = resolveTies(tied,d)
  # if resolveTies failed, it returns a list; we ask the user to manually break ties
  if isinstance(winner,list):
    print(''.join(d.messages) + "\n\n")
    results = []
    print("Couldn't break the tie, please pick from ", winner)
    while True:
      try:  # for python2
        w = raw_input()
      except NameError:
        w = input()
      if w in winner:
        break
      print("Not in list, select again")
    d2 = d.createCopy()
    d2.messages.append("Manually broke tie by picking " + w + "\n\n")
    return doWinner(d2,w,el)
  d.messages.append("\n")
  return doWinner(d,winner,el)


# do the next step of the selection!!
def doSelection(d):
  if len(d.teamsin) == 31:
    return d
  el = getEligible(d)
  printPoints(el,d)
  return pickFrom(d,el)






# --------------------------------


# Start from a blank slate
curr_inds = {}
pushes_used = {}
points = {}
for r,l in sorted(regionals.items()):
  curr_inds[r] = 0
  pushes_used[r] = False
  for t in l.teams:
    points[t] = 0
for m,l in meets.items():
  for t in l.teams:
    points[t] = 0
data = Data([],curr_inds,pushes_used,points,[],[])

# Select automatically the top two in each region
data.messages.append("Automatically selected:\n")
for r,l in sorted(regionals.items()):
  data = selectTeam(data,r,0)
  data = selectTeam(data,r,1)

# Select at-large teams
results = doSelection(data)
if results is None:
  print("There was an error!!")
else:
  print("\nTeams selected:\n")
  for i,t in enumerate(results.teamsin):
    print("%4s %s" % ((i+1),t))
  print("")
  print("")
  print(''.join(results.messages))
