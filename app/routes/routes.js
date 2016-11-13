/* eslint-disable brace-style */
/* eslint-disable camelcase */
var facebook_handler = require('../controllers/botkit').handler
var geoip = require('geoip-lite')

console.log("made it through facebook_handler")

module.exports = function (app) {
  // public pages=============================================
  // root

  app.get('/', function (req, res) {
    res.render('home')
  })

  app.get('/webhook', function (req, res) {
    // This enables subscription to the webhooks
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === process.env.FACEBOOK_VERIFY_TOKEN) {
      res.send(req.query['hub.challenge'])
    }
    else {
      res.send('Incorrect verify token')
    }
  })

  app.post('/webhook', function (req, res) {
    facebook_handler(req.body, req.ip)
    //var geo_location = geoip.lookup(getRemoteIP(req));
    //console.log('geolocation: ' + geo_location)
    var s = req.ip
    s = s.replace(/^::ffff:/, "").toString();
    console.log(s)
    console.log('try 2 on Ip ' + geoip.lookup(s))
    res.send('ok')
  })


}


/* eslint-disable brace-style */
/* eslint-disable camelcase */
