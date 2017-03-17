/**
 * Created by hadrien1 on 17/03/17.
 */

'use strict'

import Cookie from 'react-native-cookie';
// configs
var conf = require('../const/conf.js');

var exports = module.exports = {};

exports.getUser = function() {
    return new Promise(function(resolve,reject) {
        Cookie.get(conf.cookie_location).then((cookie) => {
            if (cookie.id_user)
                fetch(conf.server_domain+'/user?id_user=' + cookie.id_user, {
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
    });
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
                'Authorization': 'Bearer ' + exports.token ? exports.token : token
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


exports.searchShowByName = function(token = '') {
    return new Promise(function(resolve,reject) {
        var title = this.refs.textfield_searchShowByName.state.text.split(' ').join('+');
        var url = 'https://api.betaseries.com/shows/search?title='+title+'&summary=false&order=popularity&nbpp=1';
        exports.BetaSerieRequest('GET',url,token).then((data) => resolve(data), (err) => reject(err));
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