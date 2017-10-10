-- This file contains the queries that will represent the API for the site

-- Getting a user's password hash to check that it matches. On the server
-- we then pass back a JWT token to the frontend so that their subsequent
-- calls to the API are authenticated
SELECT hash
FROM User
WHERE email='test@example.com';

-- Get all teams and their rank in a given region (in this case the northeast)
SELECT team_name, team_rank
FROM TeamWithRegion
WHERE region='northeast';

-- Get all meets that a team participated in (in this case louiville)
SELECT Meet.name
FROM Meet, Participates
WHERE Meet.id = Participates.meet_id AND 
  Participates.team_id = (
    SELECT id FROM Team WHERE Team.name='louisville'
  );

-- Getting all the teams that competed in a given meet for a given
-- gender (in this case men's battle in beantown)
SELECT Team.name AS team_name, placement
FROM Team, Meet, Participates
WHERE Meet.name='battle_in_beantown' AND
  Team.gender='mens' AND
  Team.id = Participates.team_id AND
  Meet.id = Participates.meet_id
ORDER BY Participates.placement;

-- Getting the top 2 teams from each region (we assume that these are the
-- two teams that are getting automatic bids to nationals)
SELECT t1.team_name, t1.region, t1.team_rank  
FROM TeamWithRegion AS t1 JOIN TeamWithRegion AS t2
  ON t1.region = t2.region AND 
    t1.team_rank < t2.team_rank
  GROUP BY t1.team_name, t1.region, t1.team_rank
  HAVING COUNT(*) <= 2
  ORDER BY t1.region, t1.team_rank;