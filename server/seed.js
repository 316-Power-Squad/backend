import { seed } from './helpers/schema';
import db, { MODE_PRODUCTION, MODE_TEST } from './helpers/db';

const mode =
  process.env.NODE_ENV === 'production' ? MODE_PRODUCTION : MODE_TEST;

seed(mode, err => {
  if (err) console.log(err);
  db.disconnect();
});
