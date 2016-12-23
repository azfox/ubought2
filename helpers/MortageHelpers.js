var request = require("request")

exports.get_name_from_uid = function(uid, cb){

  console.log(uid)

  var request = require('request')
  var graph_api_str = "https://graph.facebook.com/v2.6/"
                       + uid
                       + "?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token="
                       + process.env.FACEBOOK_PAGE_TOKEN

   console.log(graph_api_str)


   request({
       url: graph_api_str,
       json: true
   }, function (error, response, body) {

       if (error) {
         console.log("Was unable to get the name of the user!!")
         cb("No_Name");
       }
       else {
         //console.log(body)
         var name = response.body.first_name + " " + response.body.last_name
         console.log(name)
         cb(name);
       }
   })

}

exports.init_applicant_info = function(){
  var empty_obj = {
    Borrower : {},
    Loan: {},
    Employment: {},
    Assets_Liabilities: {},
    Income : {},
    Declarations: {}
  };

  return empty_obj;


}

exports.create_email_and_phone_thread = function(message, convo, all_applicant_info){

  var got_to_form = {
    "type":"template",
    "payload":{
      "template_type":"button",
      "text":"So now I just want to get down some super simple information. It will only take a second, I promise.",
      "buttons":[
        {
          "type":"postback",
          "title":"Lets Go!",
          "payload": "yes"
        },
        {
          "type":"postback",
          "title":"Maybe Later",
          "payload": "no"
        }
      ]
    }
  }

  convo.addQuestion(
     got_to_form, function(response, convo) {
        // whoa, I got the postback payload as a response to my convo.ask!
        if(response == 'yes'){
          //post_to_simple_form()
          convo.say("Right now the form does not work. but it will soon.")
        }else{
          convo.changeTopic('bad_name')
        }
      }, null,'email_grab')
}


function post_to_simple_form(cb){
  var formBody = get_form1_body()

  request({
    url: "https://api.gupshup.io/sm/api/facebook/smartmsg/form/create",
    method: "POST",
    json: true,
    headers: {
        "content-type": "application/x-www-form-urlencoded",
        "apiKey": process.env.GUSH_UP_FORM_API
    },
    body: JSON.stringify(formBody)
  }, function (error, resp, body) {
      console.log("JUST CREATED FORM!")
      console.log(body.id)
  })
}

function get_form1_body(){
  var jsonBody = {
                        "title": "Enter Your details",
                        "message": "Thank You",
                        "callback-url":"Callback URL of your web service", //callback URL
                        "fields": [{
                            "type": "input",
                            "name": "name",
                            "label": "Name",
                            "validations": [{
                                "regex": "^[A-Z a-z]+$",
                                "msg": "Only alphabets are allowed in this field"
                            }, {
                                "regex": "^[A-Z a-z]{6,}$",
                                "msg": "Minimum 6 characters required"
                            }]
                        }, {
                            "type": "radio",
                            "name": "gender",
                            "label": "Gender",
                            "options": ["Male", "Female"],
                            "validations": [{
                                "regex": "",
                                "msg": ""
                            }]
                        }, {
                            "type": "select",
                            "name": "account",
                            "label": "AccountType",
                            "options": ["current", "savings"],
                            "validations": [{
                                "regex": "",
                                "msg": ""
                            }]
                        }, {
                            "type": "checkbox",
                            "name": "interest",
                            "label": "Interests",
                            "options": ["Cooking", "Reading"],
                            "validations": [{
                                "regex": "",
                                "msg": ""
                            }]
                        }],
                        "users": ["users"]
                    };

                return jsonBody;
}
