var express = require('express');
var router = express.Router();

/* GET home page. */
var mysql = require('mysql');
var $ = require('jquery');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'admin',
  database : 'appinfo'
});

connection.connect();

var request = require('request'),
    cheerio = require('cheerio');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();

function clearDB()
{
    /*var queryString = "DELETE FROM `info` WHERE 200";
    connection.query(queryString,  function(err, result) {
        //console.log('res is ' + result);
        return result;
    });*/

    var queryString = "DELETE FROM `top_apps` WHERE 200";
    connection.query(queryString,  function(err, result) {
        //console.log('res is ' + result);
        return result;
    });
}

function addDB(queryL)
{
    connection.query(queryL, function(err, result) {
        console.log('res is ' + err);
        return result;
    });
}

function addslashes(str) {
    return (str + '')
        .replace(/[\\"']/g, '\\$&')
        .replace(/\\"/g, '\\"')
        .replace(/\u0000/g, '\\0')
}

function getInfoArray(a)
{
  var s = '';
  a.forEach(function(entry) {
    s = s + ' ' + entry;
  });
  if(s === null)
  {
    return '';
  }
  return s;
}

function getInfoApp(id)
{
  var url = 'http://itunes.apple.com/lookup?id=' + id;
  request({uri:url, method:'GET', encoding:'utf-8'},
      function (err, res, page) {
       // var page = cheerio.load(page);
        //console.log(page);
         console.log('page id is  ' + id);
         var jsonAppInfo = JSON.parse(page);
          //console.log(jsonAppInfo)
          var resultCount = jsonAppInfo['resultCount'];
          if (resultCount != 0)
          {
              var artworkUrl60 = jsonAppInfo['results'][0]['artworkUrl60'];
              var artworkUrl100 = jsonAppInfo['results'][0]['artworkUrl100'];
              var screenshotUrls = jsonAppInfo['results'][0]['screenshotUrls'];
              screenshotUrls = getInfoArray(screenshotUrls);
              var ipadScreenshotUrls = jsonAppInfo['results'][0]['ipadScreenshotUrls'];
              ipadScreenshotUrls = getInfoArray(ipadScreenshotUrls);
              var appletvScreenshotUrls = jsonAppInfo['results'][0]['appletvScreenshotUrls'];
              appletvScreenshotUrls = getInfoArray(appletvScreenshotUrls);
              var artworkUrl512 = jsonAppInfo['results'][0]['artworkUrl512'];
              var artistViewUrl = jsonAppInfo['results'][0]['artistViewUrl'];
              var kind = jsonAppInfo['results'][0]['kind'];
              var features = jsonAppInfo['results'][0]['features'];
              features = getInfoArray(features);
              var supportedDevices = jsonAppInfo['results'][0]['supportedDevices'];
              supportedDevices = getInfoArray(supportedDevices);
              var advisories = jsonAppInfo['results'][0]['advisories'];
              advisories = getInfoArray(advisories);
              var isGameCenterEnabled = jsonAppInfo['results'][0]['isGameCenterEnabled'];
              if(isGameCenterEnabled)//boo
              {
                  isGameCenterEnabled = 1;
              }
              else
              {
                  isGameCenterEnabled = 0;
              }
              var trackViewUrl = jsonAppInfo['results'][0]['trackViewUrl'];
              var contentAdvisoryRating = jsonAppInfo['results'][0]['contentAdvisoryRating'];
              var trackCensoredName = jsonAppInfo['results'][0]['trackCensoredName'];
              var fileSizeBytes = Math.ceil(jsonAppInfo['results'][0]['fileSizeBytes']/ 1048576); // int
              var sellerUrl = jsonAppInfo['results'][0]['sellerUrl'];
              var averageUserRatingForCurrentVersion = jsonAppInfo['results'][0]['averageUserRatingForCurrentVersion'];
              var userRatingCountForCurrentVersion = jsonAppInfo['results'][0]['userRatingCountForCurrentVersion'];
              var trackContentRating = jsonAppInfo['results'][0]['trackContentRating'];
              var languageCodesISO2A = jsonAppInfo['results'][0]['languageCodesISO2A'];
              languageCodesISO2A = getInfoArray(languageCodesISO2A);
              var currency = jsonAppInfo['results'][0]['currency'];
              var wrapperType = jsonAppInfo['results'][0]['wrapperType'];
              var version = jsonAppInfo['results'][0]['version'];
              var description = jsonAppInfo['results'][0]['description'];
              var artistId = jsonAppInfo['results'][0]['artistId']; //int
              var artistName = jsonAppInfo['results'][0]['artistName'];
              var genres = jsonAppInfo['results'][0]['genres'];
              genres = getInfoArray(genres);
              var price = jsonAppInfo['results'][0]['price'];
              var trackName = jsonAppInfo['results'][0]['trackName'];
              var trackId = jsonAppInfo['results'][0]['trackId'];// int
              var bundleId = jsonAppInfo['results'][0]['bundleId'];
              var minimumOsVersion = jsonAppInfo['results'][0]['minimumOsVersion'];
              var releaseDate = jsonAppInfo['results'][0]['releaseDate'];
              var primaryGenreName = jsonAppInfo['results'][0]['primaryGenreName'];
              var isVppDeviceBasedLicensingEnabled = jsonAppInfo['results'][0]['isVppDeviceBasedLicensingEnabled'];
              if(isVppDeviceBasedLicensingEnabled)//boo
              {
                  isVppDeviceBasedLicensingEnabled = 1;
              }
              else
              {
                  isVppDeviceBasedLicensingEnabled = 0;
              }// bool
              var sellerName = jsonAppInfo['results'][0]['sellerName'];
              var primaryGenreId = jsonAppInfo['results'][0]['primaryGenreId']; //int
              var currentVersionReleaseDate = jsonAppInfo['results'][0]['currentVersionReleaseDate'];
              var releaseNotes = jsonAppInfo['results'][0]['releaseNotes'];
              var genreIds = jsonAppInfo['results'][0]['genreIds'];
              genreIds = getInfoArray(genreIds);
              var formattedPrice = jsonAppInfo['results'][0]['formattedPrice'];
              var averageUserRating = jsonAppInfo['results'][0]['averageUserRating'];
              var userRatingCount = jsonAppInfo['results'][0]['userRatingCount']; // int
              if(userRatingCount === null)
              {
                  userRatingCount = 0;
              }

              var queryString = "INSERT IGNORE INTO `info` (artworkUrl60, artworkUrl100, screenshotUrls, " +
               "ipadScreenshotUrls, appletvScreenshotUrls, artworkUrl512, artistViewUrl, kind, "+
               "features, supportedDevices, " +
               "advisories, isGameCenterEnabled, trackViewUrl, contentAdvisoryRating, trackCensoredName, fileSizeBytes, sellerUrl, " +
               "averageUserRatingForCurrentVersion, userRatingCountForCurrentVersion, trackContentRating, languageCodesISO2A, currency, " +
               "wrapperType, version, description, artistId, artistName, genres, price, trackName, trackId, bundleId, minimumOsVersion, " +
               "releaseDate, primaryGenreName, isVppDeviceBasedLicensingEnabled, sellerName, primaryGenreId, currentVersionReleaseDate, releaseNotes, " +
               "genreIds, formattedPrice, averageUserRating, userRatingCount) VALUES('"+
               artworkUrl60 + "','"  +artworkUrl100   + "','"  +screenshotUrls  +"','"  +ipadScreenshotUrls  +"','"  +
               appletvScreenshotUrls +"','" +artworkUrl512 +"','" +artistViewUrl + "','" +kind +"','" +
               features +"','" +supportedDevices +"','" +advisories +"'," +isGameCenterEnabled  +",'"+
               trackViewUrl+ "','" +contentAdvisoryRating +"','"  +addslashes(trackCensoredName) +"',"  +fileSizeBytes +",'" +
               sellerUrl +"','" +averageUserRatingForCurrentVersion +"','"  +userRatingCountForCurrentVersion +"','" +trackContentRating +"','" +
               languageCodesISO2A +"','" +currency +"','" +wrapperType +"','" +version +"','" +
               addslashes(description) +"',"+artistId +",'" +addslashes(artistName) +"','" +genres +"','" +
               price +"','" +addslashes(trackName) +"',"+ trackId+",'"+ bundleId +"','"+
               minimumOsVersion +"','"+ releaseDate +"','"+ primaryGenreName +"',"+ isVppDeviceBasedLicensingEnabled +",'"+
               addslashes(sellerName) +"',"+ primaryGenreId +",'"+ currentVersionReleaseDate +"','"+ addslashes(releaseNotes) +"','"+
               genreIds +"','"+ formattedPrice +"','"+ averageUserRating +"','"+ userRatingCount + "')";// WHERE '" + trackId +
               addDB(queryString);
          }
      });
}

//clearDB();

router.get('/', function(req, res) {
  var url = 'http://itunes.apple.com/' + req.query.country + '/rss/' + req.query.type + '/limit=200/genre=' + req.query.genre + '/xml';
  console.log(url);
  var date = new Date();
  var selectDate = req.query.calendar;
  date = date.toISOString().substr(0, 10);
  console.log(selectDate);
  var queryStr;
  if (date == selectDate || selectDate == "") {
      request({uri: url, method: 'GET', encoding: 'utf8'},
          function (err, result, page) {
              console.log('curr date is ' + date);
              console.log('select date is ' + selectDate);
              parser.parseString(page, function (err, result) {
                  result = JSON.stringify(result);
                  var idList = [];
                  var posStart = result.indexOf('","$":{"im:id":');
                  var posEnd = result.indexOf('","im:bundleId":"')//   ","im:bundleId":"
                  while (posStart > 0) {
                      var id = result.substr(posStart + 16, posEnd - posStart - 16);
                      idList.push(id);
                      posStart = result.indexOf('","$":{"im:id":', posStart + 16);
                      posEnd = result.indexOf('","im:bundleId":"', posEnd + 17);
                  }
                  var listIds = "";
                  for (var index = 0; index < idList.length; ++index) {
                      getInfoApp(idList[index]);
                      listIds += idList[index] + ' ';
                  }

                  //добавление в БД топа конкретной даты
                 var queryStr = "INSERT INTO `top_apps` (dateTop, country, type, genre, listIds) VALUES('" + date +
                      "','" + req.query.country + "','" + req.query.type + "','" + req.query.genre + "','" + listIds + "')";
                  addDB(queryStr);
                  console.log('Done');
                  queryStr = "SELECT listIds FROM top_apps WHERE country ='" + req.query.country + "' and type ='" +
                      req.query.type + "' and genre ='" + req.query.genre + "' and dateTop = '" + date + "'";
                  connection.query(queryStr,  function(err, result) {
                      var listIds = result[0].listIds;
                      listIds = listIds.split(' ');
                      var queryString = "DELETE FROM current_top";
                      connection.query(queryString,  function(err, result) {
                          return result;
                      });
                      var queryStr = "INSERT INTO `current_top` (top) VALUES('" + listIds + "')";
                      addDB(queryStr);
                      var resList = [];
                      var h = 1;
                      var t = 1;
                      for (var i = 0; i < listIds.length - 1; i++){
                          connection.query("SELECT * FROM info WHERE trackId ='" + listIds[i] + "'",  function(err, result){
                              if (err == null){
                                  if (result.length != 0){
                                      resList[h-1] = result[0];
                                      t++;
                                      if (h == listIds.length - t){
                                          res.render('index', {info: resList, $: $});
                                      }
                                      h++;
                                  }
                              }
                          })
                      }
                  });
              });
          });
  } else {
      queryStr = "SELECT listIds FROM top_apps WHERE country ='" + req.query.country + "' and type ='" +
          req.query.type + "' and genre ='" + req.query.genre + "' and dateTop = '" + selectDate + "'";
      connection.query(queryStr,  function(err, result) {
          var listIds = result[0].listIds;
          listIds = listIds.split(' ');
          var queryStr = "INSERT INTO `current_top` (top) VALUES('" + listIds + "')";
          addDB(queryStr);
          var resList = [];
          var h = 1;
          for (var i = 0; i < listIds.length - 1; i++){
              connection.query("SELECT * FROM info WHERE trackId ='" + listIds[i] + "'",  function(err, result){
                  if (result != null){
                      resList[h-1] = result[0];
                      if (h == listIds.length - 1){

                          res.render('index', {info: resList, $: $, listIds: listIds});
                      }
                      h++;
                  }
              })
          }
      });
  }
});

//connection.end();
module.exports = router;
