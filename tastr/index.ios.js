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
var controllerTastr = require('./controller/tastr.js');

// custom components
import Splashscreen from './components/Splashscreen.js';
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
        //this.state = {isConnected: true, id_user: '58ced4dc4ba97f710e15645b'}
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
        if(this.state.isConnected == null) {
            return (<Splashscreen />)
        } else {
            if(!this.state.isConnected)
                return (<WorkflowConnection anchor={this} />);
            else {
                if (!this.state.groups) {
                    console.log('on va chercher le contexte ...');
                    var anchor = this;
                    controllerTastr.getContext(this.state.id_user).then(
                        (groups) => anchor.setState({groups: groups}),
                        (error) => console.log(error)
                    )
                } else {
                    console.log(this.state.id_user + ' est connecté!');
                    return (<Setup groups={this.state.groups} />)
                }
                /*tastr.getUser(this.state.id_user).then((user) => {
                    console.log('USER : ' + JSON.stringify(user))
                })*/
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