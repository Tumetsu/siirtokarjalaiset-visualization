"use strict";

// Adding 500 Data Points
var map, pointarray, heatmap, heatmap2;
var loadedJson = 0;
var karelianData = {};

var mapStyles = [{

}];



function loadJson(file) {
    $.ajax({
        'global': false,
        'url': file,
        'dataType': "json",
        'success': function (data1) {
            console.log("ladattu")
            for (var year in data1) {
                if (data1.hasOwnProperty(year)) {

                    for (var j = 0; j < data1[year].length; j++) {
                        if (karelianData.hasOwnProperty(year)) {
                            for (var r = 0; r < data1[year][j]["count"]; r++)
                                karelianData[year].push(new google.maps.LatLng(data1[year][j]["lat"], data1[year][j]["lon"]))
                        }
                        else {
                            karelianData[year] = [];
                            for (var r = 0; r < data1[year][j]["count"]; r++)
                                karelianData[year].push(new google.maps.LatLng(data1[year][j]["lat"], data1[year][j]["lon"]))
                        }
                    }

                }
            }
            //ladattu
            var initialize = function() {
                var mapOptions = {
                    zoom: 7,
                    center: new google.maps.LatLng(62.244747, 25.747218400000065),
                    mapTypeId: google.maps.MapTypeId.SATELLITE,
                    styles: mapStyles
                };

                map = new google.maps.Map(document.getElementById('map-canvas'),
                    mapOptions);


                setHeatMap(45);

            };

            initialize();

            timedShow.setAnimation(true, 2000);

            $("#slideswitch").change(function() {
                console.log("muutui");

                timedShow.setAnimation(this.checked, 2000);
            });
        }
    });
}


loadJson("../assets/migrationdata.json");


function setHeatMap(year) {
    if (year in karelianData) {
        $("#year").text("Vuosi 19" + year);

        if (typeof heatmap != "undefined")
        {
           heatmap2 = heatmap;
           fadeOut(heatmap2, 100, function(){heatmap2.setMap(null)});
        }

        var pointArray = new google.maps.MVCArray(karelianData[year]);

        heatmap = new google.maps.visualization.HeatmapLayer({
            data: pointArray
        });

        heatmap.set('radius', heatmap.get('radius') ? null : 50);
        heatmap.setMap(map);
        fadeIn(heatmap, 100);
    }

}

function TimedShow() {
    this.currentYear = 12;

    this.setAnimation = function(putOn, time) {
        var self = this;
        if (putOn) {
            this.interval = setInterval(function() {self.moveTime(self)}, time);
        }
        else {
            clearInterval(this.interval);
        }
    };
    this.moveTime = function(self) {
        console.log(self);
        self.currentYear += 1;
        if (self.currentYear > 66)
            self.currentYear = 12;
        setHeatMap(self.currentYear);
    };
};

var timedShow = new TimedShow();

function fadeIn(map, time, callback){
    var alpha = 0;
    map.set('opacity', alpha);
    var step = 1/time;
    var fadeInterval = setInterval(fade, 1);

    function fade(){
        alpha += step;
        map.set('opacity', alpha);

        if (alpha >= 1) {
            clearInterval(fadeInterval);
            if (typeof callback === 'function') {
                callback();
            }
        }
    }
}

function fadeOut(map, time, callback){
    var alpha = 1;
    map.set('opacity', alpha);
    var step = 1/time;
    var fadeInterval = setInterval(fade, 1);

    function fade(){
        alpha -= step;
        map.set('opacity', alpha);

        if (alpha <= 0) {
            clearInterval(fadeInterval);
            if (typeof callback === 'function') {
                callback();
            }
        }
    }
}




function changeRadius() {
    heatmap.set('radius', heatmap.get('radius') ? null : 200);
}

function changeOpacity() {
    heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
}

//google.maps.event.addDomListener(window, 'load', initialize);