/**
 * Created by hadrien1 on 14/03/17.
 */

import React, { Component, PropTypes } from 'react';
import * as Animatable from 'react-native-animatable';
import TextField from 'react-native-md-textinput';
import Cookie from 'react-native-cookie';
import {
    Text,
    View,
    Button,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Alert,
    Dimensions,
    Linking
    } from 'react-native';

// custom components
import ConnectMusic from './ConnectMusic.js';
import ConnectShow from './ConnectShow.js';

// configs
var width = Dimensions.get('window').width;
var styles = require('../styles/styles.js');
var strings = require('../const/lang.js');
strings.setLanguage('en');
var conf = require('../const/conf.js');
var splashcreen = require('../img/splashcreen3.png');
var moodmusic_logo = require('../img/moodmusic_logo.png');

const dismissKeyboard = require('dismissKeyboard');

export default class WorkflowConnection extends Component {
    constructor(props) {
        super(props);
        this._afficherEcranConnexion = this._afficherEcranConnexion.bind(this);
        this._connecterMoodmusic = this._connecterMoodmusic.bind(this);
        this._envoyerMail = this._envoyerMail.bind(this);
        this._envoyerCode = this._envoyerCode.bind(this);
        this._moodmusicConnected = this._moodmusicConnected.bind(this);
        this.state = {
            showCode: false,
            apiToConnect: 'show',
        };
    }


    // Method called when an api isn't connected.
    // Displays which type of connection tastr needs
    _afficherEcranConnexion() {
        Cookie.get(conf.cookie_location).then((cookie) => {
            console.log(cookie);
            // Vérify the cookie
            // If the user was connected before
            if (cookie && cookie.id_user) {
                this.props.anchor.setState({isConnected: true, id_user: cookie.id_user});
            } else {
                // If the user has just connected apis
                if (cookie && cookie.profile_music && cookie.profile_music != 'undefined' && this.state.apiToConnect == 'moodmusic') {
                    if (cookie.profile_show && cookie.profile_show != 'undefined') {
                        if (this.state.id_user)
                            this.props.anchor.setState({isConnected: true, id_user: this.state.id_user});
                        else
                            this.props.anchor.setState({isConnected: false});
                    } else {
                        // The user connected only moodmusic
                        this.setState({apiToConnect: 'show', id_moodmusic: cookie.profile_music});
                    }
                }
            }
        },(error) => console.log(error));

        if (this.state.apiToConnect == 'moodmusic') {
            return (<ConnectMusic pages={this} />);
        } else {
            return (<ConnectShow pages={this} />);
        }
    }

    // Method called to send an email with a code when the user is registered on moodmusic
    _envoyerMail(email) {
        console.log(email);
        return new Promise(function(resolve,reject) {
            fetch('http://moodmusic.fr/api/authorization_code', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email
                })
            })
                .then((response) => { return response.json()})
                .then((responseData) => { return responseData;})
                .then((data) => {
                    if (data.error) reject(data.message);
                    else            resolve(data);
                })
                .catch(function(err) {
                    console.log("Moodmusic n'a pas répondu :(" + err);
                    reject(err);
                });
        });
    }

    // Method called to prompt the code that the user has recieved by email
    _envoyerCode(code) {
        return new Promise(function(resolve,reject) {
            fetch('http://moodmusic.fr/api/authorize', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code: code
                })
            })
                .then((response) => {
                    return response.json()
                })
                .then((responseData) => {
                    return responseData;
                })
                .then((data) => {
                    if (data.code == 500)       reject("Code expiré, veuillez rééssayer");
                    else {
                        if(data.wrong_code)     reject("Vous n'avez pas entré le bon code");
                        else                    resolve(data);
                    }
                })
                .catch(function (err) {
                    console.log("Moodmusic n'a pas répondu :(" + err);
                });
        });
    }

    // Needs an email adress or code
    _connecterMoodmusic () {
        dismissKeyboard();
        var anchor = this;
        if (!this.state.showCode) {
            var email = this.refs.textfield_email.state.text;
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (re.test(email)) {
                // Envoyer email avec le code
                anchor.refs.button_getCode.bounceOutLeft();
                this._envoyerMail(email).then((data) => {
                    console.log(data);
                    // this is a valid email address
                    // Bounce out email form
                    anchor.refs.form_connexion_moodmusic.transitionTo({flex: null, width: 0});
                    anchor.refs.form_connexion_moodmusic.bounceOutLeft(400);
                    // Bounce in code view
                    anchor.refs.code_connect.transitionTo({width: null, flex: 1});
                    anchor.refs.code_connect.bounceInRight(800);
                    anchor.setState({showCode: true});
                }, (error) => {
                    alert(error);
                    anchor.refs.button_getCode.bounceInLeft(400);
                })
            } else {
                // invalid email, maybe show an error to the user.
                alert("Veuillez entrer une adresse mail valide.")
            }
        } else {
            var code = this.refs.textfield_code.state.text;
            if (parseInt(code) && code.length == 4) {
                // Vérifier le code
                this._envoyerCode(code).then((data) => {
                    // this is a valid code
                    console.log(data);
                    this.setState({moodmusic_infos: {id: data.me._id, name: data.me.name, email: data.me.email}});
                    this._moodmusicConnected();
                }, (error) => {
                    alert(error);
                })
            }
            else {
                // invalid code, maybe show an error to the user.
                alert("Veuillez entrer un code à 4 chiffres");
            }
        }
    }

    // Action performed when the user has written the right code
    _moodmusicConnected() {
        dismissKeyboard()

        if (this.state.moodmusic_infos && this.state.moodmusic_infos.id) {
            Cookie.set(conf.cookie_location, 'profile_music', this.state.moodmusic_infos.id).then((cookie) => {
                // Passer à la connection des séries TV
                this.setState({apiToConnect: 'show'});
            });
        }
        // Animation
        this.refs.page1.transitionTo({flex: 1});
        this.refs.page1.bounceInDown();
        this.refs.page2.bounceOutDown();
        this.refs.page2.transitionTo({flex: null});
    }


    componentDidMount() {
        this.refs.code_connect.transitionTo({flex: null, width: 0});
        this.refs.code_connect.bounceOutRight();
        this.refs.form_connexion_moodmusic.transitionTo({width: null, flex: 1});
        this.refs.form_connexion_moodmusic.bounceInLeft();
    }

    render() {
        return (
            <Image source={splashcreen} style={styles.backgroundImage}>

                <Animatable.View ref="page1" style={styles.page}>
                    <View style={styles.backdropView}>
                        <Text style={styles.h1}>
                            {strings.hello}
                        </Text>
                        <Text style={styles.h2}>
                            {strings.headline}
                        </Text>
                    </View>
                      {this._afficherEcranConnexion()}
                </Animatable.View>

                <Animatable.View ref="page2" style={{opacity: 0}}>
                    <TouchableWithoutFeedback onPress={dismissKeyboard}>
                        <View style={[styles.backdropView,styles.justify_start]}>
                            <TouchableOpacity onPress={this._moodmusicConnected}>
                                <Image source={moodmusic_logo} style={[styles.logoSignin, styles.marginTop25]}>
                                </Image>
                            </TouchableOpacity>
                            <View style={styles.container_menu_slide}>
                                <Animatable.View ref='form_connexion_moodmusic' style={styles.formContainer}>
                                    <View style={styles.view_music_connection}>
                                        <Text style={[styles.instructions, styles.biggerFont]}>
                                          {strings.instructions_music_connect}
                                        </Text>
                                        <View style={styles.textfield}>
                                            <TextField ref='textfield_email' label={'Email'} keyboardType="email-address" highlightColor={'white'} labelColor={'white'} textColor={'white'}/>
                                        </View>
                                        <Animatable.View ref='button_getCode'>
                                            <Button ref='button_getCode' title="OBTENIR MON CODE" color='white' onPress={this._connecterMoodmusic} />
                                        </Animatable.View>
                                    </View>
                                </Animatable.View>
                                <Animatable.View ref='code_connect' style={styles.code_connect}>
                                    <View style={styles.view_music_connection}>
                                        <Text style={[styles.instructions, styles.biggerFont]}>
                                        {strings.instructions_code}
                                        </Text>
                                        <View style={styles.textfield}>
                                            <TextField ref='textfield_code' label={'Code'} keyboardType={'numeric'} highlightColor={'white'} labelColor={'white'} textColor={'white'}/>
                                        </View>
                                        <Button title="SE CONNECTER" color='white' onPress={this._connecterMoodmusic} />
                                    </View>
                                </Animatable.View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Animatable.View>
            </Image>
        )
    }
}

