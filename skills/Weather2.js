module.exports = function(skill, info, bot, message) {
var request = require("request")
var weather = require("Openweather-Node")

var pos = require('pos');

var words = new pos.Lexer().lex(message);
var tagger = new pos.Tagger();
var taggedWords = tagger.tag(words);

var wordsForDB = []

for (i in taggedWords) {
    var taggedWord = taggedWords[i];
    if(taggedWord[1] == 'NNP'){
	     wordsForDB.push(taggedWord[0].toUpperCase())
    }

}

//qery database with wordsForDB for DB


//var weather_key = "93c4360604467baf62dac87840b6582c"

//set your API key if you have one
//weather.setAPPID("93c4360604467baf62dac87840b6582c");
//set the culture
//weather.setCulture("fr");
//set the forecast type
//weather.setForecastType("daily");


//query the citilist db with fuzzy match from the the city
//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = process.env.MONGODB_URI;

// Require the module
var Forecast = require('forecast');

// Initialize
var forecast = new Forecast({
  service: 'darksky',
  key: 'your-api-key',
  units: 'celcius',
  cache: true,      // Cache API requests
  ttl: {            // How long to cache requests. Uses syntax from moment.js: http://momentjs.com/docs/#/durations/creating/
    minutes: 27,
    seconds: 45
  }
});

var lat = 42.33196
var lng = -71.020173
// Retrieve weather information from coordinates (Sydney, Australia)
forecast.get([lat, lng], function(err, weather) {
  if(err) return console.dir(err);
  console.dir(weather);
  bot.reply(message, 'Current Weather in Boston' //+ result[0].primary_city
                      + ': Current Summary: ' + weather.currently.summary +
                     ', Current Temp: ' + weather.currently.temperature +
                     ', Chance Of Rain: '  weather.currently.precipProbability*100 + '%' )
});

/*
// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
    bot.reply(message, 'OOPSIE!...Ubought Wasn\'t quite able to connect to his Weather Brain (must be cloudy)...Try back later!!')
  } else {
    //HURRAY!! We are connected.
    console.log('Connection established to', url);

    // Get the documents collection
    var collection = db.collection('CitiList');

    // Insert some users
    collection.find({$and: [{primary_city_upper: {$in: wordsForDB},{state: {$in: wordsForDB}}}]}).toArray(function (err, result) {
      if (err) {
        console.log(err);
        bot.reply(message, 'OOPSIE!...Can you give me a new Location for Weather? I am unable to Find location out of:'+ wordsForDB.join());
      } else if (result.length) {
        console.log('Found:', result);
        var lat = result[0].latitude;
        var lng = result[0].longitude;
        console.log('lng,lat:' + lng + ', ' + lat);

        // Initialize
        var forecast = new Forecast({
          service: 'darksky',
          key: '8a051eedd4086072db979731cf418402',
          units: 'fahrenheit',
          cache: true,      // Cache API requests
          ttl: {            // How long to cache requests. Uses syntax from moment.js: http://momentjs.com/docs/#/durations/creating/
            minutes: 27,
            seconds: 45
          }
        });

      // Require the module
      var Forecast = require('forecast');

      // Initialize
      var forecast = new Forecast({
        service: 'darksky',
        key: 'your-api-key',
        units: 'celcius',
        cache: true,      // Cache API requests
        ttl: {            // How long to cache requests. Uses syntax from moment.js: http://momentjs.com/docs/#/durations/creating/
          minutes: 27,
          seconds: 45
        }
      });

      // Retrieve weather information from coordinates (Sydney, Australia)
      forecast.get([lat, lng], function(err, weather) {
        if(err) return console.dir(err);
        console.dir(weather);
        bot.reply(message, 'Current Weather in ' + result[0].primary_city
                            + ': Current Summary: ' + weather.currently.summary +
                           ', Current Temp: ' + weather.currently.temperature +
                           ', Chance Of Rain: '  weather.currently.precipProbability*100 + '%' )
      });

      } else {
        console.log('No document(s) found with defined "find" criteria!');
        bot.reply(message, 'OOPSIE!...Can you give me a new Location for Weather? I am unable to Find location out of:'+ wordsForDB.join());
      }
      //Close connection
      db.close();
    });
  }
});
*/

};
