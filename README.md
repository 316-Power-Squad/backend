# Backend

## Setup

First run `npm install` or `yarn` in the root of the project to install the dependencies. Then install mysql (follow instructions at https://gist.github.com/nrollr/3f57fc15ded7dddddcc4e82fe137b58e). Login with `mysql -u root -p` and type in the password you set in the instructions. Also save the password in your environment as MYSQL_PASSWORD (as in put the following line in your ~/.bashrc: `export MYSQL_PASSWORD='blah'`. You can then run `npm run seed` (or `yarn seed`) to create the testing and prod databases. This essentially runs `helpers/schema.js`, which executes some `CREATE DATABASE` and `CREATE TABLE` queries. By default we seed the test database. To seed the production database change the parameter passed into seed in `seed.js`.

## Authentication

The API uses JWT authentication for handing users. You will need the variable `JWT_SECRET` in your path for auth to work (message Zac for details on this). Users must first create an account with the `/auth/new` call and then login with the `/auth/login` call. Both are POST requests. On success, the login call returns a JWT token which should be placed in the header as `x-access-token` for all subsequent API calls.

Finally, you can run `npm start` or `yarn start`, which will start a dev server that watches for file changes and restarts on change. The API should be accessible on `localhost:3001`;