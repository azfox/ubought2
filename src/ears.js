

var BotKit = require('botkit');

module.exports = Ears;



var Bot = Botkit.facebookbot({
})

function Ears(bot) {
  this.scopes = [
    'message_received'
  ];

  this.bot = bot;

}

Ears.prototype.listen = function() {
  return this;
}

Ears.prototype.hear = function(pattern, callback) {
  Bot.hears(pattern, this.scopes, callback);
  return this;
};
