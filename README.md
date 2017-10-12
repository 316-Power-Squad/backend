# Backend

## Setup

First run `npm install` or `yarn` in the root of the project to install the dependencies. Then install mysql (follow instructions at https://gist.github.com/nrollr/3f57fc15ded7dddddcc4e82fe137b58e). Login with `mysql -u root -p` and type in the password you set in the instructions. Also save the password in your environment as MYSQL_PASSWORD (as in put the following line in your ~/.bashrc: `export MYSQL_PASSWORD='blah'`. You can then run `npm run seed` (or `yarn seed`) to create the testing and prod databases. This essentially runs `helpers/schema.js`, which executes some `CREATE DATABASE` and `CREATE TABLE` queries. By default we seed the test database. To seed the production database change the parameter passed into seed in `seed.js`.

## Authentication

The API uses JWT authentication for handing users. You will need the variable `JWT_SECRET` in your path for auth to work (message Zac for details on this). Users must first create an account with the `/auth/new` call and then login with the `/auth/login` call. Both are POST requests. On success, the login call returns a JWT token which should be placed in the header as `x-access-token` for all subsequent API calls.

Finally, you can run `npm start` or `yarn start`, which will start a dev server that watches for file changes and restarts on change. The API should be accessible on `localhost:3001`;

## Running scraper.js file

This node.js file makes use of the cheerio.js library. In order to run this scraping file, navigate to the backend/helpers/ directory then run the following command: `npm run scrape`. Currently, the scraping scrapes against one result file for testing purposes, but a slight change will allow us to scrape all result files found through our scraping. Essentially, we scrape each Division 1 team from Wikipedia, then using that information, we scrape each team's page on tfrrs.org. We then store all those results in a set, and then from there we can iterate over and scrape every result page for the men's and women's results. 