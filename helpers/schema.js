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
    region_id int NOT NULL REFERENCES Region(id),
    gender ENUM('mens', 'womens') NOT NULL,
    PRIMARY KEY (ID),
    UNIQUE(name, gender)
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
  CREATE TABLE RegionalRank (
    team_id int NOT NULL REFERENCES Team(id),
    region_id int NOT NULL REFERENCES Region(id),
    rank int NOT NULL,
    PRIMARY KEY (team_id)
  )
`,
  `
  CREATE TABLE Meet (
    ID int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    date varchar(255) NOT NULL,
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

export const Views = [];

const asyncQuery = (conn, query) => {
  return new Promise((resolve, reject) => {
    conn.query(query, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const executeQueries = async (conn, queryArray) => {
  return new Promise(async (resolve, reject) => {
    for (let query of queryArray) {
      try {
        await asyncQuery(conn, query);
      } catch (err) {
        reject(err);
      }
    }
    resolve();
  });
};

// This is what callback hell looks like - should use async / await
export const seed = mode => {
  // Create a separate connection for creating the database
  const initialConnection = mysql.createConnection({
    host: mode === MODE_PRODUCTION ? process.env.PRODUCTION_HOST : 'localhost',
    user: mode === MODE_PRODUCTION ? process.env.MYSQL_USERNAME : 'root',
    password: process.env.MYSQL_PASSWORD,
  });

  const seedConnection = mysql.createConnection({
    host: mode === MODE_PRODUCTION ? process.env.PRODUCTION_HOST : 'localhost',
    user: mode === MODE_PRODUCTION ? process.env.MYSQL_USERNAME : 'root',
    password: process.env.MYSQL_PASSWORD,
    database: mode === MODE_PRODUCTION ? PRODUCTION_DB : TEST_DB,
  });

  return new Promise(async (resolve, reject) => {
    try {
      await executeQueries(initialConnection, createDatabaseQueries);
      initialConnection.end();
      await executeQueries(seedConnection, Schemas);
      await executeQueries(seedConnection, Views);
      seedConnection.end();
    } catch (err) {
      console.log(err);
    }
  });
};
