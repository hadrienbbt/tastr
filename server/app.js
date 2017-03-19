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
            res.respond({id_user: resp.value._id},200);
        }
    );
});

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
                    db.collection('show').findAndModify(
                        {id_tvdb: serieCourante.thetvdb_id},
                        {},{
                            id_tvdb: serieCourante.thetvdb_id,
                            id_imdb: serieCourante.imdb_id,
                            title: serieCourante.title,
                            genres: serieCourante.genres,
                            note: {
                                total: serieCourante.notes.total,
                                mean: serieCourante.notes.mean
                            },
                            images: serieCourante.images,
                            description: serieCourante.description
                        },{new: true, upsert: true}, (err,resp) => {
                            // ... et l'affecter à l'utilisateur
                            if(err) throw err;
                            var id_serie = resp.value._id.toString();
                            db.collection('user').update(
                                {_id: id_user},
                                {$addToSet: {shows: id_serie}},
                                {upsert: true},
                                (err,resp) => {
                                    if(err) throw err;
                                    // S'il n'y a plus de série à traiter ensuite, on y va
                                    ++countDone == seriesSuivies.length ?
                                        res.redirect('/user/show/friends?id_user='+id_user) : null;
                                }
                            );
                        }
                    );
                }
            }, (err) => res.respond(err,500))
        })
        : res.respond({user: null},200);
});

app.get('/user/show/friends', function(req,res) {
    var id_user = ObjectID.isValid(req.param('id_user')) ? new ObjectID(req.param('id_user')) : null;

    id_user ?
        // Obtenir tous les utilisateurs et extraire la cible
        db.collection("user").find().toArray(function(err,resp) {
            var i = 0;
            while (resp[i]._id != id_user.toString()) i++;
            var user = resp.splice(i, 1); //[0];
            var others = user; //resp
            user = user[0];

            // Regarder quels groupes on peut former selon les séries de l'utilisateur
            // Savoir quels personnes regardent chaque série de l'utilisateur

            var usersPerSeries = {};
            console.log("recherche d'amis pour les séries...");
            for (var i = 0; i < user.shows.length; i++) {
                usersPerSeries[user.shows[i]] = new Array();
                for (var j = 0; j < others.length; j++) {

                    // Si la personne regarde une même série sn que l'utilisateur :
                    // on ajoute la personne dans la case sn du tableau usersPerSeries
                    others[j].shows.includes(user.shows[i]) ? usersPerSeries[user.shows[i]].push(others[j]._id) : null;
                }
            }
            // On trie le tableau par taille de cases

            //console.log(usersPerSeries);
            req.session.usersPerSeries = usersPerSeries;
            res.redirect('/group/find/possible?id_user='+id_user);
        })
        : res.respond({user: null},200);
});

// Regrouper les series que plusieurs personnes regardent dans un objet similaire à un groupe
app.get('/group/find/possible', function(req,res) {

    var usersPerSeries;
    var id_user = ObjectID.isValid(req.param('id_user')) ? new ObjectID(req.param('id_user')) : null;

    if (req.session.usersPerSeries) {
        usersPerSeries = req.session.usersPerSeries;
        console.log(usersPerSeries);

        var groupPossible = [];

        // récupérer chaque show et le comparer avec les autres
        for (var id_show in usersPerSeries) {
            var id_viewers = usersPerSeries[id_show];

            groupPossible.push({
                shows: [{_id: id_show}],
                participants: id_viewers
            });

            delete usersPerSeries[id_show];

            for (var id_show_compare in usersPerSeries) {
                var id_viewers_compare = usersPerSeries[id_show_compare];
                // Si tous les viewers de id_viewers sont dans id_viewers_compare :
                // On ajoute la série aux shows de groupPossible
                var regarde;
                if (id_viewers.length == id_viewers_compare.length) {
                    id_viewers.sort();
                    id_viewers_compare.sort();
                    regarde = true;
                    var i = 0;
                    do {
                        regarde = id_viewers[i] == id_viewers_compare[i] ? true : false;
                        i++;
                    } while (regarde && i != id_viewers.length)

                } else regarde = false;

                if (regarde) {
                    groupPossible[groupPossible.length-1].shows.push({_id: id_show_compare})
                    delete usersPerSeries[id_show_compare];
                } else console.log('pas les même viewers');
            }
        }

        // Aller chercher les titres des séries pour pouvoir les afficher coté client
        db.collection('show').find().toArray(function (err, resp) {
            var shows = resp;
            for (var i = 0; i < groupPossible.length; i++) {
                // Insérer en tant que groupe temporaire
                /*db.collection('group_tmp').findAndModify({

                })*/

                // affecter les titres
                for (var j = 0; j < groupPossible[i].shows.length; j++) {
                    var _idAChercher = groupPossible[i].shows[j]._id;
                    var k = 0;
                    while (shows[k]._id != _idAChercher ) k++;
                    groupPossible[i].shows[j].title = shows[k].title;
                }
            }
            req.session.usersPerSeries = null;
            res.respond({groups: groupPossible}, 200);
        })

    } else {
        if (id_user) {
            res.redirect('/user/show/friends?id_user='+id_user)
        } else {
            res.respond(new Error('Please provide at least an id for the user'))
        }
    }
});

// Trouver des groupes existants à rejoindre
app.get('/group/find', function(req,res) {

    var id_user = ObjectID.isValid(req.param('id_user')) ? new ObjectID(req.param('id_user')) : null;

    id_user ?
        // Obtenir l'utilisateur 
        db.collection("user").find({_id: id_user}).toArray(function(err,resp) {
            var user = resp[0];
            var groups = {};
            groups.possible = new Array();
            
            db.collection('group').find().toArray(function (err, resp) {
                var allGroups = resp;
                for (var i = 0; i < allGroups.length; i++) {
                    // on regarde pour chaque groupe si l'utilisateur regarde toutes les séries qui le contient
                    var regarde = true;
                    var j = 0;
                    do {
                        regarde = user.shows.includes(allGroups[i].shows[j]) ? true : false;
                        j++;
                    } while (regarde && j != allGroups[i].shows[j].length)
                    // Proposer le groupe à l'utilisateur
                    regarde ? groups.possible.push(allGroups[i]) : null;
                }
                res.respond({groups: groups},200);
            })
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