
module.exports = function(skill, info, bot, message) {
var request = require("request")

var url = "http://webknox.com/api/jokes/oneLiner?apiKey=behjfbafgcsqfmakvhsmygxfnkxvdjc"

request({
    url: url,
    json: true
}, function (error, response, body) {

    if (!error && response.statusCode === 200) {
        //console.log(body) // Print the json response
        bot.reply(message,body.text+ ':#JokingAround:');
    }
})

};
