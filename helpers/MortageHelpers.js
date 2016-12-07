exports.get_name_from_uid = function(uid){

  console.log(uid)

  var request = require('request')
  var graph_api_str = "https://graph.facebook.com/v2.6/"
                       + uid
                       + "?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token="
                       + process.env.FACEBOOK_PAGE_TOKEN

   console.log(graph_api_str)
   /*
   request.get(graph_api_str,
     function (err, res, body) {
       if (err) {
         console.log("Was unable to get the name of the user!!")
         return "No_Name"
       }
       else {
         console.log()
         return res.first_name + " " + res.last_name

       }
     }
   )
   */

   request({
       url: graph_api_str,
       json: true
   }, function (error, response, body) {

       if (error) {
         console.log("Was unable to get the name of the user!!")
         return "No_Name"
       }
       else {
         console.log()
         return res.first_name + " " + res.last_name

       }
   })

}
