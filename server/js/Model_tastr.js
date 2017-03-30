/**
 * Created by hadrien1 on 17/03/17.
 */

'use strict'

// configs
var conf = require('../../tastr/const/conf.js');
var request = require('request');

var exports = module.exports = {};

exports.getGroupsOf = (id_user,db) => {
    var id_user = id_user.toString();
    return new Promise((resolve,reject) => {
        db.collection('groupe').find({participants: {$in: [ id_user ]}}).toArray((err,resp) =>
            err ? reject(err) : resolve(resp)
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

    return new Promise(function(resolve, reject) {
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
        }, function(error,response) {
            if(response.error) reject(response.error)
            resolve(response.body);
        })
    });
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