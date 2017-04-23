var express = require('express');
var router = express.Router();

/* GET main page. */

var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'admin',
    database : 'appinfo'
});

connection.connect();

function addslashes(str) {
    return (str + '')
        .replace(/[\\"']/g, '\\$&')
        .replace(/\\"/g, '\\"')
        .replace(/\\'/g, "\\'")
        .replace(/\\&/g, "\\&")
        .replace(/\u0000/g, '\\0')
}

router.get('/', function(req, res) {
    var diagram = req.query.diagrams;
    connection.query("SELECT top FROM current_top",  function(err, resList) {
        var listIds = resList[0].top;
        listIds = listIds.split(',');
        var result = [];
        var h = 1;
        var t = 1;
        for (var i = 0; i < listIds.length - 1; i++){
            connection.query("SELECT trackName, " + diagram +  " FROM info WHERE trackId ='" + listIds[i] + "'",  function(err, resultList){
                if (err == null){
                    //result[h-1] = resultList[0];
                    if (resultList.length != 0){
                        result[h-1] = resultList[0];
                        t++;
                        if (h == listIds.length - t){
                            // res.render('index', {info: resList, $: $, listIds: listIds});
                            var arr = {};
                            var arrayApp = [];
                            var i = 0;
                            switch (diagram){
                                case 'artistName':
                                    for (var j=0; j < result.length; j++) {
                                        i++;
                                        //console.log("id " + i + "   " + result[j].artistName);
                                        if (arrayApp[result[j].artistName] == null)
                                        {
                                            arr[result[j].artistName] =  1;
                                            arrayApp[result[j].artistName] = result[j].trackName;
                                        } else {
                                            arr[result[j].artistName] = arr[result[j].artistName] + 1;
                                            arrayApp[result[j].artistName] = arrayApp[result[j].artistName] + ', ' + result[j].trackName;
                                        }
                                    }
                                    break;
                                case 'price':
                                    for (var j=0; j < result.length; j++) {
                                        i++;
                                        if (result[j].price == 0){
                                            if (arrayApp['free'] == null){
                                                arr['free'] = 1;
                                                arrayApp['free'] = result[j].trackName;
                                            } else {
                                                arr['free'] = arr['free'] + 1;
                                                arrayApp['free'] =  arrayApp['free'] + ', ' + result[j].trackName;
                                            }
                                        } else {

                                            if (arrayApp[result[j].price] == null){
                                                arr[result[j].price] = 1;
                                                arrayApp[result[j].price] = result[j].price;
                                            } else {
                                                arr[result[j].price] = arr[result[j].price] + 1;
                                                arrayApp[result[j].price] = arrayApp[result[j].price] + ', ' + result[j].trackName;
                                            }
                                        }
                                    }
                                    break;
                                case 'primaryGenreName':
                                    for (var j=0; j < result.length; j++) {
                                        i++;
                                        if(arrayApp[result[j].primaryGenreName] == null){
                                            arr[result[j].primaryGenreName] = 1;
                                            arrayApp[result[j].primaryGenreName] = result[j].trackName;
                                        } else {
                                            arr[result[j].primaryGenreName] = arr[result[j].primaryGenreName] + 1;
                                            arrayApp[result[j].primaryGenreName] = arrayApp[result[j].primaryGenreName] + ', ' + result[j].trackName;
                                        }
                                    }
                                    break;
                                case 'averageUserRating':
                                    for (var j=0; j < result.length; j++) {
                                        i++;
                                        if(arrayApp[result[j].averageUserRating] == null){
                                            arr[result[j].averageUserRating] = 1;
                                            arrayApp[result[j].averageUserRating] = result[j].trackName;
                                        } else {
                                            arr[result[j].averageUserRating] = arr[result[j].averageUserRating] + 1;
                                            arrayApp[result[j].averageUserRating] = arrayApp[result[j].averageUserRating] + ', ' + result[j].trackName;
                                        }
                                    }
                                    break;
                                case 'supportedDevices':
                                    for (var j=0; j < result.length; j++) {
                                        i++;
                                        var buffer = result[j].supportedDevices;
                                        if ((buffer.indexOf("iPhone") != -1) && (buffer.indexOf("iPad")!= -1) && (buffer.indexOf("iPod")!= -1)) {
                                            var posStart = buffer.indexOf("iPhone");
                                            var iPhone = buffer.substr(posStart, 7);
                                            if (iPhone == "iPhone-") {
                                                iPhone = "iPhone-3";
                                            }
                                            posStart = buffer.indexOf("iPad");
                                            var iPad = buffer.substr(posStart, 5);
                                            if (iPad == "iPadW") {
                                                iPad = "iPad";
                                            } else {
                                                if (iPad != "iPad2") {
                                                    posStart = buffer.indexOf("iPad");
                                                    var posEnd = buffer.indexOf("Gen", posStart);
                                                    if (posEnd != -1) {
                                                        iPad = buffer.substr(posStart, posEnd - posStart + 3);
                                                    } else {
                                                        iPad = buffer.substr(posStart, 9);
                                                    }
                                                }
                                            }
                                            var iPod = "";
                                            if (buffer.indexOf("iPod-touch-with-mic")) {
                                                iPod = "iPod-touch-with-mic";
                                            } else {
                                                posStart = buffer.indexOf("iPod");
                                                posEnd = buffer.indexOf("Gen", posStart);
                                                iPod = buffer.substr(posStart, posEnd - posStart + 3);
                                            }
                                            if (arrayApp[iPhone + ", " + iPad + ", " + iPod] == null) {
                                                arr[iPhone + ", " + iPad + ", " + iPod] = 1;
                                                arrayApp[iPhone + ", " + iPad + ", " + iPod] = result[j].trackName;
                                            } else {
                                                arr[iPhone + ", " + iPad + ", " + iPod] = arr[iPhone + ", " + iPad + ", " + iPod] + 1;
                                                arrayApp[iPhone + ", " + iPad + ", " + iPod] = arrayApp[iPhone + ", " + iPad + ", " + iPod] + ', ' + result[j].trackName;
                                            }
                                        }
                                        else if (buffer.indexOf("iPhone")!= -1 && buffer.indexOf("iPod")!= -1) {
                                            var posStart = buffer.indexOf("iPhone");
                                            var iPhone = buffer.substr(posStart, 7);
                                            if (iPhone == "iPhone-") {
                                                iPhone = "iPhone-3";
                                            }
                                            var iPod = "";
                                            if (buffer.indexOf("iPod-touch-with-mic")) {
                                                iPod = "iPod-touch-with-mic";
                                            } else {
                                                posStart = buffer.indexOf("iPod");
                                                posEnd = buffer.indexOf("Gen", posStart);
                                                iPod = buffer.substr(posStart, posEnd - posStart + 3);
                                            }
                                            if (arrayApp[iPhone + ", " + iPod] == null) {
                                                arr[iPhone + ", " + iPod] = 1;
                                                arrayApp[iPhone + ", " + iPod] = result[j].trackName;
                                            } else {
                                                arr[iPhone + ", " + iPod] = arr[iPhone + ", " + iPod] + 1;
                                                arrayApp[iPhone + ", " + iPod] = arrayApp[iPhone + ", " + iPod] + ', ' + result[j].trackName;
                                            }
                                        }
                                        else if (buffer.indexOf("iPhone") != -1 && buffer.indexOf("iPad") != -1){
                                            var posStart = buffer.indexOf("iPhone");
                                            var iPhone = buffer.substr(posStart, 7);
                                            if (iPhone == "iPhone-") {
                                                iPhone = "iPhone-3";
                                            }
                                            posStart = buffer.indexOf("iPad");
                                            var iPad = buffer.substr(posStart, 5);
                                            if (iPad == "iPadW") {
                                                iPad = "iPad";
                                            } else {
                                                if (iPad != "iPad2") {
                                                    posStart = buffer.indexOf("iPad");
                                                    var posEnd = buffer.indexOf("Gen", posStart);
                                                    iPad = buffer.substr(posStart, posEnd - posStart + 3);
                                                }
                                            }
                                            if (arrayApp[iPhone + ", " + iPad] == null) {
                                                arr[iPhone + ", " + iPad] = 1;
                                                arrayApp[iPhone + ", " + iPad] = result[j].trackName;
                                            } else {
                                                arr[iPhone + ", " + iPad] = arr[iPhone + ", " + iPad] + 1;
                                                arrayApp[iPhone + ", " + iPad] = arrayApp[iPhone + ", " + iPad] + ', ' + result[j].trackName;
                                            }
                                        }
                                        else if (buffer.indexOf("iPad")!= -1 && buffer.indexOf("iPod")!= -1) {
                                            var posStart = buffer.indexOf("iPad");
                                            var iPad = buffer.substr(posStart, 5);
                                            if (iPad == "iPadW") {
                                                iPad = "iPad";
                                            } else {
                                                if (iPad != "iPad2") {
                                                    posStart = buffer.indexOf("iPad");
                                                    var posEnd = buffer.indexOf("Gen", posStart);
                                                    iPad = buffer.substr(posStart, posEnd - posStart + 3);
                                                }
                                            }
                                            var iPod = "";
                                            if (buffer.indexOf("iPod-touch-with-mic")) {
                                                iPod = "iPod-touch-with-mic";
                                            } else {
                                                posStart = buffer.indexOf("iPod");
                                                posEnd = buffer.indexOf("Gen", posStart);
                                                iPod = buffer.substr(posStart, posEnd - posStart + 3);
                                            }
                                            if (arrayApp[iPad + ", " + iPod] == null) {
                                                arr[iPad + ", " + iPod] = 1;
                                                arrayApp[iPad + ", " + iPod] = result[j].trackName;
                                            } else {
                                                arr[iPad + ", " + iPod] = arr[iPad + ", " + iPod] + 1;
                                                arrayApp[iPad + ", " + iPod] = arrayApp[iPad + ", " + iPod] + ', ' + result[j].trackName;
                                            }
                                        }
                                        else if (buffer.indexOf("iPhone")!= -1) {
                                            var posStart = buffer.indexOf("iPhone");
                                            var iPhone = buffer.substr(posStart, 7);
                                            if (iPhone == "iPhone-") {
                                                iPhone = "iPhone-3";
                                            }
                                            if (arrayApp[iPhone + " ONLY"] == null) {
                                                arr[iPhone + " ONLY"] = 1;
                                                arrayApp[iPhone + " ONLY"] = result[j].trackName;
                                            } else {
                                                arr[iPhone + " ONLY"] = arr[iPhone + " ONLY"] + 1;
                                                arrayApp[iPhone + " ONLY"] = arrayApp[iPhone + " ONLY"] + ', ' + result[j].trackName;
                                            }
                                        }
                                        else if (buffer.indexOf("iPad")!= -1) {
                                            var posStart = buffer.indexOf("iPad");
                                            var iPad = buffer.substr(posStart, 5);
                                            if (iPad == "iPadW") {
                                                iPad = "iPad";
                                            } else {
                                                if (iPad != "iPad2") {
                                                    posStart = buffer.indexOf("iPad");
                                                    var posEnd = buffer.indexOf("Gen", posStart);
                                                    iPad = buffer.substr(posStart, posEnd - posStart + 3);
                                                }
                                            }
                                            if (arrayApp[iPad + " ONLY"] == null) {
                                                arr[iPad + " ONLY"] = 1;
                                                arrayApp[iPad + " ONLY"] = result[j].trackName;
                                            } else {
                                                arr[iPad + " ONLY"] = arr[iPad + " ONLY"] + 1;
                                                arrayApp[iPad + " ONLY"] = arrayApp[iPad + " ONLY"] + ', ' + result[j].trackName;
                                            }
                                        }
                                        else if (buffer.indexOf("iPod")!= -1) {
                                            var iPod = "";
                                            if (buffer.indexOf("iPod-touch-with-mic")) {
                                                iPod = "iPod-touch-with-mic";
                                            } else {
                                                posStart = buffer.indexOf("iPod");
                                                posEnd = buffer.indexOf("Gen", posStart);
                                                iPod = buffer.substr(posStart, posEnd - posStart + 3);
                                            }
                                            if (arrayApp[iPad + " ONLY"] == null) {
                                                arr[iPad + " ONLY"] = 1;
                                                arrayApp[iPad + " ONLY"] = result[j].trackName;
                                            } else {
                                                arr[iPad + " ONLY"] = arr[iPad + " ONLY"] + 1;
                                                arrayApp[iPad + " ONLY"] = arrayApp[iPad + " ONLY"] + ', ' + result[j].trackName;
                                            }
                                        }
                                    }
                                    break;
                                case 'fileSizeBytes':
                                    for (var j=0; j < result.length; j++) {
                                        i++;
                                        var isN = true;
                                        var number = 0;
                                        var decimal = 10;
                                        while (isN == true) {
                                            var number1 = 0;
                                            if(number/decimal == 9){
                                                number1 = decimal * 10;
                                            } else {
                                                number1 = (number/decimal + 1) * decimal;
                                            }
                                            if ((result[j].fileSizeBytes > number) && (result[j].fileSizeBytes <= number1)) {
                                                if(arrayApp[number + '-' + number1] == null){
                                                    arr[number + '-' + number1] = 1;
                                                    arrayApp[number + '-' + number1] = result[j].trackName;
                                                } else {
                                                    arr[number + '-' + number1] = arr[number + '-' + number1] + 1;
                                                    arrayApp[number + '-' + number1] = arrayApp[number + '-' + number1] + ', ' + result[j].trackName;
                                                }
                                                isN = false;
                                            }
                                            if ((number/decimal) == 9) {
                                                decimal = decimal * 10;
                                            }
                                            number = number1;
                                        }
                                    }
                                    break;
                                case 'releaseDate':
                                    for (var j=0; j < result.length; j++) {
                                        i++;
                                        if(arrayApp[result[j].releaseDate] == null){
                                            arr[result[j].releaseDate] = 1;
                                            arrayApp[result[j].releaseDate] = result[j].trackName;
                                        } else {
                                            arr[result[j].releaseDate] = arr[result[j].releaseDate] + 1;
                                            arrayApp[result[j].releaseDate] = arrayApp[result[j].releaseDate] + ', ' + result[j].trackName;
                                        }
                                    }
                                    break;
                                case 'version':
                                    for (var j=0; j < result.length; j++) {
                                        i++;
                                        var buffer = result[j].version;
                                        buffer = buffer.substr(0, 2);
                                        if (buffer == "1."){
                                            if(arrayApp["1 ver"] == null){
                                                arr["1 ver"] = 1;
                                                arrayApp["1 ver"] = result[j].trackName;
                                            } else {
                                                arr["1 ver"] = arr["1 ver"] + 1;
                                                arrayApp["1 ver"] = arrayApp["1 ver"] + ', ' + result[j].trackName;
                                            }
                                        }
                                        else if (buffer == "2."){
                                            if(arrayApp["2 ver"] == null){
                                                arr["2 ver"] = 1;
                                                arrayApp["2 ver"] = result[j].trackName;
                                            } else {
                                                arr["2 ver"] = arr["2 ver"] + 1;
                                                arrayApp["2 ver"] = arrayApp["2 ver"] + ', ' + result[j].trackName;
                                            }
                                        }
                                        else if (buffer == "3."){
                                            if(arrayApp["3 ver"] == null){
                                                arr["3 ver"] = 1;
                                                arrayApp["3 ver"] = result[j].trackName;
                                            } else {
                                                arr["3 ver"] = arr["3 ver"] + 1;
                                                arrayApp["3 ver"] = arrayApp["3 ver"] + ', ' + result[j].trackName;
                                            }
                                        }
                                        else if (buffer == "4."){
                                            if(arrayApp["4 ver"] == null){
                                                arr["4 ver"] = 1;
                                                arrayApp["4 ver"] = result[j].trackName;
                                            } else {
                                                arr["4 ver"] = arr["4 ver"] + 1;
                                                arrayApp["4 ver"] = arrayApp["4 ver"] + ', ' + result[j].trackName;
                                            }
                                        }
                                        else if (buffer == "5."){
                                            if(arrayApp["5 ver"] == null){
                                                arr["5 ver"] = 1;
                                                arrayApp["5 ver"] = result[j].trackName;
                                            } else {
                                                arr["5 ver"] = arr["5 ver"] + 1;
                                                arrayApp["5 ver"] = arrayApp["5 ver"] + ', ' + result[j].trackName;
                                            }
                                        }
                                        else if (buffer == "6."){
                                            if(arrayApp["6 ver"] == null){
                                                arr["6 ver"] = 1;
                                                arrayApp["6 ver"] = result[j].trackName;
                                            } else {
                                                arr["6 ver"] = arr["6 ver"] + 1;
                                                arrayApp["6 ver"] = arrayApp["6 ver"] + ', ' + result[j].trackName;
                                            }
                                        }
                                        else if (buffer == "7."){
                                            if(arrayApp["7 ver"] == null){
                                                arr["7 ver"] = 1;
                                                arrayApp["7 ver"] = result[j].trackName;
                                            } else {
                                                arr["7 ver"] = arr["7 ver"] + 1;
                                                arrayApp["7 ver"] = arrayApp["7 ver"] + ', ' + result[j].trackName;
                                            }
                                        }
                                        else if (buffer == "8."){
                                            if(arrayApp["8 ver"] == null){
                                                arr["8 ver"] = 1;
                                                arrayApp["8 ver"] = result[j].trackName;
                                            } else {
                                                arr["8 ver"] = arr["8 ver"] + 1;
                                                arrayApp["8 ver"] = arrayApp["8 ver"] + ', ' + result[j].trackName;
                                            }
                                        }
                                        else if (buffer == "9."){
                                            if(arrayApp["9 ver"] == null){
                                                arr["9 ver"] = 1;
                                                arrayApp["9 ver"] = result[j].trackName;
                                            } else {
                                                arr["9 ver"] = arr["9 ver"] + 1;
                                                arrayApp["9 ver"] = arrayApp["9 ver"] + ', ' + result[j].trackName;
                                            }
                                        }
                                    }
                                    break;
                                case 'minimumOsVersion':
                                    for (var j=0; j < result.length; j++) {
                                        i++;
                                        var buffer = result[j].minimumOsVersion;
                                        buffer = buffer.substr(0, 2);
                                        if (buffer == "1."){
                                            if(arrayApp["1 iOS"] == null){
                                                arr["1 iOS"] = 1;
                                                arrayApp["1 iOS"] = result[j].trackName;
                                            } else {
                                                arr["1 iOS"] = arr["1 iOS"] + 1;
                                                arrayApp["1 iOS"] = arrayApp["1 iOS"] + ', ' + result[j].trackName;
                                            }
                                        }
                                        else if (buffer == "2."){
                                            if(arrayApp["2 iOS"] == null){
                                                arr["2 iOS"] = 1;
                                                arrayApp["2 iOS"] = result[j].trackName;
                                            } else {
                                                arr["2 iOS"] = arr["2 iOS"] + 1;
                                                arrayApp["2 iOS"] = arrayApp["2 iOS"] + ', ' + result[j].trackName;
                                            }
                                        }
                                        else if (buffer == "3."){
                                            if(arrayApp["3 iOS"] == null){
                                                arr["3 iOS"] = 1;
                                                arrayApp["3 iOS"] = result[j].trackName;
                                            } else {
                                                arr["3 iOS"] = arr["3 iOS"] + 1;
                                                arrayApp["3 iOS"] = arrayApp["3 iOS"] + ', ' + result[j].trackName;
                                            }
                                        }
                                        else if (buffer == "4."){
                                            if(arrayApp["4 iOS"] == null){
                                                arr["4 iOS"] = 1;
                                                arrayApp["4 iOS"] = result[j].trackName;
                                            } else {
                                                arr["4 iOS"] = arr["4 iOS"] + 1;
                                                arrayApp["4 iOS"] = arrayApp["4 iOS"] + ', ' + result[j].trackName;
                                            }
                                        }
                                        else if (buffer == "5."){
                                            if(arrayApp["5 iOS"] == null){
                                                arr["5 iOS"] = 1;
                                                arrayApp["5 iOS"] = result[j].trackName;
                                            } else {
                                                arr["5 iOS"] = arr["5 iOS"] + 1;
                                                arrayApp["5 iOS"] = arrayApp["5 iOS"] + ', ' + result[j].trackName;
                                            }
                                        }
                                        else if (buffer == "6."){
                                            if(arrayApp["6 iOS"] == null){
                                                arr["6 iOS"] = 1;
                                                arrayApp["6 iOS"] = result[j].trackName;
                                            } else {
                                                arr["6 iOS"] = arr["6 iOS"] + 1;
                                                arrayApp["6 iOS"] = arrayApp["6 iOS"] + ', ' + result[j].trackName;
                                            }
                                        }
                                        else if (buffer == "7."){
                                            if(arrayApp["7 iOS"] == null){
                                                arr["7 iOS"] = 1;
                                                arrayApp["7 iOS"] = result[j].trackName;
                                            } else {
                                                arr["7 iOS"] = arr["7 iOS"] + 1;
                                                arrayApp["7 iOS"] = arrayApp["7 iOS"] + ', ' + result[j].trackName;
                                            }
                                        }
                                        else if (buffer == "8."){
                                            if(arrayApp["8 iOS"] == null){
                                                arr["8 iOS"] = 1;
                                                arrayApp["8 iOS"] = result[j].trackName;
                                            } else {
                                                arr["8 iOS"] = arr["8 iOS"] + 1;
                                                arrayApp["8 iOS"] = arrayApp["8 iOS"] + ', ' + result[j].trackName;
                                            }
                                        }
                                        else if (buffer == "9."){
                                            if(arrayApp["9 iOS"] == null){
                                                arr["9 iOS"] = 1;
                                                arrayApp["9 iOS"] = result[j].trackName;
                                            } else {
                                                arr["9 iOS"] = arr["9 iOS"] + 1;
                                                arrayApp["9 iOS"] = arrayApp["9 iOS"] + ', ' + result[j].trackName;
                                            }
                                        }
                                    }
                                    break;
                                case 'features':
                                    for (var j=0; j < result.length; j++) {
                                        i++;
                                        if(arrayApp[result[j].features] == null){
                                            arr[result[j].features] = 1;
                                            arrayApp[result[j].features] = result[j].trackName;
                                        } else {
                                            arr[result[j].features] = arr[result[j].features] + 1;
                                            arrayApp[result[j].features] = arrayApp[result[j].features] + ', ' + result[j].trackName;
                                        }
                                    }
                                    break;
                            }

                            var arrayKeys = [];
                            for (var key in arr)
                            {
                                arrayKeys.push(key);
                            }

                            var resArr = [['[["Developer"', '"App"', '"Name App"]']];
                            for (var i = 0; i < arrayKeys.length; i++){
                                resArr[i+1] = ["[\"" + addslashes(arrayKeys[i]) + "\"", arr[arrayKeys[i]], "\"" + addslashes(arrayApp[arrayKeys[i]]) + "\"]"];
                            }
                            resArr[resArr.length - 1] = resArr[resArr.length - 1] + "]";
                            res.render('diagrams', {"resArr": JSON.stringify(resArr, null, ' ')});
                        }
                        h++;
                    }
                }
            })
        }
    })
});



module.exports = router;
