// app.js
// Hadrien Barbat

'use strict'

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
                var seriesSuivies = member.shows;
                // Récupérer seulement l'id_tvdb des series favorites
                var seriesFavorites = member.favorites.map((serie) => {return serie.thetvdb_id.toString()});
                console.log('++++++++++++++++++++')
                console.log(seriesFavorites);
                console.log('++++++++++++++++++++')
                var countDone = 0;

                // Réinitialiser les séries favorites
                db.collection('user').update({_id: id_user},{$unset: {favorites: 1}},(err,resp) => {
                    // Ajouter chaque séries à la bdd (si besoin)...
                    console.log('Ajouter chaque séries à la bdd (si besoin)...');
                    for(var i = 0; i< seriesSuivies.length; i++) {
                        var serieCourante = seriesSuivies[i];
                        db.collection('show').findAndModify(
                            {id_tvdb: serieCourante.thetvdb_id},
                            {},{
                                id_tvdb: serieCourante.thetvdb_id,
                                id_imdb: serieCourante.imdb_id,
                                title: serieCourante.title,
                                genres: serieCourante.genres,
                                network: serieCourante.network,
                                followers: serieCourante.followers,
                                creation: serieCourante.creation,
                                note: {
                                    total: serieCourante.notes.total,
                                    mean: serieCourante.notes.mean
                                },
                                images: serieCourante.images,
                                description: serieCourante.description
                            },{new: true, upsert: true}, (err,resp) => {
                                // ... et l'affecter à l'utilisateur (en ajoutant aux favorites si besoin)
                                if(err) throw err;
                                var id_serie = resp.value._id.toString();
                                // Si le tableau des favoris contient l'id_tvdb de la série courante, on l'ajoutera aux favoris
                                var update = seriesFavorites.includes(resp.value.id_tvdb.toString()) ?
                                    {$addToSet: {shows: id_serie}, $push: {favorites: id_serie}}
                                    : {$addToSet: {shows: id_serie}};
                                db.collection('user').update(
                                    {_id: id_user},
                                    update,
                                    {upsert: true},
                                    (err,resp) => {
                                        if(err) throw err;
                                        // S'il n'y a plus de série à traiter ensuite, on y va
                                        ++countDone == seriesSuivies.length ?
                                            res.redirect('/group/find/existing?id_user='+id_user) : null;
                                    }
                                );
                            }
                        );
                    }
                });
            }, (err) => res.respond(err,500))
        })
    : res.respond({user: null},200);
});

// obtenir un tableau associatif série -> utilisateur pour manipuler plus simplement la recherche de groupe
// usersPerSeries[séries suivies par l'utilisateur] = [utilisateurs qui la regardent]
app.get('/user/show/friends', function(req,res) {
    var id_user = ObjectID.isValid(req.param('id_user')) ? new ObjectID(req.param('id_user')) : null;

    id_user ?
        // Obtenir tous les utilisateurs et extraire la cible
        db.collection("user").find().toArray(function(err,resp) {
            var i = 0;
            while (resp[i]._id != id_user.toString()) i++;
            var user = resp.splice(i, 1)[0];
            var others = resp; //user;
            //user = user[0];
            var showsToConnect = user.shows ? user.shows : [];
            // Si l'utilisateur n'a pas de série favorite : tableau vide
            if(!user.favorites) user.favorites = [];

            // Regarder quels groupes on peut former selon les séries de l'utilisateur
            // Savoir quels personnes regardent chaque série de l'utilisateur

            var usersPerSeries = {favorites : {}, shows: {}};
            console.log("recherche d'amis pour les séries...");
            for (var i = 0; i < showsToConnect.length; i++) {
                user.favorites.includes(showsToConnect[i]) ?
                    usersPerSeries.favorites[showsToConnect[i]] = new Array()
                :usersPerSeries.shows[showsToConnect[i]] = new Array();
                for (var j = 0; j < others.length; j++) {

                    // Si la personne regarde une même série sn que l'utilisateur :
                    // on ajoute la personne dans la case sn du tableau usersPerSeries
                    // EDIT : On l'ajoute à l'objet favorites si l'utilisateur l'a marquée comme favorites
                    if (!others[j].shows) others[j].shows = []; // Cas où l'utilisateur courant n'a pas de séries enregistrées
                    others[j].shows.includes(showsToConnect[i]) ?
                        user.favorites.includes(showsToConnect[i]) ?
                            usersPerSeries.favorites[showsToConnect[i]].push(others[j]._id)
                        : usersPerSeries.shows[showsToConnect[i]].push(others[j]._id)
                    : null;
                }
                // Si le tableau qu'on a créé n'a pas été rempli par des id_user, on le détruit
                user.favorites.includes(showsToConnect[i]) ?
                    usersPerSeries.favorites[showsToConnect[i]].length == 0 ?
                        delete usersPerSeries.favorites[showsToConnect[i]]
                    :   null
                :   usersPerSeries.shows[showsToConnect[i]].length == 0 ?
                        delete usersPerSeries.shows[showsToConnect[i]]
                    :   null;
            }
            // Trier le tableau par taille de cases

            //console.log(usersPerSeries);
            req.session.usersPerSeries = usersPerSeries;
            res.redirect('/group/find/possible?favorites=true&id_user='+id_user);
        })
    : res.respond({user: null},200);
});

// Regrouper les series que plusieurs personnes regardent dans un objet similaire à un groupe
app.get('/group/find/possible', function(req,res) {

    var usersPerSeries;
    var id_user = ObjectID.isValid(req.param('id_user')) ? new ObjectID(req.param('id_user')) : null;

    if (req.session.usersPerSeries) {
        usersPerSeries = req.param('favorites') ? req.session.usersPerSeries.favorites : req.session.usersPerSeries.shows;
        /*console.log('*******************');
        console.log('USERS PAR SERIES ');
        console.log(usersPerSeries);*/

        // Définir la prochaine route en fonction du remplissage de l'objet retour
        // D'abord les favoris puis les normales
        // A la fin des normales on renvoit les groupes
        var next = req.param('favorites') ? (groupPossible) => {
            req.session.groups.favorites = groupPossible;
            res.redirect('/group/find/possible?id_user='+id_user);
        } : (groupPossible) => {
            req.session.usersPerSeries = null; // plus besoin de ça
            req.session.groups.shows = groupPossible;

            // Trier les groupes  par ordre décroissant de niveau
            for (var type_groupe in req.session.groups) req.session.groups[type_groupe].sort((a,b) => {return b.shows.length - a.shows.length})
            console.log('*******************');
            console.log('GROUPES POSSIBLES');
            //console.log(JSON.stringify(req.session.groups, null, 4));
            console.log(req.session.groups);
            res.respond({groups: req.session.groups}, 200);
        }

        var groupPossible = [];

        // Récupérer les groupes pour ne pas proposer d'ajouter un groupe qui existe déjà
        db.collection('groupe').find().toArray((err,resp) => {
            if (err) res.respond(new Error('error database'), 500)
            else {
                var groupsFromDb = resp;
                // récupérer chaque show et le comparer avec les autres
                for (var id_show in usersPerSeries) {
                    var id_viewers = usersPerSeries[id_show];

                    groupPossible.push({
                        shows: [{_id: id_show}],
                        participants: id_viewers.concat(id_user) // ajouter l'utilisateur courant aux participants à la conv
                    });

                    delete usersPerSeries[id_show];

                    for (var id_show_compare in usersPerSeries) {
                        var id_viewers_compare = usersPerSeries[id_show_compare];
                        // Si il y a seulement les viewers de id_viewers  dans id_viewers_compare :
                        // On ajoute la série aux shows de groupPossible
                        // Autrement dit si tout le monde regarde les deux série que l'on compare, le niveau monte d'1
                        var regarde;
                        if (id_viewers.length == id_viewers_compare.length) {
                            id_viewers.sort();
                            id_viewers_compare.sort();
                            regarde = true;
                            var i = 0;
                            do {
                                regarde = id_viewers[i] == id_viewers_compare[i] ? true : false;
                                i++;
                            } while (regarde && i < id_viewers.length)

                        } else regarde = false;

                        if (regarde) {
                            groupPossible[groupPossible.length - 1].shows.push({_id: id_show_compare})
                            delete usersPerSeries[id_show_compare];
                        } // else console.log('pas les même viewers');
                    }
                    // On a un groupe possible,
                    // il faut maintenant regarder s'il y a un groupe analogue qui existe déjà
                    // Si c'est le cas ce n'est pas la peine de le proposer à l'utilisateur car il sera dans la section des groupes existants
                    if (Tastr.similarGroupExists(groupPossible[groupPossible.length - 1].shows, groupsFromDb))
                        groupPossible.pop()
                }

                // Aller chercher les titres des séries pour pouvoir les afficher coté client
                db.collection('show').find().toArray(function (err, resp) {
                    var shows = resp;
                    for (var i = 0; i < groupPossible.length; i++) {

                        // affecter les titres
                        for (var j = 0; j < groupPossible[i].shows.length; j++) {
                            var _idAChercher = groupPossible[i].shows[j]._id;
                            var k = 0;
                            while (shows[k]._id != _idAChercher ) k++;
                            groupPossible[i].shows[j].title = shows[k].title;
                        }
                    }
                    next(groupPossible);
                })
            }
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
app.get('/group/find/existing', function(req,res) {

    // Déclaration de l'objet retour
    req.session.groups = {}

    var id_user = ObjectID.isValid(req.param('id_user')) ? new ObjectID(req.param('id_user')) : null;

    id_user ?
    // Obtenir l'utilisateur
        db.collection("user").find({_id: id_user}).toArray(function(err,resp) {
            var user = resp[0];
            var existing = new Array();
            
            db.collection('groupe').find().toArray(function (err, resp) {
                var allGroups = resp;
                for (var i = 0; i < allGroups.length; i++) {
                    // on regarde pour chaque groupe si l'utilisateur regarde toutes les séries qui le contient
                    var regarde = true;
                    var j = 0;
                    do {
                        regarde = user.shows.includes(allGroups[i].shows[j]._id) ? true : false;
                        j++;
                    } while (regarde && j < allGroups[i].shows.length)
                    // Proposer le groupe à l'utilisateur
                    regarde ? existing.push({
                        _id: allGroups[i]._id,
                        shows: allGroups[i].shows,
                        participants: allGroups[i].participants,
                    }) : null;
                }
                // Aller chercher les titres des séries pour pouvoir les afficher coté client
                db.collection('show').find().toArray(function (err, resp) {
                    var shows = resp;
                    for (var i = 0; i < existing.length; i++) {

                        // affecter les titres
                        for (var j = 0; j < existing[i].shows.length; j++) {
                            var _idAChercher = existing[i].shows[j]._id;
                            var k = 0;
                            while (shows[k]._id != _idAChercher ) k++;
                            existing[i].shows[j] = {
                                _id: _idAChercher,
                                title: shows[k].title
                            }
                        }
                    }
                    req.session.groups.existing = existing;
                    res.redirect('/user/show/friends?id_user='+id_user);
                })
            })
        })
    : res.respond({user: null},200);
});

// Créer les groupes sélecionnés par l'utilisateur
// Modifier les groupes existant pour insérer l'utilisateur dans le réseau sans doublon de séries pour les gens
app.post('/group/create', function(req,res) {
    var tabGroupsToCreate = req.param('groups');
    var id_user = req.param('id_user');
    console.log(tabGroupsToCreate);
    if(tabGroupsToCreate.length > 0) {
        console.log('CREATION DES GROUPES');
        for (var i = 0; i < tabGroupsToCreate.length; i++) {
            var groupe = tabGroupsToCreate[i];
            groupe && groupe.shows && groupe.participants ?
                db.collection("groupe").insert({
                    messages: [], shows: groupe.shows, participants: groupe.participants
                }, (err, resp) => {
                    // Modifier les groupes existants
                    // pour accomplir un transfert des séries
                    Tastr.transfererSeries(resp.ops[0], id_user, db)
                })
                : res.respond(new Error("invalid group provided"), 500);
        }
        res.respond({message: 'groupes créés et rejoints !'}, 200);
    } else res.respond({message: 'aucun groupe à créer'}, 200);
});

app.post('/group/join', function(req,res) {
    var tabGroupsToJoin = req.param('groups');
    var id_user = req.param('id_user');

    tabGroupsToJoin.length > 0 ?
        Tastr.addUserToGroups(id_user,tabGroupsToJoin,db).then(
            () => res.respond({message: 'groupes rejoints !'},200),
            (err) => res.respond(err,500)
        )
    :res.respond({message: 'aucun groupe à rejoindre'}, 200);
});

// Get the user and the groups which he belongs
// param : id_user
app.get('/user', function(req,res) {
    var id_user = ObjectID.isValid(req.param('id_user')) ? new ObjectID(req.param('id_user')) : null;
    console.log(id_user)
    id_user ?
        db.collection("user").find({_id: id_user}).toArray(function(err,resp) {
            var user = resp[0];
            console.log(resp[0])
            Tastr.getGroupsOf(user._id,db).then(
                (groups) => {res.respond({user: user, groups: groups},200)},
                (error) => {
                    console.log("pas d'user " + error);
                    res.respond(new Error("user non trouvé"))
                }
            )
        })
    : res.respond({user: null},200);
});

app.get('/user/show/unseen', (req,res) => {
    var access_token = req.param('access_token') ? req.param('access_token') : null;

    access_token ?
        db.collection('show').find().toArray((err,allShows) =>
            Tastr.getToWatchList(access_token).then((tabItems) => {

                for (var i = 0; i<tabItems.length; i++) { // Ajouter une image au retour de la requete à betaseries

                    var idToFind = tabItems[i].id_tvdb_show
                    var id_show_from_db = allShows.findIndex(function(item, i){
                        return item.id_tvdb === idToFind
                    });
                    if (id_show_from_db != -1)
                        tabItems[i].image = allShows[id_show_from_db].images.poster
                }
                res.respond({tabItems: tabItems})
            }, (err) => console.log(err)
            )
        )
    : res.respond(new Error("Token needed"));
})

app.post('/user/show/seen', (req,res) => {
    var access_token = req.param('access_token') ? req.param('access_token') : null;
    var id_tvdb = req.param('id_tvdb')

    access_token ?
        Tastr.postEpisodeWatched(id_tvdb,access_token).then(
            (data) => res.redirect('/user/show/unseen?access_token='+access_token),
            (err) => console.log(err)
        )
    : res.respond(new Error("Token needed"));
})

app.post('/chat/message/add', (req,res) => {
    var message = req.param('message')
    var id_group = req.param('id_group')

    db.collection('groupe').update({_id: ObjectID(id_group)},{
        $push: {
            messages: {
                $each: [message],
                $position: 0
            }
        }
    }, (err,resp) => {
            if (err) res.respond(new Error(err))
            else {
                res.respond({success: 'BRAVO'}, 200)
            }
        }
    )
})

app.post('/show/save', (req,res) => {
    console.log('coucou')
    var shows = req.param('shows')
    console.log(shows)
    for(var i=0; i<shows.length; i++) {
        var serieCourante = shows[i]
        db.collection('show').findAndModify(
            {id_tvdb: serieCourante.thetvdb_id},
            {},{
                id_tvdb: serieCourante.thetvdb_id,
                id_imdb: serieCourante.imdb_id,
                title: serieCourante.title,
                genres: serieCourante.genres,
                network: serieCourante.network,
                followers: serieCourante.followers,
                creation: serieCourante.creation,
                note: {
                    total: serieCourante.notes.total,
                    mean: serieCourante.notes.mean
                },
                images: serieCourante.images,
                description: serieCourante.description
            },{new: true, upsert: true}, (err,resp) => {
                if (err) res.respond(new Error(err))
            })
    }
    res.respond({success: 'yay'},200)
})

var sortByValue = obj => {
    var tuples = []

    for (var key in obj) tuples.push([key, obj[key]])

    tuples.sort(function (a, b) {
        a = a[1]
        b = b[1]

        return b - a
    })

    var res = []
    for (var i = 0; i < tuples.length; i++) {
        var key = tuples[i][0]
        var value = tuples[i][1]
        res[key] = value
    }
    return res
}

app.get('/show/discover', (req,res) =>
    Tastr.getGroupsOf(req.param('id_user'),db).then(
        (groups) =>
            Promise.all([
                Tastr.getShowsOf(req.param('id_user'),db),
                Tastr.getMembersOf(groups,req.param('id_user'),db)
            ]).then(
                (showsAndMembers) => {
                    var shows = showsAndMembers[0]
                    var members = showsAndMembers[1]
                    var commonShows = []
                    for (var i in members)
                        for (var j in members[i].shows)
                            // Si l'utilisateur ne regarde pas la série
                            if(!shows.includes(members[i].shows[j]))
                                members[i].shows[j] in commonShows ?
                                    commonShows[members[i].shows[j]]++
                                    : commonShows[members[i].shows[j]] = 1
                    commonShows = sortByValue(commonShows)
                    // Récupérer les séries avec leurs id
                    db.collection('show').find().toArray((err,allShows) => {
                        if (err) res.respond(new Error(err))
                        else {
                            var discover = []
                            for (var idShow in commonShows) {
                                for (var i=0; i<allShows.length; i++) {
                                    if (allShows[i]._id == idShow) {
                                        discover.push(allShows[i])
                                        break;
                                    }
                                }
                            }
                            res.respond({discover: discover},200)
                        }
                    })
                },
                (err) => res.respond(new Error(err))
            ),
        (err) => res.respond(new Error(err))
    )
)

/*
// SOCKET .IO
var server = require('http').createServer(app);

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !');
});

server.listen(port);
*/

app.listen(port);
console.log("Listening on " + port);


/*app.post('/tvst/token', function(req,res) {
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
 });*/


