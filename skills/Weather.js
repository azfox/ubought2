module.exports = function(skill, info, bot, message) {
var request = require("request")
var weather = require("Openweather-Node")
var cities = require ('countries-cities').getCities("United States of America");

//var weather_key = "93c4360604467baf62dac87840b6582c"

//set your API key if you have one
weather.setAPPID("93c4360604467baf62dac87840b6582c");
//set the culture
weather.setCulture("fr");
//set the forecast type
weather.setForecastType("daily");

var url = "http://api.openweathermap.org/data/2.5/weather?q=Boston,Ma&units=imperial&apikey=93c4360604467baf62dac87840b6582c"

request({
    url: url,
    json: true
}, function (error, response, body) {

    if (!error && response.statusCode === 200) {
        //console.log(body) // Print the json response
        bot.reply(message,body.facts[0]+ ':smile_cat:');
    }
})

};
