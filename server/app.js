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

app.get('/', function(req,res) {
    console.log('un nouveau !');
    res.respond({message: "Message du serveur: Hello World!"},200);
});

app.listen(port);
console.log("(: Listening on " + port);
