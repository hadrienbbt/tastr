/**
 * Created by hadrien1 on 27/02/17.
 */

import React, { Component, PropTypes } from 'react';
import * as Animatable from 'react-native-animatable';
import TextField from 'react-native-md-textinput';
import Cookie from 'react-native-cookie';
import {
    AppRegistry,
    Text,
    View,
    Button,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Alert,
    LayoutAnimation,
    ScrollView,
    TextInput,
    Dimensions,
    Linking
    } from 'react-native';

var styles = require('../styles/styles.js');
var conf = require('../const/conf.js');

export default class Tastr_Connected extends Component {
    constructor(props) {
        super(props);
        this.BetaSerieRequest = this.BetaSerieRequest.bind(this);
        this.searchShowByName = this.searchShowByName.bind(this);
        this.getFavoriteShows = this.getFavoriteShows.bind(this);
        this.getUser = this.getUser.bind(this);
        this.getUser().then((user) =>
            this.setState({user: user})
        )
    }

    getUser() {
        return new Promise(function(resolve,reject) {
            Cookie.get(conf.cookie_location).then((cookie) => {
                if (cookie.id_user)
                    fetch('http://localhost:8080/user?id_user=' + cookie.id_user, {
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

    searchShowByName() {
        this.getFavoriteShows();

        var title = this.refs.textfield_searchShowByName.state.text.split(' ').join('+');
        var url = 'https://api.betaseries.com/shows/search?title='+title+'&summary=false&order=popularity&nbpp=1';
        this.BetaSerieRequest('GET',url);
    }

    getFavoriteShows() {
        var url = 'https://api.betaseries.com/shows/favorites'
        this.BetaSerieRequest('GET',url);
    }

    BetaSerieRequest(method,url,params = {}) {
        // Exception cases
        if (method != 'GET' && method != 'POST' && method != 'PUT' && method != 'DELETE')   throw new Exception('invalid REST method');

        fetch(url,{
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-BetaSeries-Version': 2.4,
                'X-BetaSeries-Key': conf.bs_key,
                'Authorization': 'Bearer ' + this.state.user.show_infos.access_token
            }
        })
            .then((response) => {return response.json()})
            .then((responseData) => {return responseData;})
            .then((data) => {
                console.log('response: ');
                console.log(data);
            })
            .catch(function (err) {console.log(err)})
    }

    render() {
        return (
            <Animatable.View ref="connecte" style={styles.page}>
                <View style={styles.backdropView}>
                    <Text style={styles.h1}>
                        Vous êtes maintenant connecté à Tastr !
                    </Text>

                    <View style={styles.view_music_connection}>
                        <Text style={[styles.instructions, styles.biggerFont]}>
                            Recherchez une série
                        </Text>
                        <View style={styles.textfield}>
                            <TextField ref='textfield_searchShowByName' label={'Série'} highlightColor={'white'} labelColor={'white'} textColor={'white'}/>
                        </View>
                        <Animatable.View ref='button_getCode'>
                            <Button ref='button_getCode' title="GO" color='white' onPress={this.searchShowByName} color='white' />
                        </Animatable.View>
                    </View>
                </View>
            </Animatable.View>
        )
    }
}