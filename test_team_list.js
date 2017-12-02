import db from './helpers/db';

export const getTeam = (id) => {
  db.get().query(`SELECT * FROM Team WHERE id=?`, [id], (err, rows) => {
    console.log(rows);
  });
};

export default async () => {
	return new Promise((resolve, reject) => {
		getTeam("df");
		if (err) {
			reject({
				code: 'some_unique_code',
				message: 'some error message'
			});
		}
		resolve([ /* Array of teams */ ]);
	})
}
