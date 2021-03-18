var express = require("express");
var fetch = require("node-fetch");

var series_0 = [];
var series_1 = [];
var series_2 = [];

var app = express();

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

app.get("/percentage", (req, res) => {
    getData();
        res.json(series_2[series_2.length -1 ]);
});

function getData(token) {
    var min_date = new Date(new Date().setUTCHours(0, 0, 0, 0));
    min_date.setDate(min_date.getDate() - 2)
    var start_date = min_date.toISOString(); /* Start date of API call*/
    console.log(start_date);
    console.log("Running");
    var Url = 'https://data.sunwater.com.au/api/Sites/130216A/data?startDate=' + start_date;

    if (token) {
        Url += '&continuationToken=' + (token);
    }

    fetch(Url)
        .then(data => data.json())
        .then(data => {
            for (var i = 0; i < data.value.length; i++) {
                var temp = data.value[i];
                var temp_time = new Date(temp.date);
                var temp_time2 = temp_time.getTime() - (temp_time.getTimezoneOffset() * 60000);
                series_0.push({x: temp_time2, y: temp.storageLevelMetres});
                series_1.push({x: temp_time2, y: (temp.cubicMetersPerSecond * 86.4)});
                series_2.push(temp.percentageFull);
                //console.log(temp.percentageFull);
            }
            console.log(data.continuationToken);
            if (data.continuationToken) {
                token = encodeURIComponent(data.continuationToken); //console.log(token);
                //Url = 'https://data.sunwater.com.au/api/Sites/130216A/data?startDate=' + start_date + '&continuationToken=' + (token);
                getData(token);
                return;
            }
        })
        .then(text => console.log(text))
};
