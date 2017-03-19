/**
 * Tastr
 * https://github.com/hadrienbbt/tastr
 * @flow
 *
 * author: hadrien barbat
 *
 */

import React, { Component, PropTypes } from 'react';
import Swiper from 'react-native-swiper';
import * as Animatable from 'react-native-animatable';
import Cookie from 'react-native-cookie';
import {
    AppRegistry,
    Text,
    View,
    } from 'react-native';

// functions tastr
var tastr = require('./model/tastr.js');

// custom components
import WorkflowConnection from './components/WorkflowConnection.js';
import Setup from './components/Setup.js';

var styles = require('./styles/styles.js');
var strings = require('./const/lang.js');
strings.setLanguage('fr');

// configs
var conf = require('./const/conf.js');

const dismissKeyboard = require('dismissKeyboard');

export default class Tastr extends Component {

    constructor(props) {
        super(props);
        this.state = {isConnected: null};
        this._ConnexionController = this._ConnexionController.bind(this);
        this._renderComponent = this._renderComponent.bind(this);
        this._ConnexionController();
    }

    _ConnexionController() {
        // if there isn't a cookie for the user id, show connection workflow
         Cookie.get(conf.cookie_location).then(
            (cookie) => {
                if (cookie && cookie.id_user) this.setState({isConnected: true, id_user: cookie.id_user})
                else this.setState({isConnected: false})
            },(error) => console.log(error)
         );
    }

    // Afficher la connexion ou l'écran suivant quand on est connecté
    _renderComponent() {
        console.log(this.state);
        if(this.state.isConnected == null) {

        } else {
            if(!this.state.isConnected)
                return (<WorkflowConnection anchor={this} />);
            else {
                console.log('connecté!');
                tastr.getContext(this.state.id_user).then((data) => console.log(data),(error) => console.log(error))
                /*tastr.getUser(this.state.id_user).then((user) => {
                    console.log('USER : ' + JSON.stringify(user))
                })*/
                return (<Setup />)
            }
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                 {this._renderComponent()}
            </View>
        );
    }
}

class swiper extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Swiper
                showsPagination={false}
                showsButtons={false}
                loop= {true}
                index={0}>
                <Tastr />
                <Tastr />
            </Swiper>
        )
    }
}

AppRegistry.registerComponent('tastr', () => Tastr);