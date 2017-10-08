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

var getTeamName = function(school) {
  let usableWords = [];
  var splitSchool = school.split(" ");
  if (school == "Boston Universty") {
    return "Boston_U"
  }
  for (var i = 0; i < splitSchool.length; i++) {
      if (splitSchool[i].includes("!")) {
        return usableWords.join("_");
      } else {
        usableWords.push(splitSchool[i]);
      }
    } 
  if (splitSchool[splitSchool.length - 1] == "University") {
    if (splitSchool.length > 2) {
      if (splitSchool[splitSchool.length - 2] == "State") {
        splitSchool[splitSchool.length - 2] = "St"
      }
    }
    splitSchool[splitSchool.length - 1] = "";
    splitSchool = splitSchool.splice(0, splitSchool.length - 1);
    return splitSchool.join("_")
  }
  return school;
}

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
