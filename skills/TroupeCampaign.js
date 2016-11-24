module.exports = function(skill, info, bot, message) {

var img = "http://www.troupejewelry.com/media/catalog/product/3/0/3045_3026_8_paired.png"
var troupe_url = "http://www.troupejewelry.com/arrowsinitial/"
var uTube = "http://www.troupejewelry.com/media//video/troupe-hero-video-1.mp4"

var idx = message.text.indexOf('video info')
var idx2 = message.text.indexOf('this person needs time')

if (idx != -1){
  bot.reply(message, "Sick, Glad you are interested...Check out this video-gasm")
  sendTroupeVideo(bot, message, img, troupe_url, uTube)
}else if(idx2 != -1){
  bot.reply(message, "Dope, Dope, I will remind about this later. But be warned, this exclusive is going fast!!")
}
else {
  //console.log(message)

  bot.reply(message,"yooooooooooo dude check it out! My illest new creation from #TroupeJewelry...You DO NOT want to miss this")

  sendTroupeCharm1(bot, message, img, troupe_url)
}


};

function sendTroupeCharm1(bot,message,img_url, campaign_url) {

  //console.log(results[0].ItemAttributes[0].Title[0])
  //console.log(kw)
  //console.log(results[0].SmallImage[0].URL[0])
  //console.log(results[0].DetailPageURL[0])
  var payload_decision = message.text + ' video info'


  var attachment = {
      'type':'template',
      'payload':{
          'template_type':'generic',
          'elements':[
              {
                  'title': "My Troupe Campaign",
                  'image_url':img_url,
                  'subtitle':"I got the Dopest Charms Around",
                  'buttons':[
                      {
                        'type':'postback',
                        'title':'What is Troupe?',
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

  bot.reply(message, {
      attachment: attachment,
  });
}

function sendTroupeVideo(bot,message,img_url, campaign_url, uTube) {

  console.log("youtube: " + uTube)

  var attachment = {
      'type':'video',
      'payload':{
          "url": uTube
      }
  };


  bot.reply(message, {
      attachment: attachment,
  });

  setTimeout(sendTroupeCharm2(bot,message, img_url, campaign_url),5000);
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
