import fetch from 'node-fetch';
import express from 'express';

let series_0 = [];
let series_1 = [];
let series_2 = [];

const app = express();
setTimeout(function () {
    console.log("Fetching first result.");
    getData();
}, 500);
setInterval(function () {
    console.log("Polling in background...");
    series_0 = [];
    series_1 = [];
    series_2 = [];
    getData();
}, 1000 * 60);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

app.get("/percentage", (req, res) => {
    let str = "0.0";
    series_2[series_2.length - 1] ? str = series_2[series_2.length - 1] : str = "0.0";
    res.send(str.toString().replace(/\./, "").padEnd(4, "0"));
});

function getData(token) {
    const min_date = new Date(new Date().setUTCHours(0, 0, 0, 0));
    min_date.setDate(min_date.getDate() - 1)
    const start_date = min_date.toISOString(); /* Start date of API call*/
    //console.log(start_date);
    console.log("Fetching...");
    let Url = 'https://data.sunwater.com.au/api/Sites/130216A/data?startDate=' + start_date;

    if (token) {
        Url += '&continuationToken=' + (token);
    }

    fetch(Url)
        .then(data => data.json())
        .then(data => {
            for (let i = 0; i < data.value.length; i++) {
                const temp = data.value[i];
                const temp_time = new Date(temp.date);
                const temp_time2 = temp_time.getTime() - (temp_time.getTimezoneOffset() * 60000);
                series_0.push({x: temp_time2, y: temp.storageLevelMetres});
                series_1.push({x: temp_time2, y: (temp.cubicMetersPerSecond * 86.4)});
                series_2.push(temp.percentageFull);
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
