-- In this file we define the schema for the database and create the tables.
-- You can run the file with the following command:
--
--     mysql -u root -p atlargetest < seed.sql

-- First we make sure our database exists and drop any existing tables.
DROP TABLE IF EXISTS Team, User, Admin, Meet, Participates, RegionalRank;

-- User's are useful in web applications for handling API permissions, and 
-- in the future we may want to add the ability to associate certain data
-- with the user. For now it is just for the purposes of loggin in / out
CREATE TABLE User (
  email varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  hash varchar(255) NOT NULL,
  PRIMARY KEY (email)
);
-- Notion of an admin that can make certain queries (adding / removing 
-- teams, etc) that a regular user cannot
CREATE TABLE Admin (
  email varchar(255) NOT NULL REFERENCES User(email),
  PRIMARY KEY (email)
);
-- Description of Team
CREATE TABLE Team (
  ID int NOT NULL AUTO_INCREMENT,
  name varchar(255),
  gender ENUM('mens', 'womens'),
  region varchar(255),
  PRIMARY KEY (ID)
);
-- Description of Meet
CREATE TABLE Meet (
  ID int NOT NULL AUTO_INCREMENT,
  name varchar(255),
  date datetime,
  PRIMARY KEY (ID)
);
-- Description of Participates
CREATE TABLE Participates (
  team_id int NOT NULL REFERENCES Team(id),
  meet_id int NOT NULL REFERENCES Meet(id),
  placement int,
  PRIMARY KEY (team_id, meet_id)
);
-- Description of Participates
CREATE TABLE RegionalRank (
  team_id int NOT NULL REFERENCES Team(id),
  rank int,
  PRIMARY KEY (team_id)
);

--------------------------------------------------------------
------------------------ SAMPLE DATA -------------------------
--------------------------------------------------------------
INSERT INTO Team (name, gender, region) VALUES 
  ('Duke', 'mens', 'Southern');