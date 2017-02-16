/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 *
 * author: hadrien barbat
 *
 */

import React, { Component, PropTypes } from 'react';
import LocalizedStrings from 'react-native-localization';
import Swiper from 'react-native-swiper';
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
    Dimensions
} from 'react-native';

require('react-native-material-kit');

var width = Dimensions.get('window').width;
var styles = require('./styles/styles.js');
var strings = require('./const/lang.js');
strings.setLanguage('fr');


// configs
var conf = require('./const/conf.js');
var splashcreen = require('./img/splashcreen3.png');
var moodmusic_logo = require('./img/moodmusic_logo.png');

const dismissKeyboard = require('dismissKeyboard');

export default class Tastr extends Component {

    constructor(props) {
        super(props);
        this._afficherEcranConnexion = this._afficherEcranConnexion.bind(this);
        this._connecterMoodmusic = this._connecterMoodmusic.bind(this);
        this._envoyerMail = this._envoyerMail.bind(this);
        this._envoyerCode = this._envoyerCode.bind(this);
        this._moodmusicConnected = this._moodmusicConnected.bind(this);
        this.state = {showCode: false, apiToConnect: 'moodmusic'};
        Cookie.get('http://moodmusic.fr/').then((cookie) => console.log(cookie));
    }

    // Method called to display which type of connection tastr needs
    _afficherEcranConnexion() {
        Cookie.get('http://moodmusic.fr/').then((cookie) => {
            // Vérify the cookie
            if (cookie && cookie.profile_music && cookie.profile_music != 'undefined' && this.state.apiToConnect == 'moodmusic') {
                this.setState({apiToConnect: 'show'});
                console.log(cookie);
            }
        },(error) => console.log(error));

        if (this.state.apiToConnect == 'moodmusic') {
            return (<ConnectMusic pages={this}/>);
        } else {
            return (<ConnectShows pages={this}/>);
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
                this._envoyerMail(email).then((data) => {
                    console.log(data);
                    // this is a valid email address
                    anchor.setState({showCode: true});
                    anchor.refs.code_connect.transitionTo({width: null, flex: 1});
                    anchor.refs.code_connect.bounceInRight();
                    anchor.refs.form_connexion_moodmusic.transitionTo({flex: null, width: 0});
                    anchor.refs.form_connexion_moodmusic.bounceOutLeft();
                }, (error) => {
                    alert(error);
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
                    this.setState({profile_music: data});
                    this._moodmusicConnected();
                    /*console.log(data);
                    anchor.setState({showCode: false});
                    anchor.refs.code_connect.transitionTo({flex: null, width: 0});
                    anchor.refs.code_connect.bounceOutRight();
                    anchor.refs.form_connexion_moodmusic.transitionTo({width: null, flex: 1});
                    anchor.refs.form_connexion_moodmusic.bounceInLeft();*/
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

        if (this.state.profile_music) {
            Cookie.set('http://moodmusic.fr/', 'profile_music', this.state.profile_music).then((cookie) => {
                console.log(cookie);
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

    // Afficher la connexion ou l'écran suivant quand on est connecté
    _renderComponent() {
        if(this.state.apiToConnect == 'done') {
            return (
                <Image source={splashcreen} style={styles.backgroundImage}>
                    <Tastr_Connected />
                </Image>
            )
        } else {
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
                                            <Button title="OBTENIR MON CODE" color='white' onPress={this._connecterMoodmusic} color='white' />
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
                                            <Button title="SE CONNECTER" color='white' onPress={this._connecterMoodmusic} color='white' />
                                        </View>
                                    </Animatable.View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Animatable.View>
                </Image>
            );
        }
    }

    componentDidMount() {
        this.refs.code_connect.transitionTo({flex: null, width: 0});
        this.refs.code_connect.bounceOutRight();
        this.refs.form_connexion_moodmusic.transitionTo({width: null, flex: 1});
        this.refs.form_connexion_moodmusic.bounceInLeft();
    }

    render() {
        return (
            <View style={{flex: 1}}>
                 {this._renderComponent()}
            </View>
        );
    }
}

class ConnectMusic extends Component {
    constructor(props) {
        super(props);
        this._vueConnexionMoodmusic = this._vueConnexionMoodmusic.bind(this);
    }

    _vueConnexionMoodmusic () {
        this.props.pages.refs.page1.bounceOutUp(800);
        setTimeout(() => {
                this.props.pages.refs.page2.transitionTo({flex: 20, opacity: 1});
                this.props.pages.refs.page2.bounceInUp()
        } ,400);
    }

    render() {
        return(
            <View style={styles.container_connection}>
                <View style={styles.container_instructions}>
                    <Text style={styles.instructions}>
                        {strings.instructions_music}
                    </Text>
                </View>
                <View style={styles.viewButton}>
                    <View style={styles.transparentElement}>
                        <TouchableOpacity onPress={this._vueConnexionMoodmusic}>
                            <Image source={moodmusic_logo} style={styles.logoSignin}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

class ConnectShows extends Component {

    constructor(props) {
        super(props);
        this._showsConnected = this._showsConnected.bind(this);
    }

    _showsConnected () {
        this.props.pages.setState({apiToConnect: 'done'});
    }

    render() {
        return (
            <View style={styles.container_connection}>
                <View style={styles.container_instructions}>
                    <Text style={styles.instructions}>
                            {strings.instructions_shows}
                    </Text>
                </View>
                <View style={styles.viewButton}>
                    <View style={styles.transparentElement}>
                        <TouchableOpacity onPress={this._showsConnected}>
                            <Image source={require('../tastr/img/tvst_logo.png')} style={styles.logoSignin}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.transparentElement}>
                        <TouchableOpacity onPress={this._showsConnected}>
                            <Image source={require('../tastr/img/bs_logo.png')} style={styles.logoSignin}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

class Tastr_Connected extends Component {
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