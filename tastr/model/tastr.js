/**
 * Created by hadrien1 on 18/03/17.
 */

'use strict'

import Cookie from 'react-native-cookie';
// configs
var conf = require('../const/conf.js');

var exports = module.exports = {};

exports.getDiscover = (id_user) => {
    var id_user = id_user;
    console.log(id_user)
    // Vérifier si l'utilisateur fait déjà partie de groupes
    // a-t-il déjà passé la phase setup ou pas ?
    return new Promise((resolve,reject) => {
        let path = '/show/discover'
        fetch(conf.server_domain + path + '?id_user=' + id_user,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then((response) => {return response.json()})
            .then((responseData) => {return responseData;})
            .then((discover) => {
            var shows = discover.discover
                var discoverItems = []
                for (var i = 0; i< shows.length; i++) {
                    discoverItems.push({
                        _id: shows[i]._id,
                        title: shows[i].title,
                        image: shows[i].images.poster,
                    })
                }
                resolve(discoverItems)
            })
            .catch(function (err) {reject(err)})
    })
}

exports.getContext = (id_user) => {
    var id_user = id_user;
    // Vérifier si l'utilisateur fait déjà partie de groupes
    // a-t-il déjà passé la phase setup ou pas ?
    return new Promise((resolve,reject) => {
        let path = '/user'
        fetch(conf.server_domain + path + '?id_user=' + id_user,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then((response) => {return response.json()})
            .then((responseData) => {return responseData;})
            .then((dataUser) => {
                console.log('contexte reçu !\n Le voici :'+ dataUser);

                // Si le tableau des groupes de l'utilisateur est vide, on lui propose d'en rejoindre
                // ET on signifie à la vue qu'il faut présenter des groupes à rejoindre
                if (dataUser.groups.length == 0) {
                    console.log('On va chercher des groupes à rejoindre...')
                    exports.chercherGroupes(id_user).then((groups) =>
                        resolve({user: dataUser.user, groups: groups, setupDone: false})
                    )
                } else resolve({user: dataUser.user,groups: dataUser.groups, setupDone: true})
            })
            .catch(function (err) {reject(err)})
    })
}

exports.chercherGroupes = (id_user) => {
    return new Promise(function(resolve,reject){
        //let path = '/group/find/existing';
        let path = '/user/show/refresh';

        fetch(conf.server_domain + path + '?id_user=' + id_user, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                return response.json()
            })
            .then((responseData) => {
                return responseData;
            })
            .then((groupesPossibles) => {
                console.log('groupes reçus !\n Les voici :'+groupesPossibles);

                // Transforme les données reçues en groupes exploitables par Tastr
                function formatGroup (groups) {

                    var formatData = [];
                    for (var i = 0; i<groups.length; i++) {
                        formatData.push({_id: i/* mettre id_groupe quand existera*/, shows: []})
                        formatData[formatData.length-1].participants = groups[i].participants;
                        for (var j=0; j<groups[i].shows.length; j++) {
                            formatData[formatData.length-1].shows.push(groups[i].shows[j]);
                        }
                    }
                    return formatData;
                }
                var formatedFavorites = formatGroup(groupesPossibles.groups.favorites);
                var formatedShows = formatGroup(groupesPossibles.groups.shows);
                var formatedExisting = formatGroup(groupesPossibles.groups.existing)
                var groups = {favorites: formatedFavorites, shows: formatedShows, existing: formatedExisting}
                resolve(groups);
            })
            .catch(function (err) {reject(err)})
    })
}

exports.creerGroupes = function(id_user, groupsToCreate) {
    var options = {
        id_user: id_user,
        groups: groupsToCreate,
    };
    return new Promise(function(resolve,reject) {

        // Demander au serveur de créer les goupes
        let path = '/group/create';
        console.log(options);
        fetch(conf.server_domain + path, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(options)
        })
        .then((response) => {return response.json()})
        .then((responseData) => {return responseData})
        .then((data) => resolve(data)) // Rejoindre les groupes précédemment créés
        .catch((err) => reject(err))
    })
}

exports.rejoindreGroupes = function(id_user,groupsToJoin) {
    var options = {
        id_user: id_user,
        groups: groupsToJoin,
    };
    return new Promise(function(resolve,reject) {

        // Demander au serveur de rejoindre les goupes
        let path = '/group/join';
        console.log(options);
        fetch(conf.server_domain + path, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(options)
        })
            .then((response) => {return response.json()})
            .then((responseData) => {return responseData})
            .then((data) => resolve(data))
            .catch((err) => reject(err))
    })

}

exports.getUser = function(_id) {
    return new Promise(function(resolve,reject) {
        fetch(conf.server_domain+'/user?id_user=' + _id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            return response.json()
        })
        .then((responseData) => {
            return responseData;
        })
        .then((data) => resolve(data.user))
        .catch(function (err) {reject(err)})
    })
}

exports.postEpisodeWatched = (id_tvdb,token) => {
    return new Promise(function(resolve,reject) {
        fetch(conf.server_domain+'/user/show/seen', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_tvdb: id_tvdb,
                access_token: token
            })
        })
            .then((response) => {
                return response.json()
            })
            .then((responseData) => {
                return responseData;
            })
            .then((tabItems) => resolve(tabItems.tabItems))
            .catch(function (err) {reject(err)})
    })
}

exports.getToWatchList = (token) => {
    return new Promise(function(resolve,reject) {
        fetch(conf.server_domain+'/user/show/unseen?access_token=' + token, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                return response.json()
            })
            .then((responseData) => {
                return responseData;
            })
            .then((tabItems) => resolve(tabItems.tabItems))
            .catch((err) => reject(err))
    })
}

exports.saveMessage = (messages, id_group) => {
    if (messages.length == 1) {
        fetch(conf.server_domain+'/chat/message/add', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: messages[0],
                id_group: id_group
            })
        })
            .then((response) => {
                return response.json()
            })
            .then((responseData) => {
                return responseData;
            })
            .then((data) => console.log(data.success))
            .catch((err) => console.log(err))

    } else throw new Error('Pas ou trop de messages')
}

exports.BetaSerieRequest = function(method,url,token = '',params = {}) {
    // Exception cases
    if (method != 'GET' && method != 'POST' && method != 'PUT' && method != 'DELETE')   throw new Exception('invalid REST method');

    return new Promise(function(resolve, reject) {
        fetch(url,{
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-BetaSeries-Version': 2.4,
                'X-BetaSeries-Key': conf.bs_key,
                'Authorization': 'Bearer ' + token
            }
        })
            .then((response) => {return response.json()})
            .then((responseData) => {return responseData;})
            .then((data) => {
                resolve(data);
            })
            .catch(function (err) {reject(err)})
    });
}

exports.searchShowByName = function(name,token = '') {
    return new Promise(function(resolve,reject) {
        var title = name.split(' ').join('+');
        var url = 'https://api.betaseries.com/shows/search?title='+title+'&summary=false&order=popularity&nbpp=1';
        exports.BetaSerieRequest('GET',url,token).then((data) => resolve(data), (err) => reject(err));
    })
}

exports.getAllShows = function(token = '') {
    return new Promise(function(resolve,reject) {
        //var title = name.split(' ').join('+');
        var url = 'https://api.betaseries.com/shows/search?nbpp=50&summary=false&order=popularity&page=20';
        exports.BetaSerieRequest('GET',url,token).then((data) => {
            console.log(data)
            fetch(conf.server_domain+'/show/save', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    shows: data.shows
                })
            })
                .then((response) => {
                    return response.json()
                })
                .then((responseData) => {
                    return responseData;
                })
                .then((data) => resolve(data.success))
                .catch((err) => reject(err))

        }, (err) => reject(err));
    })
}

exports.getFavoriteShows = function(token = '') {
    return new Promise(function(resolve,reject) {
        var url = 'https://api.betaseries.com/shows/favorites'
        exports.BetaSerieRequest('GET', url, token).then((data) => resolve(data), (err) => reject(err));
    })
}

exports.getMemberInfos = function(token = '') {
    return new Promise(function(resolve,reject) {
        var url = 'https://api.betaseries.com/members/infos';
        exports.BetaSerieRequest('GET',url,token).then((data) => resolve(data), (err) => reject(err));
    })
}
