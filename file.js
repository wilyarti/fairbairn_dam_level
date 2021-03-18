
//Anti Clickjacking code

if (self === top) {

    var antiClickjack = document.getElementById("antiClickjack");

    antiClickjack.parentNode.removeChild(antiClickjack);

} else {

    top.location = self.location;

}

var myMarkers=[]; // for hover

var myModel={};

var myTimeout,max_date,min_date,temp_date;

var Cap,Vol,Vol1,Lev,deltaVol,Date1;

$(window).resize(function() {

    if ($(window).width() > 980 && $('.left-col').is(':hidden')) {$('.left-col').show();}

    if ($(window).width() > 980 && $('#startscreen').is(':visible') && $('#googleMap').is(':empty')) {initMap();}

    if ($(window).width() < 980 && $('.left-col').is(':visible') && $('.display').is(':visible')) {$('.left-col').hide();}

}); //Ensures GS List is visible on resize

$(document).ready(function() {

    $('area.scheme').click(function() {

        $( "a[id*="+this.alt+"]" ).first().click();

    })

    $('area.dam').click(function() {

        $( "a[load*="+this.alt+"]" ).first().click();

    })

    $('.nav2').hide();

    $('a.navtitle').click(function() {

        if($(this).closest('li').find('ul').is(':visible')){$(this).closest('li').find('ul').hide(150);return false;}

        if ('vibrate' in navigator) {navigator.vibrate(200);}

        $('.nav2').hide();

        $(this).closest('li').find('ul.nav2').show(50);

        return false;

    });

    $('.station').click(function Station_Click() {

        if( window.location.hash ){

            //window.location.replace("#")

            history.replaceState("", document.title, window.location.pathname);

        };

        max_date = new Date();

        min_date = new Date();

        window.onpopstate = function(event){location.reload();};

        //console.log(max_date,min_date);

        min_date.setDate(max_date.getDate()-30);

        min_date.setHours(0,0,0,0);

        max_date.setHours(24,0,0,0);

        var temp = max_date.getTimezoneOffset()*60000;

        start_date = min_date.toISOString(); /* Start date of API call*/

        max_date = (max_date.getTime()-temp);

        min_date = (min_date.getTime()-temp);

        if ($(window).width() < 980) { $('.left-col').hide()}; /* Sets Display */

        $('#startscreen').hide();

        $('#Station').show();

        myModel = JSON.parse('[' + $(this).data("params") + ']'); /* Read Parameters */

        //console.log(myModel);

        var note_num = $(this).attr('note');

        notes(note_num);

        $('#Station input').attr('value', myModel[0]);

        window[myModel[0]](myModel[1],myModel[2],myModel[3],myModel[4]);

        return false;

    });

    $('.backBtn').click(function() {

        if( window.location.hash ){

            //window.location.replace("#");

            history.replaceState("", document.title, window.location.pathname);

        };

        clearTimeout(myTimeout);

        $('.display').hide();

        $('.left-col').show();

        if ($(window).width() > 980){$('#startscreen').show();initMap();}

    });

});

function callAction(area) {

    //console.log(area.alt);

    if  (this.hasClass("dam")){	$( "a[load*="+area.alt+"]" ).first().click();}

    if  (this.hasClass("scheme")){	$( "a[id*="+area.alt+"]" ).first().click();}

    //If class Scheme -> expand dropdown (navtitle.click)

}

function initMap() {

    var query = window.location.hash.substring(1);

    if (query === "") {return;

    } else {

        max_date = new Date();

        min_date = new Date();

        window.onpopstate = function(event){location.reload();};

        min_date.setDate(max_date.getDate()-30);

        min_date.setHours(0,0,0,0);

        max_date.setHours(24,0,0,0);

        var temp = max_date.getTimezoneOffset()*60000;

        start_date = min_date.toISOString(); /* Start date of API call*/

        max_date = (max_date.getTime()-temp);

        min_date = (min_date.getTime()-temp);

        if ($(window).width() < 980) { $('.left-col').hide()}; /* Sets Display */

        $('#startscreen').hide();

        $('#Station').show();

        myModel = JSON.parse('[' + $("a[load="+query+"]").data("params") + ']'); /* Read Parameters */

        var note_num = $("a[load="+query+"]").attr('note');

        notes(note_num);

        $('#Station input').attr('value', myModel[0]);

        history.replaceState("", document.title, window.location.pathname);

        window[myModel[0]](myModel[1],myModel[2],myModel[3],myModel[4]);

        return false;

    }

}

function HC(model_title,model_file,FSL,FSV){

    clearTimeout(myTimeout);

    myTimeout = setTimeout(function(){ HC(model_title,model_file,FSL,FSV); }, 300000);

    $('#displayImg').show();

    $('.display').show();

    var Url='https://data.sunwater.com.au/api/Sites/'+model_file+'/data?startDate='+start_date;

    var series_0 = [];

    var series_1 = [];

    var series_2 = [];

    var chartOptions = 	{

        colors: ["#0000FF","#FF00FF"],

        chart: {style:{fontFamily:'helvetica'},renderTo: 'displayImg',events:{load:function(){

                    if (typeof this.series[0].data[this.series[0].data.length - 1] === 'undefined'){

                        Date1 = 'N/A';

                        Lev = 'N/A';

                    }

                    else {

                        Date1 = Highcharts.dateFormat('<p>Updated %e %B %Y at %H:%M</p>', this.series[0].data[this.series[0].data.length - 1].x);

                        Lev = Highcharts.numberFormat(this.series[0].data[this.series[0].data.length - 1].y,2,'.',',');

                    }

                    if (typeof this.series[1].data[this.series[1].data.length - 1] === 'undefined' ){

                        Cap = 'N/A';

                        Vol = 'N/A';

                    }

                    else {

                        Cap = Highcharts.numberFormat(this.series[1].data[this.series[1].data.length - 1].y,1,'.',',');

                        Vol = Highcharts.numberFormat(this.series[1].data[this.series[1].data.length - 1].y*FSV/100,0,'.',',');

                    }

                    if ( typeof this.series[1].data[this.series[1].data.length - 25] === 'undefined') {

                        deltaVol = 'N/A'

                    } else {

                        Vol1 = Highcharts.numberFormat(this.series[1].data[this.series[1].data.length - 25].y*FSV/100,0,'.',',');

                        deltaVol = parseInt(Vol.replace(/,/g,''))-parseInt(Vol1.replace(/,/g,''));

                    };

                    $(".table tr").remove();

                    $("#plot_header p").remove();

                    $(".table caption").empty();

                    $('caption').append("<h1>"+ model_title + "</h1>" + Date1);

                    $('thead').append("<tr><th style='border-bottom:0px;'>Current Capacity</th><th style='border-bottom:0px;'>Current Level</th><th style='border-bottom:0px;'>Current Volume</th><th style='border-bottom:0px;'>24Hr Change</th><th style='border-bottom:0px;'>Full Supply Level</th><th style='border-bottom:0px;'>Full Supply Volume</th></tr>");

                    $('tbody').append("<tr><td style='border-top:0px;' align='center' >" + Cap +" %</td><td style='border-top:0px;' align='center' >" + Lev +" m</td><td style='border-top:0px;' align='center' >" + Vol +" ML</td><td style='border-top:0px;' align='center' >" + deltaVol +" ML</td><td style='border-top:0px;' align='center' >" + Highcharts.numberFormat(FSL,2,'.',',') +" m</td><td style='border-top:0px;' align='center' >" + Highcharts.numberFormat(FSV,0,'.',',') +" ML</td></tr>");

                }}},

        lang: {noData: "No Data Currently Available"},

        title: {text: ''},

        legend: {enabled:true},credits: {enabled: false},

        xAxis: {max:max_date,min:min_date,type: 'datetime',dateTimeLabelFormats: {day: '%e %b'},minrange: 1 * 3600000,endOnTick: true,showLastLabel: false,tickInterval:86400*1000,gridLineWidth: 1},

        yAxis: [{title:{text: ' Capacity (%)'},labels:{style:{width:'20px','min-width': '20px'},formatter: function(){return Highcharts.numberFormat(this.value,-1,'.',',');}},minRange: 110,endOnTick: true,minTickInterval:5,floor:0,min:0}],

        series:[{name:'Level',data:series_0,visible:false,showInLegend: false},{name:'Capacity (%)',data:series_1,type:'line'}],

        plotOptions: {connectNulls:true,series:{turboThreshold:0,marker:{enabled:false}}},

        tooltip: {backgroundColor: "rgba(255,255,255,1)",formatter: function(){var key = this.series.data.indexOf(this.point);return '<b>'+ Highcharts.dateFormat('%e %b - %H:%M  <br/><br/>', new Date(this.x)) +'</b></br>Height: ' +Highcharts.numberFormat(this.series.chart.series[0].data[key].y,3,'.',',')+' m<br/><br/>Capacity: ' + Highcharts.numberFormat(this.series.chart.series[1].data[key].y,2,'.',',') +' %<br/><br/>Volume: ' + Highcharts.numberFormat(this.series.chart.series[1].data[key].y*FSV/100,0,'.',',') +' ML<br/><br/>FSL: ' + FSL + ' mAHD<br/><br/>FSV: ' + Highcharts.numberFormat(FSV,0,'.',',') + ' ML';}},

    };

    function getData(){

        $.get(Url, function(data,result){

            for (var i = 0; i < data.value.length; i++) {

                var temp = data.value[i];

                var temp_time = new Date(temp.date);

                var temp_time2 = temp_time.getTime() - (temp_time.getTimezoneOffset() * 60000);

                series_0.push({x:temp_time2,y:temp.storageLevelMetres});

                series_1.push({x:temp_time2,y:temp.percentageFull});

            }

            if (data.continuationToken){

                token = encodeURIComponent(data.continuationToken); //console.log(token);

                Url='https://data.sunwater.com.au/api/Sites/'+model_file+'/data?startDate='+start_date+'&continuationToken='+(token);

                getData();

                return;

            }

            chart2 = new Highcharts.Chart(chartOptions);

        });

    };

    getData();

};

function Combined(model_title,model_file,FSL,FSV){//"Tinaroo Falls Dam","110014A",670.42,438920

    clearTimeout(myTimeout);

    myTimeout = setTimeout(function(){ Combined(model_title,model_file,FSL,FSV); }, 300000);

    $('#displayImg').show();

    $('.display').show();

    var series_0 = [];

    var series_1 = [];

    var series_2 = [];

    var chartOptions = 	{

        colors: ["#0000FF","#085BB8","#FF00FF"],

        chart: {style:{fontFamily:'helvetica'},renderTo: 'displayImg',events:{load:function(){

                    if ('undefined' === typeof this.series[0].data[this.series[0].data.length - 1]){ Date1 = 'N/A';	Lev = 'N/A'; }

                    else {

                        Date1 = Highcharts.dateFormat('<p>Updated %e %B %Y at %H:%M</p>', this.series[0].data[this.series[0].data.length - 1].x);

                        Lev = Highcharts.numberFormat(this.series[0].data[this.series[0].data.length - 1].y,2,'.',',');

                    }

                    if ('undefined' === typeof this.series[2].data[this.series[2].data.length - 1]){ Cap = 'N/A'; Vol = 'N/A';	}

                    else {

                        Cap = Highcharts.numberFormat(this.series[2].data[this.series[2].data.length - 1].y,1,'.',',');

                        Vol = Highcharts.numberFormat(this.series[2].data[this.series[2].data.length - 1].y*FSV/100,0,'.',',');

                    }

                    if ('undefined' === typeof this.series[2].data[this.series[2].data.length - 25]) { deltaVol = 'N/A'}

                    else {

                        Vol1 = Highcharts.numberFormat(this.series[2].data[this.series[2].data.length - 25].y*FSV/100,0,'.',',');

                        deltaVol = parseInt(Vol.replace(/,/g,''))-parseInt(Vol1.replace(/,/g,''));

                    };

                    $(".table tr").remove();

                    $("#plot_header p").remove();

                    $(".table caption").empty();

                    $('caption').append("<h1>"+ model_title + "</h1>" + Date1);

                    $('thead').append("<tr><th style='border-bottom:0px;'>Current Capacity</th><th style='border-bottom:0px;'>Current Level</th><th style='border-bottom:0px;'>Current Volume</th><th style='border-bottom:0px;'>24Hr Change</th><th style='border-bottom:0px;'>Full Supply Level</th><th style='border-bottom:0px;'>Full Supply Volume</th></tr>");

                    $('tbody').append("<tr><td style='border-top:0px;' align='center' >" + Cap +" %</td><td style='border-top:0px;' align='center' >" + Lev +" m</td><td style='border-top:0px;' align='center' >" + Vol +" ML</td><td style='border-top:0px;' align='center' >" + deltaVol +" ML</td><td style='border-top:0px;' align='center' >" + Highcharts.numberFormat(FSL,2,'.',',') +" m</td><td style='border-top:0px;' align='center' >" + Highcharts.numberFormat(FSV,0,'.',',') +" ML</td></tr>");

                }}

        },

        lang: {noData: "No Data Currently Available"},

        title: {text: ''},

        legend: {enabled:true},credits: {enabled: false},

        //tickInterval: 7 * 24 * 36e5, // one week

        xAxis: {max:max_date,min:min_date,type: 'datetime',dateTimeLabelFormats: {day: '%e %b'},minrange: 1 * 3600000,endOnTick: true,showLastLabel: false,tickInterval:86400*1000,gridLineWidth: 1},

        yAxis: [{title:{text: ' Capacity (%)'},labels:{align: 'right',style:{width:'20px','min-width': '20px'},formatter: function(){return Highcharts.numberFormat(this.value,-1,'.',',');}},minRange: 100,endOnTick: true,minTickInterval:5,floor:0,min:0},{opposite:true,title:{text: ' Flow (ML/day)'},labels:{style:{width:'20px','min-width': '20px'},formatter: function(){return Highcharts.numberFormat(this.value,-1,'.',',')}},floor:0,minRange:10}],

        legend: {enabled:true},credits: {enabled: false},

        series:[{name:'Level',data:series_0,visible:false,showInLegend: false},{name:'Flow (ML/day)',data:series_1,yAxis:1,type:'area'},{name:'Capacity (%)',data:series_2,type:'line'}],

        plotOptions: {connectNulls:true,series:{turboThreshold:0,marker:{enabled:false}},area:{fillColor: {linearGradient:{x1:0,y1:0,x2:0,y2:1},stops:[[0,Highcharts.getOptions().colors[0]],[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.2).get('rgba')]]},marker: {radius: 2},lineWidth: 1,states: {hover: {lineWidth: 1}},threshold: null}},

        tooltip: {backgroundColor: "rgba(255,255,255,1)",formatter: function(){

                var key = this.series.data.indexOf(this.point);

                return '<b>'+ Highcharts.dateFormat('%e %b - %H:%M  <br/><br/>', new Date(this.x)) +'</b>Height: ' +Highcharts.numberFormat(this.series.chart.series[0].data[key].y,3,'.',',')+' m<br/><br/>Capacity: ' + Highcharts.numberFormat(this.series.chart.series[2].data[key].y,2,'.',',') +' %<br/><br/>Volume: ' + Highcharts.numberFormat(this.series.chart.series[2].data[key].y*FSV/100,0,'.',',') +' ML<br/>Flow: ' +Highcharts.numberFormat(this.series.chart.series[1].data[key].y,0,'.',',')+' ML/day';

            }},

    };

    var Url='https://data.sunwater.com.au/api/Sites/'+model_file+'/data?startDate='+start_date;	//2019-03-24T02%3A24%3A44.003Z

    function getData(){

        $.get(Url, function(data,result){

            for (var i = 0; i < data.value.length; i++) {

                var temp = data.value[i];

                var temp_time = new Date(temp.date);

                var temp_time2 = temp_time.getTime() - (temp_time.getTimezoneOffset() * 60000);

                series_0.push({x:temp_time2,y:temp.storageLevelMetres});

                series_1.push({x:temp_time2,y:(temp.cubicMetersPerSecond*86.4)});

                series_2.push({x:temp_time2,y:temp.percentageFull});

            }

            if (data.continuationToken){

                token = encodeURIComponent(data.continuationToken); //console.log(token);

                Url='https://data.sunwater.com.au/api/Sites/'+model_file+'/data?startDate='+start_date+'&continuationToken='+(token);

                getData();

                return;

            }

            chart2 = new Highcharts.Chart(chartOptions);

        });



    };

    getData();

};

function PD(model_title,model_file,FSL,FSV){//"Tinaroo Falls Dam","110014A",670.42,438920

    clearTimeout(myTimeout);

    myTimeout = setTimeout(function(){ PD(model_title,model_file,FSL,FSV); }, 300000);

    $('#displayImg').show();

    $('.display').show();

    var series_0 = [];

    var series_1 = [];

    var series_2 = [];

    var	chartOptions = 	{

        colors: ["#0000FF","#085BB8","#FF00FF"],

        chart: {style:{fontFamily:'helvetica'},renderTo: 'displayImg',events:{load:function(){

                    if ('undefined' === typeof this.series[0].data[this.series[0].data.length - 1]){

                        Date1 = 'N/A';

                        Lev = 'N/A';

                    }

                    else {

                        Date1 = Highcharts.dateFormat('<p>Updated %e %B %Y at %H:%M</p>', this.series[0].data[this.series[0].data.length - 1].x);

                        Lev = Highcharts.numberFormat(this.series[0].data[this.series[0].data.length - 1].y,2,'.',',');

                    }

                    if ('undefined' === typeof this.series[2].data[this.series[2].data.length - 1]){

                        Cap = 'N/A';

                        Vol = 'N/A';

                    }

                    else {

                        Cap = Highcharts.numberFormat(this.series[2].data[this.series[2].data.length - 1].y,1,'.',',');

                        Vol = Highcharts.numberFormat(this.series[2].data[this.series[2].data.length - 1].y*FSV/100,0,'.',',');

                    }

                    if ('undefined' === typeof this.series[2].data[this.series[2].data.length - 25]) {

                        deltaVol = 'N/A'

                    } else {

                        Vol1 = Highcharts.numberFormat(this.series[2].data[this.series[2].data.length - 25].y*FSV/100,0,'.',',');

                        deltaVol = parseInt(Vol.replace(/,/g,''))-parseInt(Vol1.replace(/,/g,''));

                    };

                    $(".table tr").remove();

                    $("#plot_header p").remove();

                    $(".table caption").empty();

                    $('caption').append("<h1>"+ model_title + "</h1>" + Date1);

                    $('thead').append("<tr><th width='16.67%' style='border-bottom:0px;background: linear-gradient(#66CFDF, #00B0CA)'>Current Capacity</th><th width='16.67%' style='border-bottom:0px;background: linear-gradient(#66CFDF, #00B0CA)'>Current Level</th>					<th width='16.67%' style='border-bottom:0px;background: linear-gradient(#66CFDF, #00B0CA)'>Current Volume</th>					<th width='16.67%' style='border-bottom:0px;background: linear-gradient(#66CFDF, #00B0CA)'>24Hr Change</th>					<th width='16.67%' style='border-bottom:0px;'>Interim Full Supply Level*</th>					<th width='16.67%' style='border-bottom:0px;'>Interim Full Supply Volume*</th></tr>");

                    $('tbody').append("<tr><td style='border-top:0px;' align='center' >" + Cap +" %</td><td style='border-top:0px;' align='center' >" + Lev +" m</td><td style='border-top:0px;' align='center' >" + Vol +" ML</td><td style='border-top:0px;' align='center' >" + deltaVol +" ML</td><td style='border-top:0px;' align='center' >" + Highcharts.numberFormat(FSL,2,'.',',') +" m</td><td style='border-top:0px;' align='center' >" + Highcharts.numberFormat(FSV,0,'.',',') +" ML</td></tr>");

                    $('#plot_header').append("<p align='center'><i>* Following the lowering of the primary spillway and construction of the temporary concrete crest for the Paradise Dam Essential Works, an Interim Full Supply Level / Volume is in place. Visit the project's <a href=\"https://www.sunwater.com.au/projects/paradise-dam-essential-works/latest-news/\" title=\"Sunwater Latest News\">Latest News</a> page for more information.<i></p>");

                }}},

        lang: {noData: "No Data Currently Available"},

        title: {text: ''},

        legend: {enabled:true},credits: {enabled: false},

        xAxis: {max:max_date,min:min_date,type: 'datetime',dateTimeLabelFormats: {day: '%e %b'},minrange: 1 * 3600000,endOnTick: true,showLastLabel: false,tickInterval:86400*1000,gridLineWidth: 1},

        yAxis: [{title:{text: ' Capacity (%)'},labels:{align: 'right',style:{width:'20px','min-width': '20px'},formatter: function(){return Highcharts.numberFormat(this.value,-1,'.',',');}},minRange: 110,endOnTick: true,minTickInterval:5,floor:0,min:0},{opposite:true,title:{text: ' Flow (ML/day)'},labels:{style:{width:'20px','min-width': '20px'},formatter: function(){return Highcharts.numberFormat(this.value,-1,'.',',')}},floor:0}],

        series:[{name:'Level',data:series_0,visible:false,showInLegend: false},{name:'Flow (ML/day)',data:series_1,yAxis:1,type:'area'},{name:'Capacity (%)',data:series_2,type:'line'}],

        plotOptions: {connectNulls:true,series:{marker:{enabled:false}},area:{fillColor: {linearGradient:{x1:0,y1:0,x2:0,y2:1},stops:[[0,Highcharts.getOptions().colors[0]],[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.2).get('rgba')]]},marker: {radius: 2},lineWidth: 1,states: {hover: {lineWidth: 1}},threshold: null}},

        tooltip: {backgroundColor: "rgba(255,255,255,1)",formatter: function(){

                var key = this.series.data.indexOf(this.point);

                return '<b>'+ Highcharts.dateFormat('%e %b - %H:%M  <br/><br/>', new Date(this.x)) +'</b>Height: ' +Highcharts.numberFormat(this.series.chart.series[0].data[key].y,3,'.',',')+' m<br/><br/>Capacity: ' + Highcharts.numberFormat(this.series.chart.series[2].data[key].y,2,'.',',') +' %<br/><br/>Volume: ' + Highcharts.numberFormat(this.series.chart.series[2].data[key].y*FSV/100,0,'.',',') +' ML<br/>Flow: ' +Highcharts.numberFormat(this.series.chart.series[1].data[key].y,0,'.',',')+' ML/day';}},

    };

    var Url='https://data.sunwater.com.au/api/Sites/'+model_file+'/data?startDate='+start_date;	//2019-03-24T02%3A24%3A44.003Z

    function getData(){

        $.get(Url, function(data,result){

            for (var i = 0; i < data.value.length; i++) {

                var temp = data.value[i];

                var temp_time = new Date(temp.date);

                var temp_time2 = temp_time.getTime() - (temp_time.getTimezoneOffset() * 60000);

                series_0.push({x:temp_time2,y:temp.storageLevelMetres});

                series_1.push({x:temp_time2,y:(temp.cubicMetersPerSecond*86.4)});

                series_2.push({x:temp_time2,y:temp.percentageFull});

            }

            if (data.continuationToken){

                token = encodeURIComponent(data.continuationToken); //console.log(token);

                Url='https://data.sunwater.com.au/api/Sites/'+model_file+'/data?startDate='+start_date+'&continuationToken='+(token);

                getData();

                return;

            }

            chart2 = new Highcharts.Chart(chartOptions);

        });



    };

    getData();

};

function myFilter() {

    $('.navtitle').show();

    $('.nav2').hide();

    var input, filter, ul, li, a, i,b;

    input = document.getElementById('myInput');

    filter = input.value.toUpperCase();

    ul = document.getElementById("sub-nav");

    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query

    //<li><a href="#" class="station" load="edenbann" data-params='"Combined","Eden Bann Weir","130005A",14.5,35983' title="GS 130005A Fitzroy River AMTD 142.1kms">Eden Bann Weir</a></li>

    for (i = 0; i < li.length; i++) {

        a = li[i].getElementsByTagName("a")[0];

        if ($(a).hasClass("navtitle")){continue;}

        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {

//			if (a.getAttribute("title").toUpperCase().indexOf(filter) > -1) {

//				console.log(a.title);

            li[i].style.display = "";

        } else {

            li[i].style.display = "none";

            $('.navtitle').hide();

            $('.nav2').show();

        }

    }











    // Needs a back button

}

function notes(note_number){$('.notes').hide();$('#note' + note_number).show()};
