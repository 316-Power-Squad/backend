/**
 * In this file we define the schema for the database. We also provide a function for 
 * intitializing the schema. Need to worry about updating the schema as well (migrations)
 */
import async from 'async';
import mysql from 'mysql';
import db from './db';

// Put all table creation code here. Make sure to include the line where we drop
// the table if it exists - otherwise our create table query will fail

export const createDatabaseQueries = [
  `CREATE DATABASE IF NOT EXISTS atlargetest`,
  `CREATE DATABASE IF NOT EXISTS atlargeprod`,
  `DROP VIEW IF EXISTS TeamWithRegion`,
];

export const dropQuery = `DROP TABLE IF EXISTS Team, Region, TeamInRegion, User, Admin, Meet, Participates`;

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
    name varchar(255),
    PRIMARY KEY (ID),
    UNIQUE(name)
  )
`,
  `
  CREATE TABLE Meet (
    ID int NOT NULL AUTO_INCREMENT,
    name varchar(255),
    date date,
    PRIMARY KEY (ID)
  )
`,
  `
  CREATE TABLE Participates (
    team_id int NOT NULL REFERENCES Team(id),
    meet_id int NOT NULL REFERENCES Meet(id),
    placement int,
    PRIMARY KEY (team_id, meet_id)
  )
`,
];

const dropAndReseed = done => {
  db.get().query(dropQuery, err => {
    if (err) done(err);
    else {
      async.each(
        Schemas,
        (schema, cb) => {
          db.get().query(schema, cb);
        },
        done
      );
    }
  });
};

// Create a separate connection for creating the database
const initialConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.MYSQL_PASSWORD,
});

// This is what callback hell looks like - should use async / await
export const seed = (mode, done) => {
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
          dropAndReseed(done);
        }
      );
    }
  });
};
