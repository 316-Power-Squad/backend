/**
 * In this file we define the schema for the database. We also provide a function for 
 * intitializing the schema. Need to worry about updating the schema as well (migrations)
 */
import async from 'async';
import db from './db';

// Put all table creation code here. Make sure to include the line where we drop
// the table if it exists - otherwise our create table query will fail

export const dropQuery = `DROP TABLE IF EXISTS Team`;

export const Schemas = [
  `
  CREATE TABLE Team (
    ID int NOT NULL AUTO_INCREMENT,
    name varchar(255),
    PRIMARY KEY (ID)
  );
`,
];

// This is what callback hell looks like - should use async / await
export const seed = (mode, done) => {
  db.connect(mode, err => {
    if (err) done(err);
    else {
      db.get().query(dropQuery, err => {
        if (err) done(err);
        else {
          async.each(
            Schemas,
            schema => {
              db.get().query(schema, err => {
                done(err);
              });
            },
            done
          );
        }
      });
    }
  });
};
