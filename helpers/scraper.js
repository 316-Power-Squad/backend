import request from 'request';
import cheerio from 'cheerio';

let urls = [];
// ex. https://www.tfrrs.org/teams/xc/NC_college_m_Duke.html
let teamBaseUrl = "https://www.tfrrs.org/teams/xc/";

//ex. https://www.tfrrs.org/results/xc/11563.html
let resultBaseUrl = "https://www.tfrrs.org/results/xc/";

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
  let states = [
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
    ];

    for (var i = 0; i < states.length; i++) {
      if (state == states[i][0]) {
        return states[i][1];
      }
    }
    return "";
}

const getCalifornia = function(school) {
  let splitSchool = school.split(" ");
  let usableWords = [];
  for (var i = 0; i < splitSchool.length; i++) {
      if (splitSchool[i].includes("!")) {
        break;
      } else {
        usableWords.push(splitSchool[i]);
      }
    } 
    if (school.includes("Los Angeles")) {
      return "UCLA";
    }
  if (school.includes("Berkeley")) {
    return "California";
  } if (school.includes("University of California")) {
      usableWords[0] = "UC";
      return usableWords.join("_");
    }
   if (school.includes("California State University")) {
      if (
        splitSchool[splitSchool.length - 1] == "Fresno" || 
        splitSchool[splitSchool.length - 1] == "Sacramento" || 
        splitSchool[splitSchool.length - 1] == "Long Beach"
        ) {
        return splitSchool[splitSchool.length - 1].concat(" State");
      } else {
        return "Cal_St_".concat(splitSchool[splitSchool.length - 1]);
      }
  }
}

const getNC = function (school) {
    let splitSchool = school.split(" ");
    if (school.includes("Chapel Hill")) {
      return "North Carolina";
    } else {
        return "UNC_".concat(splitSchool[2]);
    }
}

const getWisco = function(school) {
  let splitSchool = school.split(" ");
  if (school.includes("Madison")) {
    return "Wisconsin";
  } else {
    return "Wis_".concat(splitSchool[1]);
  }
}

const getTexas = function(school) {
  let splitSchool = school.split(" ");
  let usableWords = [];
  for (var i = 0; i < splitSchool.length; i++) {
      if (splitSchool[i].includes("!")) {
        break;
      } else {
        usableWords.push(splitSchool[i]);
      }
    } 
  if (school.includes("Austin")) {
    return "Texas";
  } else if (school.includes("El Paso")) {
    return "UTEP";
  } else {
      return "UT_".concat(usableWords.splice(1, usableWords.length - 1).join("_"));
  }
}

const getTeamName = function(school) {
  let usableWords = [];
  let splitSchool = school.split(" ");
  if (school == "Boston University") {
      return "Boston_U";
  } if (school.includes("Brigham Young")) {
      return "BYU";
  } if (school.includes("California State University") || school.includes("University of California")) {
      return getCalifornia(school);
  } if (school.includes("California Polytechnic")) {
      return "Cal_Poly";
  } if (school.includes("University of North Carolina")) {
      return getNC(school);
  } if (school.includes("University of Wisconsin")) {
    return getWisco(school);
  } if (school.includes("University of Texas")) {
    return getTexas(school);
  } if (splitSchool[0] == "Pennsylvania") {
    splitSchool[0] = "Penn";
  } 
  for (var i = 0; i < splitSchool.length; i++) {
      if (splitSchool[i].includes("!")) {
        return usableWords.join("_");
      } else {
        usableWords.push(splitSchool[i]);
      }
    } 
  if (usableWords[usableWords.length - 1] == "University") {
    usableWords[usableWords.length - 1] = "";
    usableWords = usableWords.splice(0, usableWords.length - 1);
    return usableWords.join("_")
  }
  return school;
}

const getSchoolNames = async () => {
    return new Promise((resolve, reject) => {
    let names = [];
    let count = 0;
    request(
      'https://en.wikipedia.org/wiki/List_of_NCAA_Division_I_institutions',
      function(err, resp, body) {
        if (!err && resp.statusCode == 200) {
          //console.log('cake');
          var $ = cheerio.load(body);
          var count = 0;
          $('tr', '.sortable').each(function() {
            const row = $(this)
              .text()
              .split('\n');
            const data = [getTeamName(row[1]), getAbbrev(row[4])];
            //console.log(data);
            names.push(data);
            if (data[0].split(' ').length > 1 && notTitle(data[0])) {
              count++;
            }
          });
          resolve(names);
        } else {
          console.log(resp.statusCode);
          reject(err);
        }
      }
    )});
}

const getResults = async () => {
  const teams = await getSchoolNames();
    for (var i = 0; i < teams.length; i++) {
      var url = teamBaseUrl.concat(teams[i][1]).concat("_college_m_").concat(teams[i][0]);
      //console.log(url);
      request(url , function(err, resp, body) {
      if (!err && resp.statusCode == 200) {
          var $ = cheerio.load(body);
          $('tr', '.data, .scroll').each(function() {
            sleep();
            console.log($(this).find('.date').text());
            console.log($(this).find('a').attr('href'));
          });
      }
    })
    }
  }
  //console.log(teams);
  // if you print teams, you'll see that it's empty.

const delay = function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const sleep = async () => {
  console.log('Taking a break...');
  await delay(((Math.random() * 5) + 1) * 1000)
  console.log('Two second later');
}

getResults();
