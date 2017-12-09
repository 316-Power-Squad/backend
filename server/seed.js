import { seed } from './helpers/schema';
import db, { MODE_PRODUCTION, MODE_TEST } from './helpers/db';

const mode =
  process.argv[process.argv.length - 1] === 'prod'
    ? MODE_PRODUCTION
    : MODE_TEST;

seed(mode, err => {
  if (err) console.log(err);
  db.disconnect();
});
