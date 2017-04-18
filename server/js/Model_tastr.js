/**
 * Created by hadrien1 on 17/03/17.
 */

'use strict'

// configs
var conf = require('../../tastr/const/conf.js')
var request = require('request')
var ObjectID = require('mongodb').ObjectID


var exports = module.exports = {};

exports.getShowsOf = (id_user,db) => {
    return new Promise((resolve, reject) =>
        db.collection('user').find({_id: new ObjectID(id_user)}).toArray((err, resp) =>
            err ? reject(err) : resolve(resp[0].shows)
        )
    )
}

exports.getMembersOf = (groups,id_user,db) => {
    return new Promise((resolve,reject) =>
        db.collection('user').find({_id: {$ne: new ObjectID(id_user)}}).toArray((err,users) => {
            if (err) reject(err)

            var counter = 0
            var members = []
            for (var i in groups)
                // Récupérer les participants des groupes
                db.collection('groupe').find({_id: groups[i]._id}).toArray((err,resp) => {
                    var participants = resp[0].participants
                    console.log("participants : " + participants)
                    for(var j in users)
                        // Si l'utilisateur participe au groupe et qu'il n'a pas déjà été ajouté
                        if (participants.includes(users[j]._id.toString())){
                            var id = users[j]._id.toString(),
                                found = false;
                            for (var i=0; i<members.length; i++) {
                                if (members[i]._id == id) {
                                    found = true;
                                    break;
                                }
                            }
                            if (!found) members.push(users[j])
                        }
                    if (++counter == groups.length) resolve(members)
                })
        })
    )
}

exports.getGroupsOf = (id_user,db) => {
    var id_user = id_user.toString();
    return new Promise((resolve,reject) => {
        db.collection('groupe').find({participants: {$in: [ id_user ]}}).toArray((err,resp) =>
            err ? reject(err) : resolve(
                resp.sort((a,b) => b.shows.length - a.shows.length)
            )
        )
    })
}

exports.addUserToGroups = (id_user,groupsToJoin,db) => {
    var groups = groupsToJoin;

    return new Promise((resolve,reject) => {
        for (var i =0; i< groups.length; i++) {
            console.log(groups[i])

            db.collection('groupe').update({
                    participants: {
                        $all : groups[i].participants,
                        $nin: [id_user]
                    },
                    shows : {
                        $all : groups[i].shows
                    }
                }, {
                    $push: {
                        participants: id_user
                    }
                }, {multi: true}, (err, resp) =>
                    err ? reject(err) : i == groups.length ? resolve() : null
            )
        }
    });
}

exports.similarGroupExists = function(shows, groups) {
    var idShows = shows.map((show) => {return show._id}).sort().join(','),
        tabIdShows = groups.map((group) => {return group.shows.map((show) => {return show._id}).sort().join(',')});

    return tabIdShows.includes(idShows) ? true : false;
}

exports.transfererSeries = function(aGroup, id_user, db) {
    var group = aGroup;

    // Obtenir tous les participants au groupe sauf l'utilisateur
    var participantsSansUser = group.participants;
    participantsSansUser.splice(group.participants.indexOf(id_user),1);

    // Récupérer tous les groupes qui contiennent les participants : participantsSansUser
    db.collection('groupe').update({
        _id: {
            $ne: group._id
        },
        participants: {
            $all : participantsSansUser
        }
    },{
        $pull: {
            shows : {
                $in: group.shows
            }
        }
    },{multi: true}, (err,resp) => {
        if (err) throw err;
        // Supprimer les groupes sans séries
        db.collection('groupe').remove({shows: []});
    })
}

exports.getMemberInfos = function(access_token) {
    console.log('requete de librairie bs avec ' + access_token);
    return new Promise(function(resolve,reject) {
        var url = 'https://api.betaseries.com/members/infos';
        exports.BetaSerieRequest('GET',url,access_token).then((data) => {
            var member = JSON.parse(data).member;
            resolve(member)
        }, (err) => reject(err));
    })
}

exports.BetaSerieRequest = function(method,url,token,params = {}) {
    // Exception cases
    if (method != 'GET' && method != 'POST' && method != 'PUT' && method != 'DELETE')   throw new Exception('invalid REST method');

    return new Promise((resolve, reject) => {
        request({
            method: method,
            url: url,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-BetaSeries-Version': 2.4,
                'X-BetaSeries-Key': conf.bs_key,
                'Authorization': 'Bearer ' + token
            }
        }, (error,response) => {
            error ? reject(error) : resolve(response.body);
        })
    });
}

exports.postEpisodeWatched = (id_tvdb, token) => {
    return new Promise((resolve,reject) => {
        var url = 'https://api.betaseries.com/episodes/watched?thetvdb_id='+id_tvdb
        exports.BetaSerieRequest('POST',url,token).then(
            (data) => resolve(data),
            (err) => reject(err)
        )
    })
}

exports.getToWatchList = (token) => {
    return new Promise((resolve, reject) => {
        var url = 'https://api.betaseries.com/episodes/list?subtitles=all&limit=1'
        exports.BetaSerieRequest('GET', url, token).then((data) => {
            var shows = JSON.parse(data).shows
            var tabItems = new Array()
            for(var i = 0; i<shows.length; i++) {
                var show = shows[i]
                tabItems.push({
                    title: show.title,
                    code: show.unseen[0].code,
                    remaining: show.remaining-1,
                    subtitle: show.unseen[0].subtitles.length > 0 ? show.unseen[0].subtitles[0].url : null,
                    id_tvdb_show: show.thetvdb_id,
                    id_tvdb: show.unseen[0].thetvdb_id,
                })
            }
            resolve(tabItems)
        }, (err) => reject(err))
    })
}

exports.searchShowByName = function(title, token) {
    return new Promise(function(resolve,reject) {
        var url = 'https://api.betaseries.com/shows/search?title='+title+'&summary=false&order=popularity&nbpp=1';
        exports.BetaSerieRequest('GET',url,token).then((data) => resolve(data), (err) => reject(err));
    })
}

exports.getFavoriteShows = function(token) {
    return new Promise(function(resolve,reject) {
        var url = 'https://api.betaseries.com/shows/favorites'
        exports.BetaSerieRequest('GET', url, token).then((data) => resolve(data), (err) => reject(err));
    })
}