/* eslint-disable brace-style */
/* eslint-disable camelcase */
// CONFIG===============================================
//this is my ears and mouth of the bot
var Botkit = require('botkit')
var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/botkit-demo' || 'mongodb://heroku_750s8q8l:l9mfrebhqqet9j90moo62scac6@ds051170.mlab.com:51170/heroku_750s8q8l'
var db = require('../../config/db')({mongoUri: mongoUri})
var request = require('request')

//stuff added by Aaron to see if he could use nlp
var fs = require('fs');

var Train = require('./train');
var Brain = require('./brain');
var myBrain = new Brain()
var builtinPhrases = require('../../builtins');
//done adding stuff

//ip info
var geoip = require("geoip-lite");

var controller = Botkit.facebookbot({
  debug: false,
  access_token: process.env.FACEBOOK_PAGE_TOKEN,
  verify_token: process.env.FACEBOOK_VERIFY_TOKEN,
  storage: db
})

var bot = controller.spawn({})

// subscribe to page events
request.post('https://graph.facebook.com/me/subscribed_apps?access_token=' + process.env.FACEBOOK_PAGE_TOKEN,
  function (err, res, body) {
    if (err) {
      controller.log('Could not subscribe to page messages')
    }
    else {
      controller.log('Successfully subscribed to Facebook events:', body)
      console.log('Botkit activated')

      // start ticking to send conversation messages
      controller.startTicking()
    }
  }
)

console.log('botkit')

//learn some things then listen
var customPhrasesText;
var customPhrases;
try {
  console.log(__dirname + '/../../custom-phrases.json')
  customPhrasesText = fs.readFileSync(__dirname + '/../../custom-phrases.json').toString();
} catch (err) {
  throw new Error('Uh oh, uBought could not find the ' +
    'custom-phrases.json file, did you move it?');
}
try {
  customPhrases = JSON.parse(customPhrasesText);
} catch (err) {
  throw new Error('Uh oh, custom-phrases.json was ' +
    'not valid JSON! Fix it, please? :)');
}

console.log('uBought is learning...');
Teach = myBrain.teach.bind(myBrain);
eachKey(customPhrases, Teach);
eachKey(builtinPhrases, Teach);
myBrain.think();
console.log('uBought finished learning, time to listen...');


// this is triggered when a user clicks the send-to-messenger plugin
controller.on('facebook_optin', function (bot, message) {
  bot.reply(message, 'Welcome, friend')
})

// user said hello
controller.hears(['hello'], 'message_received', function (bot, message) {
  bot.reply(message, 'Hey there.')
})

controller.hears(['TRAINING TIME'], 'message_received', function (bot, message) {
  console.log('Delegating to on-the-fly training module...');
  Train(myBrain, speech, message);
})



// user says anything else
controller.hears('(.*)', 'message_received', function (bot, message) {
  bot.reply(message, 'you said ' + message.match[1])
  var interpretation = myBrain.interpret(message.text);
  console.log('uBought heard: ' + message.text);
  console.log('uBought interpretation: ', interpretation);
  if (interpretation.guess) {
    console.log('Invoking skill: ' + interpretation.guess);
    myBrain.invoke(interpretation.guess, interpretation, bot, message);
  } else {
    bot.reply(message, '...Hmm... I don\'t have a response what you said... I\'ll save it and try to learn about it later.');
    // speech.reply(message, '```\n' + JSON.stringify(interpretation) + '\n```');

    // append.write [message.text] ---> to a file
    fs.appendFile('phrase-errors.txt', '\nChannel: ' + message.channel + ' User:'+ message.user + ' - ' + message.text, function (err) {
      console.log('\n\tBrain Err: Appending phrase for review\n\t\t' + message.text + '\n');
      });
  }
});

// this function processes the POST request to the webhook
var handler = function (obj, ip) {
  controller.debug('GOT A MESSAGE HOOK')
  var message
  if (obj.entry) {
    for (var e = 0; e < obj.entry.length; e++) {
      for (var m = 0; m < obj.entry[e].messaging.length; m++) {
        var facebook_message = obj.entry[e].messaging[m]
        //console.log("Entire message -->")
        //console.log(obj.entry[e])

        console.log(facebook_message)
        //var location = geoip.lookup(ip)
        //console.log("IP Based Location is: " + location.city + ", " + location.region)

        // normal message
        if (facebook_message.message) {
          message = {
            text: facebook_message.message.text,
            user: facebook_message.sender.id,
            channel: facebook_message.sender.id,
            timestamp: facebook_message.timestamp,
            seq: facebook_message.message.seq,
            mid: facebook_message.message.mid,
            attachments: facebook_message.message.attachments
            //lat: facebook_message.message.attachments[0].payload.coordinates.lat,
            //lng: facebook_message.message.attachments[0].payload.coordinates.long
          }


          // save if user comes from m.me adress or Facebook search
          create_user_if_new(facebook_message.sender.id, facebook_message.timestamp)

          controller.receiveMessage(bot, message)
        }
        // clicks on a postback action in an attachment
        else if (facebook_message.postback) {
          // trigger BOTH a facebook_postback event
          // and a normal message received event.
          // this allows developers to receive postbacks as part of a conversation.
          message = {
            payload: facebook_message.postback.payload,
            user: facebook_message.sender.id,
            channel: facebook_message.sender.id,
            timestamp: facebook_message.timestamp
          }

          controller.trigger('facebook_postback', [bot, message])

          message = {
            text: facebook_message.postback.payload,
            user: facebook_message.sender.id,
            channel: facebook_message.sender.id,
            timestamp: facebook_message.timestamp
          }

          controller.receiveMessage(bot, message)
        }
        // When a user clicks on "Send to Messenger"
        else if (facebook_message.optin) {
          message = {
            optin: facebook_message.optin,
            user: facebook_message.sender.id,
            channel: facebook_message.sender.id,
            timestamp: facebook_message.timestamp
          }

            // save if user comes from "Send to Messenger"
          create_user_if_new(facebook_message.sender.id, facebook_message.timestamp)

          controller.trigger('facebook_optin', [bot, message])
        }
        // message delivered callback
        else if (facebook_message.delivery) {
          message = {
            optin: facebook_message.delivery,
            user: facebook_message.sender.id,
            channel: facebook_message.sender.id,
            timestamp: facebook_message.timestamp
          }

          controller.trigger('message_delivered', [bot, message])
        }
        else {
          controller.log('Got an unexpected message from Facebook: ', facebook_message)
        }
      }
    }
  }
}

var create_user_if_new = function (id, ts) {
  controller.storage.users.get(id, function (err, user) {
    if (err) {
      console.log(err)
    }
    else if (!user) {
      controller.storage.users.save({id: id, created_at: ts})
    }
  })
}


function eachKey(object, callback) {
  Object.keys(object).forEach(function(key) {
    callback(key, object[key]);
  });
}

exports.handler = handler
/* eslint-disable brace-style */
/* eslint-disable camelcase */
