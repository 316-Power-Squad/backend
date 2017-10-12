-- In this file we define the schema for the database and create the tables.
-- You can run the file with the following command:
--
--     mysql -u root -p atlargetest < seed.sql

-- First we make sure our database exists and drop any existing tables.
DROP TABLE IF EXISTS Team, Region, TeamInRegion, AppUser, Admin, Meet, Participates;
DROP VIEW IF EXISTS TeamWithRegion;

-- AppUser's are useful in web applications for handling API permissions, and 
-- in the future we may want to add the ability to associate certain data
-- with the AppUser. For now it is just for the purposes of loggin in / out
CREATE TABLE AppUser (
  email varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  hash varchar(255) NOT NULL,
  PRIMARY KEY (email)
);
-- Description of Team
CREATE TABLE Team (
  ID int NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  gender ENUM('mens', 'womens') NOT NULL,
  PRIMARY KEY (ID)
);
-- Description of TeamInRegion
CREATE TABLE TeamInRegion (
  team_id int NOT NULL REFERENCES Team(id),
  region_id int NOT NULL REFERENCES Region(id),
  team_rank int NOT NULL,
  PRIMARY KEY (team_id, region_id)
);
-- Description of Region
CREATE TABLE Region (
  ID int NOT NULL AUTO_INCREMENT,
  name varchar(255),
  PRIMARY KEY (ID)
);
-- Description of Meet
CREATE TABLE Meet (
  ID int NOT NULL AUTO_INCREMENT,
  name varchar(255),
  date date,
  PRIMARY KEY (ID)
);
-- Description of Participates
CREATE TABLE Participates (
  team_id int NOT NULL REFERENCES Team(id),
  meet_id int NOT NULL REFERENCES Meet(id),
  placement int NOT NULL,
  PRIMARY KEY (team_id, meet_id)
);

-- VIEWS
CREATE VIEW TeamWithRegion AS (
  SELECT Team.name AS team_name, Team.gender, TeamInRegion.team_rank, Region.name AS region 
  FROM Team, TeamInRegion, Region 
  WHERE Team.id = TeamInRegion.team_id AND TeamInRegion.region_id = Region.id
);

-- SAMPLE DATA 
INSERT INTO AppUser (email, name, hash) VALUES 
  ('test@example.com', 'Test User', 'hash1'),
  ('test2@example.com', 'Test2 User', 'hash2');

INSERT INTO Region (name) VALUES
  ('northeast'),
  ('midatlantic'),
  ('southeast'),
  ('south'),
  ('southcentral'),
  ('greatlakes'),
  ('midwest'),
  ('mountain'),
  ('west');

INSERT INTO Team (name, gender) VALUES 
  ('syracuse', 'mens'),
  ('iona', 'mens'),
  ('cornell', 'mens'),
  ('georgetown', 'mens'),
  ('penn', 'mens'),
  ('villanova', 'mens'),
  ('louisville', 'mens'),
  ('virginia', 'mens'),
  ('eastern kentucky', 'mens');

INSERT INTO TeamInRegion (team_id, region_id, team_rank) VALUES
  (1, 1, 1),
  (2, 1, 2),
  (3, 1, 3),
  (4, 2, 1),
  (5, 2, 2),
  (6, 2, 3),
  (7, 3, 1),
  (8, 3, 2),
  (9, 3, 3);

INSERT INTO Meet (name, date) VALUES
  ('battle_in_beantown', '2017-09-10'),
  ('panorama_farms', '2017-09-18'),
  ('princeton_invitational', '2017-09-30'),
  ('paul_short', '2017-10-10');

INSERT INTO Participates (team_id, meet_id, placement) VALUES
  (1, 1, 1),
  (2, 1, 2),
  (3, 1, 3),
  (4, 2, 3),
  (5, 2, 2),
  (6, 2, 1),
  (6, 3, 1),
  (2, 3, 2),
  (9, 3, 3),
  (7, 3, 4),
  (7, 4, 1),
  (8, 4, 3),
  (9, 4, 2);