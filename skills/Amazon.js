module.exports = function(skill, info, bot, message) {


if(message.text == 'I only Load 8.  Sorry You didn\'t  find what you were looking for'){
  bot.reply(message, message.text)
  return;
}

var request = require("request")

var amazon = require("amazon-product-api")

var idx = message.text.indexOf('4 more results')
var sNum = 0

if (idx == -1){
  bot.reply(message, "Ok please wait while I get you the top 4 results on Amazon... :)")
}else {
  sNum = 4
}



var kw = ''
try {
  kw = message.intents[0].entities.search_query[0].value
}
catch(err) {
  console.log(message.intents[0].entities.search_query[0].value)
  //console.log(message.intents.entities[0])
  bot.reply(message, "Oh Man.  I would love to tell you the Weather but you never told me where...the world is vastly different you know!!")
  return;
}

var client = amazon.createClient({
  awsId: process.env.AMZN_ACCESS_KEY,
  awsSecret: process.env.AMZN_SECRET_ACCESS_KEY,
  awsTag: process.env.AMZN_ASSOSCIATE_TAG
});

//eventual keywords will be from the message.itents from wit ai but im not there yet
//var kw = 'cheap running shoes'

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
    send4AmazonResults2(bot,message,results,kw,sNum);

  }
});


};



//facebook list template that i CANT GET TO WORK!!!!
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

function send4AmazonResults2(bot,message,results,kw, startNum) {

  //console.log(results[0].ItemAttributes[0].Title[0])
  //console.log(kw)
  //console.log(results[0].SmallImage[0].URL[0])
  //console.log(results[0].DetailPageURL[0])
  var payload_decision = message.text + ' 4 more results'
  if(startNum != 0){
    payload_decision = 'I only Load 8.  Sorry You didn\'t  find what you were looking for'
  }


  var attachment = {
      'type':'template',
      'payload':{
          'template_type':'generic',
          'elements':[
              {
                  'title': kw,
                  'image_url':results[startNum].MediumImage[0].URL[0],
                  'subtitle':results[startNum].ItemAttributes[0].Title[0],
                  'buttons':[
                      {
                        'type':'web_url',
                        'title':'Buy',
                        'url': results[startNum].DetailPageURL[0]
                      }
                  ]
              },
              {
                  'title': kw,
                  'image_url':results[startNum+1].MediumImage[0].URL[0],
                  'subtitle':results[startNum+1].ItemAttributes[0].Title[0],
                  'buttons':[
                      {
                        'type':'web_url',
                        'title':'Buy',
                        'url': results[startNum+1].DetailPageURL[0]
                      }
                  ]
              },
              {
                  'title': kw,
                  'image_url':results[startNum+2].MediumImage[0].URL[0],
                  'subtitle':results[startNum+2].ItemAttributes[0].Title[0],
                  'buttons':[
                      {
                        'type':'web_url',
                        'title':'Buy',
                        'url': results[startNum+2].DetailPageURL[0]
                      }
                  ]
              },
              {
                  'title': kw,
                  'image_url':results[startNum+3].MediumImage[0].URL[0],
                  'subtitle':results[startNum+3].ItemAttributes[0].Title[0],
                  'buttons':[
                      {
                        'type':'web_url',
                        'title':'Buy',
                        'url': results[startNum+3].DetailPageURL[0]
                      },
                      {
                        "type":"postback",
                        "title":"More Results",
                        "payload": payload_decision
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
