/**
 * Created by hadrien1 on 17/03/17.
 */

'use strict'

// configs
var conf = require('../../tastr/const/conf.js');
var request = require('request');

var exports = module.exports = {};

exports.similarGroupExists = function(shows, groups) {
    var idShows = shows.map((show) => {return show._id}).sort().join(','),
        tabIdShows = groups.map((group) => {return group.shows.map((show) => {return show._id}).sort().join(',')});

    return tabIdShows.includes(idShows) ? true : false;

    /*console.log('++++++++++++++');
    console.log('tab id show')
    console.log(idShows);
    console.log('tab id shows')
    console.log(tabIdShows);
    console.log('++++++++++++++');*/
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

/*
fetch(conf.server_domain+'/user/findgroups?id_user=' + cookie.id_user, {
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
*/