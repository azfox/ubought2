module.exports = function(skill, info, bot, message) {
var request = require("request")

var amazon = require("amazon-product-api")

bot.reply(message, "Ok please wait while I get you the top 4 results on Amazon... :)")

var client = amazon.createClient({
  awsId: process.env.AMZN_ACCESS_KEY,
  awsSecret: process.env.AMZN_SECRET_ACCESS_KEY,
  awsTag: process.env.AMZN_ASSOSCIATE_TAG
});

//eventual keywords will be from the message.itents from wit ai but im not there yet
var kw = 'cheap running shoes'

//I will update the client search atsome pont but for i want to focus on this
client.itemSearch({
  keywords: kw,
  availability: 'Available',
  responseGroup: 'Images,Small,OfferSummary'
}, function(err, results, response) {
  if (err) {
    console.log(err);
  } else {
    //console.log(results);  // products (Array of Object)
    console.log("Amazon Results Found")
    //console.log(response); // response (Array where the first element is an Object that contains Request, Item, etc.)
    send4AmazonResults(bot,message,results,kw);

  }
});


};



//amazon template
function send4AmazonResults(bot,message,results,kw) {
    //using the rusults, build a list of 4
    //need img_url, subtitles, action_url, titles
    var img_url =[]
    var subtitles =[]
    var action_url =[]
    var titles =[]
    for (var e = 0; e < 4; e++) {
        //var image
        //var subtitle
        //var action
        var title = kw
        titles.push(title)
        subtitles.push(results[e].ItemAttributes[0].Title[0])
        action_url.push(results[e].DetailPageURL[0])
        img_url.push(results[e].SmallImage[0].URL[0])
        console.log(results[e].ItemAttributes[0].Title[0])

    }


    var messageData = {
          "type": "template",
          "payload": {
              "template_type": "list",
              "top_element_style": "compact",
              "elements": [
                  {
                      "title": titles[0],
                      "image_url": img_url[0],
                      "subtitle": subtitles[0],
                      "buttons": [
                          {
                              "title": "Buy",
                              "type": "web_url",
                              "url": action_url[0]
                              //"messenger_extensions": true,
                              //"webview_height_ratio": "tall",
                              //"fallback_url": "https://www.amazon.com/"
                          }
                      ]
                  },
                  {
                      "title": titles[1],
                      "image_url": img_url[1],
                      "subtitle": subtitles[1],
                      "buttons": [
                          {
                              "title": "Buy",
                              "type": "web_url",
                              "url": action_url[1]
                              //"messenger_extensions": true,
                              //"webview_height_ratio": "tall",
                              //"fallback_url": "https://www.amazon.com/"
                          }
                      ]
                  },
                  {
                      "title": titles[2],
                      "image_url": img_url[2],
                      "subtitle": subtitles[2],
                      "buttons": [
                          {
                              "title": "Buy",
                              "type": "web_url",
                              "url": action_url[2]
                              //"messenger_extensions": true,
                              //"webview_height_ratio": "tall",
                              //"fallback_url": "https://www.amazon.com/"
                          }
                      ]
                  },
                  {
                      "title": titles[3],
                      "image_url": img_url[3],
                      "subtitle": subtitles[3],
                      "buttons": [
                          {
                              "title": "Buy",
                              "type": "web_url",
                              "url": action_url[3]
                              //"messenger_extensions": true,
                              //"webview_height_ratio": "tall",
                              //"fallback_url": "https://www.amazon.com/"
                          }
                      ]
                  }
              ],
               "buttons": [
                  {
                      "title": "View More",
                      "type": "postback",
                      "payload": 'more Amazon shoes'
                  }
              ]
          }
    };
    /*
    bot.reply(message, {
    attachment: messageData,
    });
    */
    //bot.reply(message, messageData);
    /*
    bot.reply(message,{
      attachment: messageData,
    },function(err,resp) {
      console.log("error trying to send attachments")
      //console.log(messageData)
      console.log(err,resp);
      console.log(JSON.stringify(err));
      console.log("do i need a sender id??")
    });
    */

}

function send4AmazonResults2(bot,message,results,kw) {

  console.log(results[0].ItemAttributes[0].Title[0])
  console.log(kw)
  console.log(results[0].SmallImage[0].URL[0])
  console.log(results[0].DetailPageURL[0])

  var attachment = {
      'type':'template',
      'payload':{
          'template_type':'generic',
          'elements':[
              {
                  'title': kw,
                  'image_url':results[0].LargeImage[0].URL[0],
                  'subtitle':results[0].ItemAttributes[0].Title[0],
                  'buttons':[
                      {
                        'type':'web_url',
                        'title':'Buy',
                        'url': results[0].DetailPageURL[0]
                      }
                  ]
              },
              {
                  'title': kw,
                  'image_url':results[1].LargeImage[0].URL[0],
                  'subtitle':results[1].ItemAttributes[0].Title[0],
                  'buttons':[
                      {
                        'type':'web_url',
                        'title':'Buy',
                        'url': results[1].DetailPageURL[0]
                      }
                  ]
              },
              {
                  'title': kw,
                  'image_url':results[2].LargeImage[0].URL[0],
                  'subtitle':results[2].ItemAttributes[0].Title[0],
                  'buttons':[
                      {
                        'type':'web_url',
                        'title':'Buy',
                        'url': results[2].DetailPageURL[0]
                      }
                  ]
              },
              {
                  'title': kw,
                  'image_url':results[3].LargeImage[0].URL[0],
                  'subtitle':results[3].ItemAttributes[0].Title[0],
                  'buttons':[
                      {
                        'type':'web_url',
                        'title':'Buy',
                        'url': results[3].DetailPageURL[0]
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

//need img_url, subtitles, action_url, titles

"attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "First card",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Second card",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
