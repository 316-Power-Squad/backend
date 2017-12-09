import request from 'request-promise';
import cheerio from 'cheerio';
import db, { MODE_TEST, MODE_PRODUCTION } from './helpers/db';

const dbMode =
  process.env.NODE_ENV === 'production' ? MODE_PRODUCTION : MODE_TEST;

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
  ['Saint Joseph’s', 'St Josephs PA'],
  ['Ohio State', 'Ohio State University'],
  ['Maryland', 'Maryland College Park'],
  ['Loyola-Chicago', 'Loyola University Chicago'],
  ['Nevada', 'Nevada Las Vegas'],
  ['Mississippi State', 'Mississippi Valley State'],
  ['Southern Miss', 'Southern Mississippi'],
  ['UAB', 'Alabama Birmingham'],
  ['SMU', 'Southern Methodist'],
  ['TCU', 'Texas Christian'],
  ['Texas A&M-Corpus Christi', 'Texas A&M University–Corpus Christi'],
  ['Stephen F. Austin', 'Stephen F. Austin State'],
  ['Davidson', 'Davidson College'],
]);

const fetchRankings = (url, gender) => {
  return new Promise(async (resolve, reject) => {
    const response = await request({ uri: url, resolveWithFullResponse: true });
    if (response.statusCode !== 200) reject('Incorrect status');
    let $ = cheerio.load(response.body);
    let regionName = '';
    let teamName = '';
    let counter = 0;
    let regionCount = 0;
    $('td').each(async function(i, elem) {
      if (['#f2dddc', '#A6CAFF'].includes($(this).attr('bgcolor'))) {
        counter = 0;
        regionCount++;
        regionName = $(this)
          .text()
          .toLowerCase();
      }
      if (counter >= 15) {
        if (regionCount > 8) resolve();
        return;
      }
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
            reject(err);
          }
        }
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
  // if (gender === 'womens') console.log('womens team inserted');
  return new Promise((resolve, reject) => {
    db.get().query(
      `INSERT INTO RegionalRank (team_id, region_id, rank) values (
          ( SELECT id from Team WHERE Team.name=? AND Team.gender=? ), 
          ( SELECT id from Region WHERE Region.name=? ), 
          ?
        )`,
      [team, gender, actualRegion, rank],
      err => {
        if (err) {
          console.log(err);
          reject(err);
        } else resolve();
      }
    );
  });
};

// line 5 shouldn't be hardcoded -- in the future it should call a helper message like the following to get the url

const getMostRecentUrls = async () => {
  return new Promise(async (resolve, reject) => {
    let urls = [];
    let sourceUrl =
      'http://www.ustfccca.org/category/rankings-polls/cross-country-polls/div-1-cross-country';
    const response = await request({
      uri: sourceUrl,
      resolveWithFullResponse: true,
    });
    if (response.statusCode !== 200) reject('Incorrect status code');
    let $ = cheerio.load(response.body);
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
  });
};

const insertRankings = mode => {
  db.connect(mode, async () => {
    try {
      const urls = await getMostRecentUrls();
      await fetchRankings(urls[1], 'mens');
      await fetchRankings(urls[0], 'womens');
    } catch (err) {
      console.log(err);
    }
  });
};

insertRankings(dbMode);
