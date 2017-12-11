# Backend

## Setup

First run `npm install` or `yarn` in the root of the project to install the
dependencies. Then install mysql (follow instructions at
https://gist.github.com/nrollr/3f57fc15ded7dddddcc4e82fe137b58e). Login with
`mysql -u root -p` and type in the password you set in the instructions. Also
save the password in your environment as MYSQL_PASSWORD (as in put the following
line in your ~/.bashrc: `export MYSQL_PASSWORD='blah'`. If you are running in
prod mode you will need to also specify `MYSQL_USERNAME`, `PRODUCTION_DB`, and
`DATABASE_HOST` in your environment, otherwise it will assume the values
localhost, atlargetest, and localhost. You can then run `npm run seed` (or `yarn
seed`) to create the testing databases. To run the commands in prod set the
`NODE_ENV` evironment variable to "production". The seed command essentially
runs `helpers/schema.js`, which executes some `CREATE DATABASE` and `CREATE
TABLE` queries. By default we seed the test database.

## Authentication

The API uses JWT authentication for handing users. You will need the variable
`JWT_SECRET` in your path for auth to work. The value doesn't really matter as
long as it is suffiently random and only you know it. Users must first create an
account with the `/auth/new` call and then login with the `/auth/login` call.
Both are POST requests. On success, the login call returns a JWT token which
should be placed in the header as `x-access-token` for all subsequent API calls.
The frontend repo handles all of this automatically.

## Running scraper.js file

This node.js file makes use of the cheerio.js library. In order to run this
scraping file, run the following command: `npm run scrape` or `yarn scrape`.
Essentially, we scrape each Division 1 team from Wikipedia, then using that
information, we scrape each team's page on tfrrs.org. We then store all those
results in a set, and then from there we can iterate over and scrape every
result page for the men's and women's results.

## Scraping Regional Ranks

We scrape the regional rankings of the teams separately as these are updated
regularly. To run this file run `yarn scrapeRanks`. Note that the terminal will
hang after completion, you can simply exit out after it finishes.

## Running the Kolas Algorithm

The file `kolasAlgorithm.js` contains the algorithm that actually decides which
teams should make it to nationals based on the current rankings. You can run
this locally with `yarn rank test`.

## Running the server

You can run a dev server with `yarn dev` to devolop the API. To run the
production server, build the app with `yarn build`. You can then run `yarn
start` which runs the compiled index file in the build/ directory. Note that
based on the value of `NODE_ENV` the app will use either the local or production
database.
