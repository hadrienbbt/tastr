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
var Tastr = require('./js/Model_tastr');

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
        {new: true, upsert: true}, function(err,resp) {
            if(err) throw err;
            res.redirect('/user/refresh/tvhows?id_user=' + resp.value._id);
        }
    );
});

//
app.get('/user/show/refresh', function(req,res) {
    var id_user = ObjectID.isValid(req.param('id_user')) ? new ObjectID(req.param('id_user')) : null;

    id_user ?
        // Obtenir access_token des séries
        // TODO avec TVShowtime : différencier les show_provider pour appeler la bonne fonction du modèle
        db.collection("user").find({_id: id_user}).toArray(function(err,resp) {
            var user = resp[0];
            console.log(JSON.stringify(user));

            // Obtenir les séries suivies par l'utilisateur
            Tastr.getMemberInfos(user.show_infos.access_token).then((member) => {
                console.log('reponse de librairie reçue');
                var seriesSuivies = member.favorites.concat(member.shows);
                var countDone = 0;

                // Ajouter chaque séries à la bdd (si besoin)...
                for(var i = 0; i< seriesSuivies.length; i++) {
                    var serieCourante = seriesSuivies[i];
                    db.collection('serie').findAndModify(
                        {id_tvdb: serieCourante.thetvdb_id},
                        {},{
                            id_tvdb: serieCourante.thetvdb_id,
                            id_imdb: serieCourante.imdb_id,
                            titre: serieCourante.title,
                            genres: serieCourante.genres,
                            note: {
                                total: serieCourante.notes.total,
                                moyenne: serieCourante.notes.mean
                            },
                            images: serieCourante.images,
                            description: serieCourante.description
                        },{new: true, upsert: true}, (err,resp) => {
                            // ... et l'affecter à l'utilisateur
                            if(err) throw err;
                            var id_serie = resp.value._id.toString();
                            db.collection('user').update(
                                {_id: id_user},
                                {$addToSet: {series: id_serie}},
                                {upsert: true},
                                (err,resp) => {
                                    if(err) throw err;
                                    // S'il n'y a plus de série à traiter ensuite, on y va
                                    ++countDone == seriesSuivies.length ?
                                        res.redirect('/user/group/find?id_user='+id_user) : null;
                                }
                            );
                        }
                    );
                }
            }, (err) => res.respond(err,500))
        })
        : res.respond({user: null},200);

});

app.get('/user/group/find', function(req,res) {
    var id_user = ObjectID.isValid(req.param('id_user')) ? new ObjectID(req.param('id_user')) : null;

    id_user ?
        // Obtenir l'utilisateur cible
        // TODO avec TVShowtime : différencier les show_provider pour appeler la bonne fonction du modèle

        // Obtenir tous les utilisateurs et extraire la cible
        db.collection("user").find().toArray(function(err,resp) {
            var i = 0;
            while (resp[i]._id != id_user.toString()) i++;
            var user = resp.splice(i, 1)[0];
            var others = resp;//user
            //var user = user[0];

            // Regarder quels groupes on peut former selon les séries de l'utilisateur
            // Savoir quels personnes regardent chaque série de l'utilisateur

            var usersPerSeries = {};
            console.log("recherche d'amis pour les séries " + user.series);
            for (var i = 0; i < user.series.length; i++) {
                usersPerSeries[user.series[i]] = new Array();
                for (var j = 0; j < others.length; j++) {

                    // Si la personne regarde une même série sn que l'utilisateur :
                    // on ajoute la personne dans la case sn du tableau usersPerSeries
                    others[j].series.includes(user.series[i]) ? usersPerSeries[user.series[i]].push(others[j]._id) : null;
                }
            }
            // On trie le tableau par taille de cases

            console.log(usersPerSeries);
            res.respond({groups: usersPerSeries}, 200);
        })
    : res.respond({user: null},200);
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