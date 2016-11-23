module.exports = function(skill, info, bot, message) {
var request = require("request")


//query the citilist db with fuzzy match from the the city
//lets require/import the mongodb native drivers.
//var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
//var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
//var url = process.env.MONGODB_URI;

var geocoder = require('geocoder');
var Forecast = require('forecast');
var forecast = new Forecast({
  service: 'darksky',
  key: process.env.DARKSKY_KEY, //may need to put the key back
  units: 'fahrenheit',
  cache: true,      // Cache API requests
  ttl: {            // How long to cache requests. Uses syntax from moment.js: http://momentjs.com/docs/#/durations/creating/
    minutes: 27,
    seconds: 45
  }
});
// Geocoding

var lat = -1000.0
var lng = -1000.0
var location = ''
try {
  location = message.intents[0].entities.location[0].value
}
catch(err) {
  //console.log(message.intents[0].entities.location[0].value)

  if(message.intents[0].entities["search_query"][0].value && message.intents[0].entities["search_query"][0].value != null
      && message.intents[0].entities["search_query"][0].value != ''){
    location = message.intents[0].entities["search_query"][0].value
  }else{
    bot.reply(message, "Oh Man.  I would love to tell you the Weather but you never told me where...the world is vastly different you know!!")
    return;
  }

  //console.log(message.intents.entities[0])

}

geocoder.geocode(location, function ( err, data ) {
  // do stuff with data
  if(err){
    bot.reply(message, "Uh Oh, it didn\'t quite understand the location you suggested : " + location +
                " did you maybe forget the state?"
              )
    return;
  }else {
    try{
      var loc = data.results[0].geometry.location
      //console.log(JSON.parse(loc))
      lat = loc.lat
      lng = loc.lng
      // Retrieve weather information from coordinates (Sydney, Australia)
      forecast.get([lat, lng], function(err, weather) {
        if(err){
          bot.reply(message, "Bad longitude and latitude found!")
          return;
        }
        //console.dir(weather);

        //Take first word if multiple words
        var retLocation = toTitleCase(location.split(" ")[0])


        bot.reply(message, 'Current Weather in ' + retLocation
                          + ': Summary: ' + weather.currently.summary + '\n' +
                           'Temp: ' + weather.currently.temperature + ' Degrees F\n' +
                           'Chance Of Rain: ' +  weather.currently.precipProbability*100 + '%' )

      });
    } catch(err) {
      bot.reply(message, "Uh Oh, it didn\'t quite understand the location you suggested for the Weather. Care to try again?")
    }

  }

});



};


function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
