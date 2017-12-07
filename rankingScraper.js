import request from 'request';
import cheerio from 'cheerio';
import db, { MODE_TEST, MODE_PRODUCTION } from './helpers/db';

const specialCases = new Map([
  ['Miami (Ohio)', 'Miami OH'],
  ['Boston University', 'Boston U'],
  ['Dartmouth', 'Dartmouth College'],
  ['Manhattan', 'Manhattan College'],
  ['Ole Miss', 'Mississippi'],
  ['UT Martin', 'Tennessee Martin'],
  ['ETSU', 'East Tenn St'],
  ['Louisiana-Lafayette', 'UL Lafayette'],
  ['NC State', 'North Carolina St'],
  ['Middle Tennessee', 'Mid Tenn St'],
  [`Saint Joseph’s`, 'St Josephs PA'],
]);

const dbMode =
  process.argv[process.argv.length - 1] === 'prod'
    ? MODE_PRODUCTION
    : MODE_TEST;

const fetchRankings = gender => {
  return new Promise(async (resolve, reject) => {
    const urls = await getMostRecentUrls();
    const url = gender === 'womens' ? urls[0] : urls[1];
    request(url, (err, resp, body) => {
      if (!err && resp.statusCode == 200) {
        let $ = cheerio.load(body);
        let regionName = '';
        let teamName = '';
        let counter = 0;
        $('td').each(async function(i, elem) {
          if ($(this).attr('bgcolor') === '#A6CAFF') {
            counter = 0;
            regionName = $(this)
              .text()
              .toLowerCase();
          }
          if (counter >= 15) return;
          if (
            $(this)
              .children()
              .first()
              .attr('target') === '_blank'
          ) {
            teamName = $(this)
              .children()
              .first()
              .text();
            counter++;

            if (regionName !== '' && teamName !== '') {
              try {
                // If there is a naming disparity look it up
                const team = specialCases.has(teamName)
                  ? specialCases.get(teamName)
                  : teamName;
                await insertRank(team, gender, regionName, counter);
              } catch (err) {
                // console.log(`Failed from team ${team}, ${gender}`);
                console.log(err);
              }
            }
          }
        });
        resolve();
      } else {
        reject(err);
      }
    });
  });
};

const insertRank = async (team, gender, region, rank) => {
  const lastIndex = region.lastIndexOf(' ');
  let actualRegion = region.substring(0, lastIndex);
  console.log(
    `Inserting a team ${team} with region ${actualRegion} and rank ${rank}`
  );
  return new Promise((resolve, reject) => {
    db.get().query(
      `INSERT INTO RegionalRank (team_id, region_id, rank) values (
          ( SELECT id from Team WHERE Team.name=? AND Team.gender=? ), 
          ( SELECT id from Region WHERE Region.name=? ), 
          ?
        )`,
      [team, gender, actualRegion, rank],
      err => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};

// line 5 shouldn't be hardcoded -- in the future it should call a helper message like the following to get the url

const getMostRecentUrls = async () => {
  return new Promise((resolve, reject) => {
    let urls = [];
    let sourceUrl =
      'http://www.ustfccca.org/category/rankings-polls/cross-country-polls/div-1-cross-country';
    request(sourceUrl, async (err, resp, body) => {
      if (!err && resp.statusCode == 200) {
        let $ = cheerio.load(body);
        let allArchivesDiv = $('div[class=facetwp-template]');
        let paragraphs = allArchivesDiv.children();
        paragraphs.each(function(i, elem) {
          let link = $(this)
            .children()
            .first();
          if (link !== undefined) {
            let url = link.attr('href');
            if (url !== undefined && url.indexOf('regional') > -1) {
              urls.push(url);
            } else if (url !== undefined && url.indexOf('region') > -1) {
              urls.push(url);
              resolve(urls);
            }
          }
        });
      } else {
        console.log(resp.statusCode);
        reject(err);
      }
    });
  });
};

const insertRankings = mode => {
  db.connect(mode, async () => {
    await fetchRankings('mens');
    await fetchRankings('womens');
    db.disconnect();
  });
};

insertRankings(dbMode);
