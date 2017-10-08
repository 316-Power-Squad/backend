var request = require('request'),
  cheerio = require('cheerio'),
  urls = [];

var notTitle = function(s) {
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

var getAbbrev = function(state) {
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

var getCalifornia = function(school) {
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

var getNC = function (school) {
    let splitSchool = school.split(" ");
    if (school.includes("Chapel Hill")) {
      return "North Carolina";
    } else {
        return "UNC_".concat(splitSchool[2]);
    }
}

var getTeamName = function(school) {
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
var getSchoolNames = function() {
    request(
      'https://en.wikipedia.org/wiki/List_of_NCAA_Division_I_institutions',
      function(err, resp, body) {
        if (!err && resp.statusCode == 200) {
          console.log('cake');
          var $ = cheerio.load(body);
          var count = 0;
          $('tr', '.sortable').each(function() {
            const row = $(this)
              .text()
              .split('\n');
            const data = [getTeamName(row[1]), getAbbrev(row[4])];
            console.log(data);
            if (data[0].split(' ').length > 1 && notTitle(data[0])) {
              count++;
            }
          });
        } else {
          console.log(resp.statusCode);
        }
      }
    );
}

getSchoolNames();
