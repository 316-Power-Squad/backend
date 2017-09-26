/**
 * In this file we define the schema for the database. We also provide a function for 
 * intitializing the schema. Need to worry about updating the schema as well (migrations)
 */
import db, { MODE_TEST, MODE_PRODUCTION } from './helpers/db';

// Put all table creation code here. Right now it is kinda crappy because
// you need to drop the table every time you make a change. If we were using a dbms
// this would be much easier
export const Schema = `
  CREATE TABLE Team (
    ID int NOT NULL AUTO_INCREMENT,
    name varchar(255),
    PRIMARY KEY (ID)
  );
`;

db.connect(MODE_TEST, err => {
  if (err) {
    console.log(err);
    db.disconnect();
  } else {
    db.get().query(Schema, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Initialized the database');
      }
      db.disconnect();
    });
  }
});
