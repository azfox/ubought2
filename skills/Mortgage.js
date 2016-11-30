module.exports = function(skill, info, bot, message) {

  bot.createConversation(message, function(err, convo) {
      //todo make the yes thread into convo.addQuestion

      // create a path for when a user says YES
      convo.addMessage({
              text: 'Right On! You\'ve come to the right place.  I\'m your man. Lets get started.',
      },'yes_thread');

      // create a path for when a user says NO
      convo.addMessage({
          text: 'That is too bad! Chat back at me if you change your mind.',
      },'no_thread');

      // create a path where neither option was matched
      // this message has an action field, which directs botkit to go back to the `default` thread after sending this message.
      convo.addMessage({
          text: 'Sorry I did not understand. Try again',
          action: 'default',
      },'bad_response');

      init_question("So, you are looking for a new Mortage, huh?")

      convo.activate();
  });


};


function init_question(question, convo){
    var inital = {
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":question,
        "buttons":[
          {
            "type":"postback",
            "title":"Yessir",
            "payload": "yes"
          },
          {
            "type":"postback",
            "title":"No Thanks",
            "payload": "no"
          }
        ]
      }
    }
    // Create a yes/no question in the default thread...

    convo.ask({attachment = inital}, [
        {
            pattern: 'yes',
            callback: function(response, convo) {
                convo.changeTopic('yes_thread');
            },
        },
        {
            pattern: 'no',
            callback: function(response, convo) {
                convo.changeTopic('no_thread');
            },
        },
        {
            default: true,
            callback: function(response, convo) {
                convo.changeTopic('bad_response');
            },
        }
    ]);

  }






/*
convo.ask({
            attachment: {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                        {
                            'title': 'Classic White T-Shirt',
                            'image_url': 'http://petersapparel.parseapp.com/img/item100-thumb.png',
                            'subtitle': 'Soft white cotton t-shirt is back in style',
                            'buttons': [
                                {
                                    'type': 'web_url',
                                    'url': 'https://petersapparel.parseapp.com/view_item?item_id=100',
                                    'title': 'View Item'
                                },
                                {
                                    'type': 'web_url',
                                    'url': 'https://petersapparel.parseapp.com/buy_item?item_id=100',
                                    'title': 'Buy Item'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Bookmark Item',
                                    'payload': 'White T-Shirt'
                                }
                            ]
                        },
                        {
                            'title': 'Classic Grey T-Shirt',
                            'image_url': 'http://petersapparel.parseapp.com/img/item101-thumb.png',
                            'subtitle': 'Soft gray cotton t-shirt is back in style',
                            'buttons': [
                                {
                                    'type': 'web_url',
                                    'url': 'https://petersapparel.parseapp.com/view_item?item_id=101',
                                    'title': 'View Item'
                                },
                                {
                                    'type': 'web_url',
                                    'url': 'https://petersapparel.parseapp.com/buy_item?item_id=101',
                                    'title': 'Buy Item'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Bookmark Item',
                                    'payload': 'Grey T-Shirt'
                                }
                            ]
                        }
                    ]
                }
            }
        }, function(response, convo) {
            // whoa, I got the postback payload as a response to my convo.ask!
            convo.next();
        });
*/
