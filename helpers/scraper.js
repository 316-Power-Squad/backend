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
        const data = [row[1], row[4]];
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
