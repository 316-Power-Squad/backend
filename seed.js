import { seed } from './helpers/schema';
import db, { MODE_PRODUCTION, MODE_TEST } from './helpers/db';

// Change this to production to seed the production database
seed(MODE_TEST, err => {
  if (err) console.log(err);
  db.disconnect();
});
