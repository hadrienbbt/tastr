// app.js
// Hadrien Barbat

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var querystring = require('querystring');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoClient = require("mongodb").MongoClient;
var ObjectID = require('mongodb').ObjectID;
var tvst = require('tvshowtime-api');

var port = 8080;

// Module dependencies
require('./js/response.js');

var app = express();
var db;
var conf = require('../tastr/const/conf.js');

// db connect
MongoClient.connect("mongodb://localhost/tastr", function(error, bdd) {
    if (error) throw error;

    console.log("Connecté à la base de données 'tastr'");
    db = bdd;
});

app.use(cookieParser())
    .use(session({secret: 'ssshhhhh'}))
    .use(bodyParser.json()) // support json encoded bodies
    .use(bodyParser.urlencoded({extended: true})) // support encoded bodies
    .use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

var i = 0;
app.get('/', function(req,res) {
    i++ % 2 == 0 ? console.log('ping !') : console.log('pong !') ;
    res.respond({message: "Message du serveur "+port+": Hello World!"},200);
});

app.post('/user/new', function(req,res) {
    var user = req.body;
    console.log('nouvel utilisateur ! '+ user);
    db.collection("user").findAndModify(
        {email: user.email},
        {},{
            name: user.name,
            email: user.email,
            id_moodmusic: user.id_moodmusic,
            show_infos: user.show_infos
        },
        {new: true,upsert: true}, function(err,resp) {
            if(err) throw err;
            res.respond({id_user: resp.value._id},200);
        }
    );
});

// Get the user with given id
app.get('/user', function(req,res) {
    console.log(req.param('id_user'));
    var id_user = ObjectID.isValid(req.param('id_user')) ? new ObjectID(req.param('id_user')) : null;
    id_user ?
        db.collection("user").find({_id: id_user}).toArray(function(err,resp) {
            res.respond({user: resp[0]},200);
        })
        : res.respond({user: null},200);
});

app.get('/user/findgroups', function(req,res) {
    var access_token = req.param('access_token');
});

app.post('/tvst/token', function(req,res) {
    var code = req.param('code');
    var url = 'https://api.tvshowtime.com/v1/oauth/access_token';
    console.log(code);
    var options = JSON.stringify({
        client_id: conf.tvst_key,
        client_secret: conf.tvst_secret,
        redirect_uri: conf.server_domain + '/tvst/token/authorize',
        code: code
    });

    request.post(url,options,function(error,response) {
        if(error) throw error;
        console.log(response.body);
    });
});

app.post('/tvst/token/authorize', function(req,res) {
    console.log(req);
    res.respond('coucou toi',200);
});

app.listen(port);
console.log("Listening on " + port);