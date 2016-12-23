var util = require('../helpers/MortageHelpers');

module.exports = function(skill, info, bot, message) {



  bot.createConversation(message, function(err, convo) {
      //todo make the yes thread into convo.addQuestion
      all_applicant_info = util.init_applicant_info();


      load_all_threads(message, convo, all_applicant_info)

      lets_get_started(message, convo,all_applicant_info)

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

      init_question("So, you are looking for a new Mortage, huh?", convo)

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

    convo.ask({attachment: inital}, [
        {
            pattern: 'yes',
            callback: function(response, convo) {
                convo.changeTopic('init_yes_thread');
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


function lets_get_started(message, convo, all_applicant_info){

  util.get_name_from_uid(message.user, function(name){

    convo.addMessage({
            text: 'Right On! You\'ve come to the right place.  I\'m your man. Lets get started.',
    },'init_yes_thread');

    convo.addQuestion(
      "I have you name as: " + name + ". Is this right?", function(response, convo) {
          // whoa, I got the postback payload as a response to my convo.ask!
          if(response == 'yes'){
            all_applicant_info.Borrower.Name = name
            convo.say("Nice to be working with you " + name + "!")
            convo.changeTopic("email_grab")
          }else{
            convo.changeTopic('bad_name')
          }
        }, null,'init_yes_thread')

    console.log("done with lets get started.")
  })





}


function load_all_threads(message, convo, all_applicant_info){
  util.create_email_and_phone_thread(message, convo, all_applicant_info)
}
