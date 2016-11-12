var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var os = require('os');
var app = express()
var BotKit = require('botkit');


var fs = require('fs');


var Train = require('./src/train');
var Brain = require('./src/brain');
var Ears = require('./src/ears');
var builtinPhrases = require('./builtins');




var token = "EAACH17k9j0oBALuERxI0mphZCXdkJ8mM6VP1mwCws8IdkpcltA09FPYob1bdWxyND9Y4X56uoNRJ8A4ehoS68jP5ReOlwYG50aeMZAYUkAHWpOXbowZCbK8ueRZBmS3C1l6vQfnAlnu03lIKWqZCFs1bOIAvoKnglZB5DPMMW5AQZDZD"
var verify = "am_i_verified"

var controller = BotKit.facebookbot({
    debug: true,
    access_token: token,
    verify_token: verify,
});

var bot = controller.spawn({
});

controller.setupWebserver(process.env.port || 3000, function(err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function() {
        console.log('ONLINE!');
    });
});

//bit that can listen
var ubought = {
  Brain: new Brain(),
  //Ears: new Ears(process.env.SLACK_TOKEN)
  Ears: new Ears(bot)
};


var customPhrasesText;
var customPhrases;
try {
  customPhrasesText = fs.readFileSync(__dirname + '/custom-phrases.json').toString();
} catch (err) {
  throw new Error('Uh oh, ubought could not find the ' +
    'custom-phrases.json file, did you move it?');
}
try {
  customPhrases = JSON.parse(customPhrasesText);
} catch (err) {
  throw new Error('Uh oh, custom-phrases.json was ' +
    'not valid JSON! Fix it, please? :)');
}

console.log('ubought is learning...');
ubought.Teach = ubought.Brain.teach.bind(ubought.Brain);
eachKey(customPhrases, ubought.Teach);
eachKey(builtinPhrases, ubought.Teach);
ubought.Brain.think();
console.log('ubought finished learning, time to listen...');
ubought.Ears
  .listen()
  .hear('TRAINING TIME!!!', function(speech, message) {
    console.log('Delegating to on-the-fly training module...');
    Train(ubought.Brain, speech, message);
  })
  .hear('.*', function(speech, message) {
    var interpretation = ubought.Brain.interpret(message.text);
    console.log('ubought heard: ' + message.text);
    console.log('ubought interpretation: ', interpretation);
    if (interpretation.guess) {
      console.log('Invoking skill: ' + interpretation.guess);
      ubought.Brain.invoke(interpretation.guess, interpretation, speech, message);
    } else {
      speech.reply(message, 'Hmm... I don\'t have a response what you said... I\'ll save it and try to learn about it later.');
      // speech.reply(message, '```\n' + JSON.stringify(interpretation) + '\n```');

      // append.write [message.text] ---> to a file
      fs.appendFile('phrase-errors.txt', '\nChannel: ' + message.channel + ' User:'+ message.user + ' - ' + message.text, function (err) {
        console.log('\n\tBrain Err: Appending phrase for review\n\t\t' + message.text + '\n');
        });
    }
  });



function eachKey(object, callback) {
  Object.keys(object).forEach(function(key) {
    callback(key, object[key]);
  });
}
