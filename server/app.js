/**
 * Created by hadrien1 on 07/02/17.
 */

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var port = 8080;

// Module dependencies
require('./js/response.js');

var app = express();
var i = 0;

app.get('/', function(req,res) {
    i++ % 2 == 0 ? console.log('ping !') : console.log('pong !') ;
    res.respond({message: "Message du serveur "+port+": Hello World!"},200);
});

app.listen(port);
console.log("(: Listening on " + port);
