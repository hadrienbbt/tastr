/**
 * Created by hadrien1 on 14/03/17.
 */

import React, { Component, PropTypes } from 'react';
import Cookie from 'react-native-cookie';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Linking,
    } from 'react-native'

var conf = require('../const/conf.js');
var styles = require('../styles/styles.js');
var strings = require('../const/lang.js');

export default class ConnectShow extends Component {

    constructor(props) {
        super(props);
        this._TVSTOauth = this._TVSTOauth.bind(this);
        this._BetaSeriesOauth = this._BetaSeriesOauth.bind(this);
        this._showConnect = this._showConnect.bind(this);
    }

    _TVSTOauth () {
        return new Promise((resolve,reject) => {

            /**
             * Generates a random string containing numbers and letters
             * @param  {number} length The length of the string
             * @return {string} The generated string
             */
            var generateRandomString = function(length) {
                var text = '';
                var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

                for (var i = 0; i < length; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
            };

            Linking.openURL([
                'https://www.tvshowtime.com/oauth/authorize',
                '?client_id=' + conf.tvst_key,
                '&redirect_uri=' + conf.redirect_uri,
                '&state=' + generateRandomString(16)
            ].join(''));

            Linking.addEventListener('url', handleURL);

            function handleURL(event) {
                function getParameterByName(name, url) {
                    if (!url) {
                        url = window.location.href;
                    }
                    name = name.replace(/[\[\]]/g, "\\$&");
                    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                        results = regex.exec(url);
                    if (!results) return null;
                    if (!results[2]) return '';
                    return decodeURIComponent(results[2].replace(/\+/g, " "));
                }
                var code = getParameterByName('code', event.url);
                console.log(code);
                Linking.removeEventListener('url', handleURL);

                fetch('https://api.tvshowtime.com/v1/oauth/access_token', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        client_id: conf.tvst_key,
                        client_secret: conf.tvst_secret,
                        redirect_uri: conf.redirect_uri,
                        code: code
                    })
                })
                    .then((response) => {return response.json()})
                    .then((responseData) => {return responseData;})
                    .then((data) => {
                        Cookie.set(conf.cookie_location, 'profile_show', data.access_token);
                        resolve({access_token: data.access_token, show_provider: 'tvst'});
                    })
                    .catch((err) => reject(err))
            }
        })
    }

    _BetaSeriesOauth () {
        return new Promise((resolve,reject) => {
            Linking.openURL([
                'https://www.betaseries.com/authorize',
                '?response_type=token',
                '&client_id=' + conf.bs_key,
                '&redirect_uri=' + conf.redirect_uri
            ].join(''));

            Linking.addEventListener('url', handleUrl);
            function handleUrl(event) {
                function getParameterByName(name, url) {
                    if (!url) {
                        url = window.location.href;
                    }
                    name = name.replace(/[\[\]]/g, "\\$&");
                    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                        results = regex.exec(url);
                    if (!results) return null;
                    if (!results[2]) return '';
                    return decodeURIComponent(results[2].replace(/\+/g, " "));
                }

                var code = getParameterByName('code', event.url);
                Linking.removeEventListener('url', handleUrl);

                fetch('https://api.betaseries.com/oauth/access_token', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        client_id: conf.bs_key,
                        client_secret: conf.bs_secret,
                        redirect_uri: conf.redirect_uri,
                        code: code
                    })
                })
                    .then((response) => {return response.json()})
                    .then((responseData) => {return responseData;})
                    .then((data) => {
                        Cookie.set(conf.cookie_location, 'profile_show', data.access_token);
                        resolve({access_token: data.access_token, show_provider: 'bs'});
                    })
                    .catch((err) => reject(err))
            }
        })
    }

    _showConnect (show_provider) {
        // Handle the right API for the shows
        var funcConnectShow;
        show_provider == 'tvst' ? funcConnectShow = this._TVSTOauth : funcConnectShow = this._BetaSeriesOauth;

        funcConnectShow().then((data) => {
            console.log('DATA');
            console.log(data);
            var bsOauth = data;
            var anchor = this;
            if (!this.props.pages.state.moodmusic_infos) anchor.props.pages.setState({apiToConnect: 'moodmusic'})
            else {
                // Envoyer l'utilisateur au serveur pour l'enregistrer en BDD
                fetch('http://localhost:8080/user/new', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: this.props.pages.state.moodmusic_infos.name,
                        email: this.props.pages.state.moodmusic_infos.email,
                        id_moodmusic: this.props.pages.state.moodmusic_infos.id,
                        show_infos: {
                            show_provider: bsOauth.show_provider,
                            access_token: bsOauth.access_token
                        }
                    })
                })
                    .then((response) => { return response.json()})
                    .then((responseData) => { return responseData;})
                    .then((data) => {
                        var id_user = data.id_user;
                        Cookie.clear(conf.cookie_location).then(() =>
                                Cookie.set(conf.cookie_location,'id_user',id_user).then(() =>
                                        console.log("cookie id_user set !"),
                                    anchor.props.pages.setState({
                                        apiToConnect: 'done',
                                        show_infos: {
                                            show_provider: bsOauth.show_provider,
                                            access_token: bsOauth.access_token
                                        }
                                    })
                                )
                        )
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            }
        }, (error) => console.log("L'API ne donne pas l'accès... " + error));
    }

    render() {
        return (
            <View style={styles.container_connection}>
                <View style={styles.container_instructions}>
                    <Text style={styles.instructions}>
                            {strings.instructions_show}
                    </Text>
                </View>
                <View style={styles.viewButton}>
                    <View style={styles.transparentElement}>
                        <TouchableOpacity onPress={() => this._showConnect('tvst')}>
                            <Image source={require('../img/tvst_logo.png')} style={styles.logoSignin}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.transparentElement}>
                        <TouchableOpacity onPress={() => this._showConnect('bs')}>
                            <Image source={require('../img/bs_logo.png')} style={styles.logoSignin}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}