import request from 'request';
import cheerio from 'cheerio';

const fetchRankings = async ()=> {
    return new Promise((resolve, reject) => {
        const url = getMostRecentUrls()[0];
        console.log(url);
        let regionRankings = new Map();
        request(url, async (err, resp, body) => {
            if (!err && resp.statusCode == 200){
                let $ = cheerio.load(body);
                let regionName = "";
                let teamName = "";
                let rankedTeams = [];
                let counter = 0;
                $('td').each(function(i, elem) {
                    if ($(this).attr("bgcolor") === '#A6CAFF') {
                        counter = 0;
                        regionName = $(this).text();
                    }
                    if ($(this).children().first().attr('target') === '_blank'){
                        teamName = $(this).children().first().text();
                        counter++;
                        rankedTeams.push(teamName)
                    
                    if (regionName !== "" && teamName !== "" && counter <=15){
                       if (!regionRankings.has(regionName)){
                        regionRankings.set(regionName, [teamName]);
                       }else{
                        if (regionRankings.get(regionName).indexOf(teamName) < 0) {
                            regionRankings.get(regionName).push(teamName);
                        }
                       }
                    }
                }
            })
            resolve(regionRankings);
            return regionRankings;
            } else {
                console.log(resp.statusCode);
                reject(err);
            }
        })
    })
};


//line 5 shouldn't be hardcoded -- in the future it should call a helper message like the following to get the url

const getMostRecentUrls = async() => {
    return new Promise((resolve, reject) => {
    let urls = [];
    let sourceUrl = "http://www.ustfccca.org/category/rankings-polls/cross-country-polls/div-1-cross-country";
    request(sourceUrl, async(err, resp, body) => {
        if (!err && resp.statusCode == 200){
            let $ = cheerio.load(body);
            let allArchivesDiv = $("div[class=facetwp-template]");
            let paragraphs = allArchivesDiv.children();
            paragraphs.each(function(i, elem){
                let link = $(this).children().first();
                if (link !== undefined){
                    let url = link.attr("href");
                    if (url !== undefined && url.indexOf("regional") > -1){
                        urls.push(url);
                    } else if (url !== undefined && url.indexOf("region") > -1){
                        urls.push(url);
                        resolve(urls);
                        return urls;
                    }
                }
            })
        } else {
            console.log(resp.statusCode);
            reject(err);
        }
    })
});
};

//fetchRankings("http://www.ustfccca.org/2017/08/featured/2017-ncaa-di-cross-country-mens-region-rankings-preseason");

//getMostRecentUrls();
fetchRankings();