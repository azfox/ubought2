module.exports = function(skill, info, bot, message) {

//i plan on having this be a catch all for every stupid wit story i make
//but for now i will build the defult which will be to Bing the results

var Bing = require('node-bing-api')({ accKey: process.env.BING_ACCT_KEY });

var query = ''
if(message.intents[0].entities["search_query"][0].value && message.intents[0].entities["search_query"][0].value != null
    && message.intents[0].entities["search_query"][0].value != ''){
  query = message.intents[0].entities["search_query"][0].value
}else{
  bot.reply(message, '...Hmm... I don\'t have a response what you said... I\'ll save it and try to learn about it later. What else can i do for you??'); //LOL no i wont
  return;
}
if(1 == 2){
  //here is where i will handle wit ai stories and shit what the qery
  //but on any error in the query, i will just search for it on bing
}else{
  Bing.web(query, {
      top: 10,  // Number of results (max 50)
      skip: 3   // Skip first 3 results that i assume to be Adds... take that MSFT!!!!
    }, function(error, res, body){

      if(error){
        bot.reply(message, "I tried a web search for: " + query + "\n BUT I may have run run out of Free API calls to Bing search..."
                          + " You know you got a second Rate bot when he/she/it/(GOD??) is trying to use Bing instead of the GOOGLE");
        return;
      }

      send4BingResults(bot,message,query,body);

      //console.log(body.webPages.value[0]);
      //console.log(body.webPages.value[1]);
    });
}


};


function send4BingResults(bot,message,kw, bingBody) {




  var attachment = {
      'type':'template',
      'payload':{
          'template_type':'generic',
          'elements':[
              {
                  'title': bingBody.webPages.value[0].name,
                  'subtitle':bingBody.webPages.value[0].snippet,
                  'buttons':[
                      {
                        'type':'web_url',
                        'title':'Go To Link',
                        'url': bingBody.webPages.value[0].url
                      }
                  ]
              },
              {
                  'title': bingBody.webPages.value[1].name,
                  'subtitle':bingBody.webPages.value[1].snippet,
                  'buttons':[
                      {
                        'type':'web_url',
                        'title':'Go To Link',
                        'url': bingBody.webPages.value[1].url
                      }
                  ]
              },
              {
                  'title': bingBody.webPages.value[2].name,
                  'subtitle':bingBody.webPages.value[2].snippet,
                  'buttons':[
                      {
                        'type':'web_url',
                        'title':'Go To Link',
                        'url': bingBody.webPages.value[2].url
                      }
                  ]
              },
              {
                  'title': bingBody.webPages.value[3].name,
                  'subtitle':bingBody.webPages.value[3].snippet,
                  'buttons':[
                      {
                        'type':'web_url',
                        'title':'Go To Link',
                        'url': bingBody.webPages.value[3].url
                      }
                  ]
              }
          ]
      }
  };

  bot.reply(message, "Here are some web results that might help you:")
  bot.reply(message, {
      attachment: attachment,
  });
}
