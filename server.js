// modules =================================================
var express = require('express')     // framework d'appli
var app = express()
var bodyParser = require('body-parser') // BodyParser pour POST
var http = require('http').Server(app)      // préparer le serveur web
var dotenv = require('dotenv').config()
var path = require('path')


// configuration ===========================================

// load environment variables,
// either from .env files (development),
// heroku environment in production, etc...
//console.log('About to Start:')
//dotenv.load()
//console.log('Finished dotenv..moving to express')

app.use(express.static(path.join(__dirname, '/public')))

// parsing
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing url encoded

// view engine ejs
app.set('view engine', 'ejs')
console.log('Finished Express..requiring App')


// routes
require('./app/routes/routes')(app)
require('./skills/Mortage')


// port for Heroku
app.set('port', (process.env.PORT || 5000))

// START ===================================================
http.listen(app.get('port'), function () {
  console.log('listening on port ' + app.get('port'))
})
