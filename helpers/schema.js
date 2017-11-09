/**
 * In this file we define the schema for the database. We also provide a function for 
 * intitializing the schema. Need to worry about updating the schema as well (migrations)
 */
import async from 'async';
import mysql from 'mysql';
import db, { MODE_TEST, MODE_PRODUCTION, TEST_DB, PRODUCTION_DB } from './db';

// Put all table creation code here. Make sure to include the line where we drop
// the table if it exists - otherwise our create table query will fail

export const createDatabaseQueries = [
  `DROP DATABASE IF EXISTS atlargetest`,
  `DROP DATABASE IF EXISTS atlargeprod`,
  `CREATE DATABASE atlargetest`,
  `CREATE DATABASE atlargeprod`,
];

export const Schemas = [
  `
  CREATE TABLE User (
    email varchar(255) NOT NULL,
    name varchar(255) NOT NULL,
    hash varchar(255) NOT NULL,
    PRIMARY KEY (email)
  )
`,
  `
  CREATE TABLE Team (
    ID int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    gender ENUM('mens', 'womens') NOT NULL,
    PRIMARY KEY (ID),
    UNIQUE(name, gender)
  )
`,
  `
  CREATE TABLE TeamInRegion (
    team_id int NOT NULL REFERENCES Team(id),
    region_id int NOT NULL REFERENCES Region(id),
    team_rank int NOT NULL,
    PRIMARY KEY (team_id, region_id)
  )
`,
  `
  CREATE TABLE Region (
    ID int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    PRIMARY KEY (ID),
    UNIQUE(name)
  )
`,
  `
  CREATE TABLE Meet (
    ID int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    PRIMARY KEY (ID)
  )
`,
  `
  CREATE TABLE Participates (
    team_id int NOT NULL REFERENCES Team(id),
    meet_id int NOT NULL REFERENCES Meet(id),
    placement int NOT NULL,
    PRIMARY KEY (team_id, meet_id)
  )
`,
];

export const Views = [
  `
  CREATE VIEW TeamWithRegion AS (
    SELECT Team.name AS team_name, Team.gender, TeamInRegion.team_rank, Region.name AS region 
    FROM Team, TeamInRegion, Region 
    WHERE Team.id = TeamInRegion.team_id AND TeamInRegion.region_id = Region.id
  )
`,
];

// Create a separate connection for creating the database
const initialConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.MYSQL_PASSWORD,
});

// This is what callback hell looks like - should use async / await
export const seed = (mode, done) => {
  const seedConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: mode === MODE_PRODUCTION ? PRODUCTION_DB : TEST_DB,
  });

  const reseed = done => {
    async.each(
      Schemas,
      (schema, cb) => {
        seedConnection.query(schema, cb);
      },
      done
    );
  };

  const createViews = done => {
    async.each(
      Views,
      (viewQuery, cb) => {
        seedConnection.query(viewQuery, cb);
      },
      () => {
        seedConnection.end();
        done();
      }
    );
  };

  db.connect(mode, err => {
    if (err) done(err);
    else {
      async.each(
        createDatabaseQueries,
        (databaseQuery, cb) => {
          initialConnection.query(databaseQuery, cb);
        },
        () => {
          initialConnection.end();
          reseed(() => {
            createViews(done);
          });
        }
      );
    }
  });
};
