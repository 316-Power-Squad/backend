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
];

export const dropQuery = `DROP TABLE IF EXISTS Teams, Users`;

export const Schemas = [
  `
  CREATE TABLE Teams (
    ID int NOT NULL AUTO_INCREMENT,
    name varchar(255),
    PRIMARY KEY (ID)
  )
`,
  `
  CREATE TABLE Users (
    email varchar(255),
    name varchar(255),
    hash varchar(255),
    PRIMARY KEY (email)
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
