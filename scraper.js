import request from 'request';
import cheerio from 'cheerio';
import db, { MODE_TEST } from './helpers/db';

let urls = [];
// ex. https://www.tfrrs.org/teams/xc/NC_college_m_Duke.html
let teamBaseUrl = 'https://www.tfrrs.org/teams/xc/';

//ex. https://www.tfrrs.org/results/xc/11563.html
let resultBaseUrl = 'https://www.tfrrs.org/results/xc/';

const notTitle = function(s) {
  if (
    s == 'Primary Conference' ||
    s == 'Making Transition' ||
    s == 'Full Membership' ||
    s == 'Future Conference'
  ) {
    return false;
  }
  if (
    s == 'Savannah State University' ||
    s == 'California Baptist University' ||
    s == 'North Alabama !University of North Alabama'
  ) {
    return false;
  }
  return true;
};

const getAbbrev = function(state) {
  const states = new Map([
    ['Arizona', 'AZ'],
    ['Alabama', 'AL'],
    ['Alaska', 'AK'],
    ['Arizona', 'AZ'],
    ['Arkansas', 'AR'],
    ['California', 'CA'],
    ['Colorado', 'CO'],
    ['Connecticut', 'CT'],
    ['Delaware', 'DE'],
    ['Florida', 'FL'],
    ['Georgia', 'GA'],
    ['Hawaii', 'HI'],
    ['Idaho', 'ID'],
    ['Illinois', 'IL'],
    ['Indiana', 'IN'],
    ['Iowa', 'IA'],
    ['Kansas', 'KS'],
    ['Kentucky', 'KY'],
    ['Kentucky', 'KY'],
    ['Louisiana', 'LA'],
    ['Maine', 'ME'],
    ['Maryland', 'MD'],
    ['Massachusetts', 'MA'],
    ['Michigan', 'MI'],
    ['Minnesota', 'MN'],
    ['Mississippi', 'MS'],
    ['Missouri', 'MO'],
    ['Montana', 'MT'],
    ['Nebraska', 'NE'],
    ['Nevada', 'NV'],
    ['New Hampshire', 'NH'],
    ['New Jersey', 'NJ'],
    ['New Mexico', 'NM'],
    ['New York', 'NY'],
    ['North Carolina', 'NC'],
    ['North Dakota', 'ND'],
    ['Ohio', 'OH'],
    ['Oklahoma', 'OK'],
    ['Oregon', 'OR'],
    ['Pennsylvania', 'PA'],
    ['Rhode Island', 'RI'],
    ['South Carolina', 'SC'],
    ['South Dakota', 'SD'],
    ['Tennessee', 'TN'],
    ['Texas', 'TX'],
    ['Utah', 'UT'],
    ['Vermont', 'VT'],
    ['Virginia', 'VA'],
    ['Washington', 'WA'],
    ['District of Columbia', 'DC'],
    ['West Virginia', 'WV'],
    ['Wisconsin', 'WI'],
    ['Wyoming', 'WY'],
  ]);
  let answer = states.get(state);
  return answer ? answer : '';
};

const getCalifornia = function(school) {
  let splitSchool = school.split(' ');
  let usableWords = [];
  for (var i = 0; i < splitSchool.length; i++) {
    if (splitSchool[i].includes('!')) {
      break;
    } else {
      usableWords.push(splitSchool[i]);
    }
  }
  if (school.includes('Los Angeles')) {
    return 'UCLA';
  }
  if (school.includes('Berkeley')) {
    return 'California';
  }
  if (school.includes('University of California')) {
    usableWords[0] = 'UC';
    return usableWords.join('_');
  }
  if (school.includes('California State University')) {
    if (
      splitSchool[splitSchool.length - 1] == 'Fresno' ||
      splitSchool[splitSchool.length - 1] == 'Sacramento' ||
      splitSchool[splitSchool.length - 1] == 'Long Beach'
    ) {
      return splitSchool[splitSchool.length - 1].concat('_State');
    } else {
      return 'Cal_St_'.concat(splitSchool[splitSchool.length - 1]);
    }
  }
};

const getNC = function(school) {
  let splitSchool = school.split(' ');
  if (school.includes('Chapel Hill')) {
    return 'North Carolina';
  } else {
    return 'UNC_'.concat(splitSchool[2]);
  }
};

const getWisco = function(school) {
  let splitSchool = school.split(' ');
  if (school.includes('Madison')) {
    return 'Wisconsin';
  } else {
    return 'Wis_'.concat(splitSchool[1]);
  }
};

const getTexas = function(school) {
  let splitSchool = school.split(' ');
  let usableWords = [];
  for (var i = 0; i < splitSchool.length; i++) {
    if (splitSchool[i].includes('!')) {
      break;
    } else {
      usableWords.push(splitSchool[i]);
    }
  }
  if (school.includes('Austin')) {
    return 'Texas';
  } else if (school.includes('El Paso')) {
    return 'UTEP';
  } else {
    return 'UT_'.concat(
      usableWords.splice(1, usableWords.length - 1).join('_')
    );
  }
};

const getTeamName = function(school) {
  let usableWords = [];
  let splitSchool = school.split(' ');
  if (school == 'Boston University') {
    return 'Boston_U';
  }
  if (school.includes('Brigham Young')) {
    return 'BYU';
  }
  if (
    school.includes('California State University') ||
    school.includes('University of California')
  ) {
    return getCalifornia(school);
  }
  if (school.includes('California Polytechnic')) {
    return 'Cal_Poly';
  }
  if (school.includes('University of North Carolina')) {
    return getNC(school);
  }
  if (school.includes('University of Wisconsin')) {
    return getWisco(school);
  }
  if (school.includes('University of Texas')) {
    return getTexas(school);
  }
  if (splitSchool[0] == 'Pennsylvania') {
    splitSchool[0] = 'Penn';
  }
  if (school == 'University of Mississippi') {
    return 'Ole_Miss';
  }
  if (school == 'Mississippi State University') {
    return 'Miss_State';
  }
  if (school == 'Colorado Boulder !University of Colorado Boulder') {
    return 'Colorado';
  }
  if (school.includes('Virginia Tech')) {
    return 'Virginia_Tech';
  }
  if (school.includes('East Tennessee State University')) {
    return 'East_Tenn_St';
  }
  for (var i = 0; i < splitSchool.length; i++) {
    if (splitSchool[i].includes('!')) {
      return usableWords.join('_');
    } else {
      usableWords.push(splitSchool[i]);
    }
  }
  if (usableWords[usableWords.length - 1] == 'University') {
    usableWords[usableWords.length - 1] = '';
    usableWords = usableWords.splice(0, usableWords.length - 1);
    return usableWords.join('_');
  }
  return school;
};

const getSchoolNames = async () => {
  return new Promise((resolve, reject) => {
    let names = [];
    let count = 0;
    request(
      'https://en.wikipedia.org/wiki/List_of_NCAA_Division_I_institutions',
      function(err, resp, body) {
        if (!err && resp.statusCode == 200) {
          var $ = cheerio.load(body);
          var count = 0;
          $('tr', '.sortable').each(function() {
            const row = $(this)
              .text()
              .split('\n');
            const data = [
              getTeamName(row[1])
                .split(' ')
                .join('_'),
              getAbbrev(row[4]),
            ];
            names.push(data);
            let splitData = data[0].split('_');
            if (splitData[splitData.length - 1] == 'State') {
              splitData[splitData.length - 1] = 'St';
              names.push([splitData.join('_'), getAbbrev(row[4])]);
            }
            count++;
          });
          resolve(names);
        } else {
          console.log(resp.statusCode);
          reject(err);
        }
      }
    );
  });
};

const parseDate = function(date) {
  return new Date(date);
};

const earliestDate = parseDate('09/08/2017');

const delay = function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const sleep = async () => {
  console.log('Taking a break...');
  await delay((Math.random() * 5 + 1) * 1000);
  console.log('Two second later');
};

const parseMonth = function(month) {
  if (month == 'Jan') {
    return '1';
  } if (month == 'Feb') {
    return '2';
  } if (month == 'Mar') {
    return '3';
  } if (month == 'Apr') {
    return '4';
  } if (month == 'May') {
    return '5';
  } if (month == 'Jun') {
    return '6';
  } if (month == 'Jul') {
    return '7';
  } if (month == 'Aug') {
    return '8';
  } if (month == 'Sep') {
    return '9';
  } if (month == 'Oct') {
    return '10';
  } if (month == 'Nov') {
    return '11';
  } if (month == 'Dec') {
    return '12';
  }
}

const formatDate = function(date) {
  if (date == '#' || date.split(' ').length != 3 || date.includes('-'))  {
    return '01/01/2000';
  }
  let parts = date.split(' ');
  parts[0] = parseMonth(parts[0]);
  parts[1] = parts[1].replace(',', '');
  let result = parts.join('/');
  return result;
};

const fetchMeets = async url => {
  return new Promise((resolve, reject) => {
    let meets = new Map();
    let meetDates = new Map();
    let finalRegion = '';
    request(url, async (err, resp, body) => {
      let splitUrl = url.split('_');
      let team = splitUrl.splice(3, splitUrl.length).join('_');
      if (!err && resp.statusCode == 200 && team) {
        let $ = cheerio.load(body);
        $('a', 'span.panel-heading-normal-text').each( function() {
          let splitRegion = $(this)
            .text()
            .split(' ');
          let region = splitRegion.splice(1, splitRegion.length).join(' ');
          if (splitRegion.includes('DI')) {
              finalRegion = region.toLowerCase();
          }
        });
        $('tr').each(function() {
            let row = $(this).text().split('\n');
            let date = parseDate(
              formatDate(
                row[1]
              )
            );
            if (!date) {

            } else if (date.getTime() >= earliestDate.getTime()) {
              let meetName = row[3];
              let meetUrl = $(this).find('a').attr('href').replace('//', '');
              if (meetUrl.includes('www')) {
                meets.set(meetName, 'https://'.concat(meetUrl));
                meetDates.set(meetName, formatDate(row[1]).split('/').join('-'));
              }
            }
          }
        );
      }
      resolve({
          dates: meetDates,
          meets: meets,
          region: finalRegion
      });
    });
  });
};

const joinLists = function(list1, list2) {
  for (let i = 0; i < list2.length; i++) {
    if (!list1.includes(list2[i])) {
      list1.push(list2[i]);
    }
  }
  return list1;
};

const convertTime = function(time) {
  let splitTime = time.split(':');
  let minutes = parseInt(splitTime[0]) * 60;
  let seconds = parseInt(splitTime[1]);
  return minutes + seconds;
};

const populateTeams = function(t) {
  let teamNames = [];
  for (let i = 0; i < t.length; i++) {
    teamNames.push(t[i][0]);
  }
  return teamNames;
};

const getResults = async () => {
  const teams = await getSchoolNames();
  let teamNames = populateTeams(teams);
  let meets = new Map();
  let meetDates = new Map();
  let region = '';
  for (var i = 0; i < teams.length; i++) {
    if (teams[i][0] === 'School') continue;
    let url = teamBaseUrl
      .concat(teams[i][1])
      .concat('_college_m_')
      .concat(teams[i][0]);
    let newMeets = await fetchMeets(url);
    meets = new Map([...meets, ...newMeets.meets]);
    meetDates = new Map([...meetDates, ...newMeets.dates]);
    region = newMeets.region;
    try {
      await insertTeam(teams[i][0], 'mens', region);
      await insertTeam(teams[i][0], 'womens', region);
    } catch (err) {
      console.log(`Error inserting team ${teams[i][0]}`);
    }
  }
  return [meets, meetDates];
};

const scrapeResult = async (meetUrl, meetName) => {
  const teams = await getSchoolNames();
  let teamNames = populateTeams(teams);
  return new Promise((resolve, reject) => {
    request(meetUrl, function(err, resp, body) {
      let results = new Map();
      let count = 0;
      if (!err && resp.statusCode == 200) {
        let $ = cheerio.load(body);
        let mens = new Map();
        let womens = new Map();
        results.set(meetName, [mens, womens]);
        $('tr').each(function() {
          const data = $(this);
          let row = data.text().split('\n');
          if(row.length == 40) {
            count++;
          }
          let link = data.find('a').attr('href');
          if (count <= 11000) {
            try {
              let rank = parseInt(row[2]);
              let school = row[5]
                .trim()
                .split(' ')
                .join('_')
                .split('.')
                .join('');
              count++;
              if (teamNames.includes(school)) {
                if (link.toLowerCase().includes('_f_')) {
                  results.get(meetName)[1].set(school, rank);
                } else if (link.toLowerCase().includes('_m_')) {
                  results.get(meetName)[0].set(school, rank);
                }
              }
            } catch (error) {}
          }
        });
      }
      resolve(results);
    });
  });
};

const insertRegions = async region => {
  console.log(`Inserting Regions`);
  return new Promise((resolve, reject) => {
    db.get().query(`INSERT INTO Region (name) values
      ('northeast'),
      ('midatlantic'),
      ('southeast'),
      ('south'),
      ('southcentral'),
      ('greatlakes'),
      ('midwest'),
      ('mountain'),
      ('west')
    `,
    [],
    err => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const insertMeet = async (name, date) => {
  console.log(`Inserting a meet ${name}`);
  return new Promise((resolve, reject) => {
    db.get().query(`INSERT INTO Meet (name, date) values (?, ?)`, [name, date], err => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const insertTeam = async (name, gender, region) => {
  console.log(`Inserting a team ${name} with region ${region}`);
  return new Promise((resolve, reject) => {
    db
      .get()
      .query(
        `INSERT INTO Team (name, gender, region) values (?, ?, ?)`,
        [name, gender, region],
        err => {
          if (err) reject(err);
          else resolve();
        }
      );
  });
};

const insertParticipates = async (meet, team, gender, place) => {
  console.log(
    `Inserting a participates record ${meet}, ${team}, ${gender}, ${place}`
  );
  return new Promise((resolve, reject) => {
    let query = `INSERT INTO Participates (team_id, meet_id, placement) values (
      (SELECT ID FROM Team WHERE name=? and gender=?),
      (SELECT ID FROM Meet WHERE name=?),
      ?
    )`;
    db.get().query(query, [team, gender, meet, place], (err, result) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const mapResults = async () => {
  return new Promise(async (resolve, reject) => {
    let results = new Map();
    const meetData = await getResults();
    const meets = meetData[0];
    const meetDates = meetData[1];
    for (let [meetName, meetUrl] of meets) {
      try {
        await insertMeet(meetName, meetDates.get(meetName));
      } catch (err) {
        console.log('Error inserting meet', err);
      }
      console.log('Scraping ', meetUrl);
      let newResult = await scrapeResult(meetUrl, meetName);
      results = new Map([...results, ...newResult]);
      console.log(results);
    }
    resolve(results);
  });
};

const insertResults = async () => {
  return new Promise(async (resolve, reject) => {
    let results = await mapResults();
    //console.log(results);
    await insertRegions();
    for (let meet of results.keys()) {
      let r = results.get(meet);
      console.log(meet);
      for (let mensTeam of r[0].keys()) {
        try {
          await insertParticipates(meet, mensTeam, 'mens', r[0].get(mensTeam));
        } catch (err) {
          console.log(`Error inserting men's participation`, err);
        }
      }
      for (let womensTeam of r[1].keys()) {
        try {
          await insertParticipates(
            meet,
            womensTeam,
            'womens',
            r[1].get(womensTeam)
          );
        } catch (err) {
          console.log(`Error inserting women's participation`, err);
        }
      }
    }
    resolve();
  });
};

db.connect(MODE_TEST, async () => {
  await insertResults();
  db.disconnect();
});
