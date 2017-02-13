/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, PropTypes } from 'react';
import LocalizedStrings from 'react-native-localization';
import Swiper from 'react-native-swiper';
import * as Animatable from 'react-native-animatable';
import TextField from 'react-native-md-textinput';
import {
    AppRegistry,
    Text,
    View,
    Button,
    Image,
    TouchableOpacity,
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


class Tastr extends Component {

    constructor(props) {
        super(props);
        this._connecterMoodmusic = this._connecterMoodmusic.bind(this);
        this.state = {showCode: false};
    }

    // Needs an email adress or code
    _connecterMoodmusic () {

        if (!this.state.showCode) {
            var email = this.refs.textfield_email.state.text;
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (re.test(email)) {
                // this is a valid email address
                this.setState({showCode: true});
                this.refs.code_connect.transitionTo({width: null, flex: 1});
                this.refs.code_connect.bounceInRight();
                this.refs.form_connexion_moodmusic.transitionTo({flex: null, width: 0});
                this.refs.form_connexion_moodmusic.bounceOutLeft();
            } else {
                // invalid email, maybe show an error to the user.
                console.log("coquin mail");
            }
        } else {
            var code = this.refs.textfield_code.state.text;
            if (parseInt(code) && code.length == 4) {
                // this is a valid code
                this.setState({showCode: false});
                this.refs.code_connect.transitionTo({flex: null, width: 0});
                this.refs.code_connect.bounceOutRight();
                this.refs.form_connexion_moodmusic.transitionTo({width: null, flex: 1});
                this.refs.form_connexion_moodmusic.bounceInLeft();
            }
            else {
                // invalid code, maybe show an error to the user.
                console.log("coquin code");
            }
        }
    }

    componentDidMount() {
        this.refs.code_connect.transitionTo({flex: null, width: 0});
        this.refs.form_connexion_moodmusic.transitionTo({width: null, flex: 1});
        this.refs.code_connect.bounceOutRight();
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
                  <this.props.typeConnection pages={this}/>
              </Animatable.View>

              <Animatable.View ref="page2" style={{opacity: 0}}>
                  <View style={[styles.backdropView,styles.justify_start]}>
                      <Image source={moodmusic_logo} style={[styles.logoSignin, styles.marginTop25]}>
                      </Image>
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
              </Animatable.View>
          </Image>
        );
    }
}

class ConnectMusic extends Component {
    constructor(props) {
        super(props);
        this._vueConnexionMoodmusic = this._vueConnexionMoodmusic.bind(this);
    }

    _vueConnnexionMoodmusic () {
        fetch('http://localhost:8080/')
            .then((response) => { return response.json()})
            .then((responseData) => { return responseData;})
            .then((data) => {
                if(data)
                    console.log(data.message);
                else
                    alert("Le serveur 8080 n'a pas répondu :(");
            });
        fetch('http://moodmusic.fr/api/user/1144738637/info-playlists', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then((response) => { return response.json()})
            .then((responseData) => { return responseData;})
            .then((data) => {
                console.log(data);
            })
            .catch(function(err) {
                alert("Le serveur 8888 n'a pas répondu :(");
                console.log(err);
            });
    }

    _vueConnexionMoodmusic () {
        this.props.pages.refs.page1.bounceOutUp(800);
        setTimeout(() =>
            this.props.pages.refs.page2.transitionTo({flex:20, opacity: 1})
        ,400);
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
                        <TouchableOpacity onPress={console.log("hello")}>
                            <Image source={require('../tastr/img/tvst_logo.png')} style={styles.logoSignin}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.transparentElement}>
                        <TouchableOpacity onPress={console.log("hello")}>
                            <Image source={require('../tastr/img/bs_logo.png')} style={styles.logoSignin}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

export default class swiper extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Swiper
                showsPagination={false}
                showsButtons={false}
                loop= {false}
                index={0}>
                <Tastr typeConnection={ConnectMusic} />
                <Tastr typeConnection={ConnectShows} />
            </Swiper>
        )
    }
}
AppRegistry.registerComponent('tastr', () => swiper);