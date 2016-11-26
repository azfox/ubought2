module.exports = function(skill, info, bot, message) {

var img = "http://www.troupejewelry.com/media/catalog/product/3/0/3045_3026_8_paired.png"
var troupe_url = "http://www.troupejewelry.com/arrowsinitial/"
var uTube = "http://www.troupejewelry.com/media//video/troupe-hero-video-1.mp4"

var idx = message.text.indexOf('video info')
var idx2 = message.text.indexOf('this person needs time')

if (idx != -1 && idx2 == -1){

  //bot.reply(message, "Sick, Glad you are interested...Check out this video-gasm")
  var video_message = "Sick, Glad you are interested...Check out this video-gasm"
  sendTroupeVideo(bot, message, img, troupe_url, uTube,video_message)
}else if(idx2 != -1){
  bot.reply(message, "Dope, Dope, I will remind about this later. But be warned, this exclusive is going fast!!")
  bot.reply(message, "Any time you have more questions just chat back @ me")
  //function to remind you later
  return
}
else {
  var init_message = "yooooooooooo dude check it out! My illest new creation from #TroupeJewelry...You DO NOT want to miss this"
  sendTroupeCharm1(bot, message, img, troupe_url,uTube, init_message)

}


};

function sendTroupeCharm1(bot,message,img_url, campaign_url, uTub, init_message) {


  var payload_decision = message.text + ' video info'


  var attachments = {
      'type':'template',
      'payload':{
          'template_type':'generic',
          'elements':[
              {
                  'title': "My Troupe Campaign",
                  'image_url':img_url,
                  //'subtitle':"I got the Dopest Charms Around",
                  'buttons':[
                      {
                        'type':'postback',
                        'title':'More Info About this',
                        'payload': payload_decision
                      },
                      {
                        'type':'web_url',
                        'title':'I need to own this!',
                        'url': campaign_url
                      }
                  ]
              }
          ]
      }
  };

  bot.startConversation(message,function(err,convo)){
    var msg = createInitMessage(init_message);
    convo.ask(msg,[
      {
        pattern: 'Not Interested',
        callback: function(response,convo) {
          convo.say('OK sorry to bother you bro');
          convo.next();
        }
      },
      {
        default: true,
        callback: function(response,convo) {
          //send charm
          convo.ask(attachments, function(response, convo) {
            var video_message = "Sick, Glad you are interested...Check out this video-gasm"
            sendTroupeVideo(bot, message, img, troupe_url, uTube,video_message)
          });
          convo.next();
        }
      }


    ]);
  }
}

function sendTroupeVideo(bot,message,img_url, campaign_url, uTube, video_message) {

  var payload_decision = message.text + " this person needs time"
  /*
  var vid = {
      'type':'video',
      'payload':{
          "url": uTube
      },
  };
  */
  var vid = {
    "type":"template",
    "payload":{
      "template_type":"button",
      "text":video_message,
      "buttons":[
        {
          "type":"web_url",
          "url":uTube,
          "title":"Show Me the Vid"
        },
        {
          "type":"postback",
          "title":"Interested; Need Time",
          "payload": payload_decision
        },
        {
          "type":"web_url",
          "title":"Ready to Buy",
          "url": campaign_url
        }
      ]
    }
  }

  bot.reply(message,{
    attachment: vid,
  })

  //sendTroupeCharm2(bot,message, img_url, campaign_url);


}

function sendTroupeCharm2(bot,message,img_url, campaign_url) {

  //console.log(results[0].ItemAttributes[0].Title[0])
  //console.log(kw)
  //console.log(results[0].SmallImage[0].URL[0])
  //console.log(results[0].DetailPageURL[0])
  var payload_decision = message.text + ' this person needs time'


  var attachment = {
      'type':'template',
      'payload':{
          'template_type':'generic',
          'elements':[
              {
                  'title': "My Troupe Campaign",
                  'image_url':img_url,
                  'subtitle':"Dopest Charms Around",
                  'buttons':[
                      {
                        'type':'postback',
                        'title':'Maybe i want it let me think',
                        'payload': payload_decision
                      },
                      {
                        'type':'web_url',
                        'title':'I want to buy this!',
                        'url': campaign_url
                      }
                  ]
              }
          ]
      }
  };

  bot.reply(message, {
      attachment: attachment,
  });
}

function createInitMessage(init_message){
  var mid = {
    "type":"template",
    "payload":{
      "template_type":"button",
      "text":init_message,
      "buttons":[
        {
          "type":"postback",
          "title":"Tell Me More",
          "payload": "Tell Me more"
        },
        {
          "type":"postback",
          "title":"Not Interested",
          "payload": "Not Interested"
        }
      ]
    }
  }

  return mid
}