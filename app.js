var express = require("express");
var app = express();
var request = require("request");
var config = require('./config.json');
var maps_key = config.maps_key;
var weather_key = config.weather_key;
app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", function(req, res) {
   res.render("search"); 
});

app.get("/result", function(req, res) {
    var query = req.query.search;
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + query + "&key=" + maps_key;
    request(url, function(error, response, body) {
        if(!error && response.statusCode == 200) {
            var mapsJson = JSON.parse(body)
            var latitude = mapsJson.results[0].geometry.location.lat;
            var longitude = mapsJson.results[0].geometry.location.lng;
            var url = "https://api.darksky.net/forecast/" + weather_key + "/" + latitude + "," + longitude;
            request(url, function(error,response,body) {
                if(!error && response.statusCode == 200) {
                    var weatherJson = JSON.parse(body)
                    res.render("result", {mapData: mapsJson, weatherData: weatherJson})
                }
            }.bind({mapsJson: mapsJson}));
            //res.render("result", {data: json});
        }
    });
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Weather app has started!!!")
});
