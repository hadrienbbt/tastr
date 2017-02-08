/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component, PropTypes } from 'react';
import LocalizedStrings from 'react-native-localization';
import Swiper from 'react-native-swiper'
import {
    AppRegistry,
    Text,
    View,
    Button,
    Image,
    TouchableOpacity,
    Alert,
    LayoutAnimation,
} from 'react-native';

var styles = require('./styles/styles.js');
var strings = require('./lang/lang.js');

strings.setLanguage('en');

class Tastr extends Component {

    constructor(props) {
        super(props);
        this._connexionMoodmusic = this._connexionMoodmusic.bind(this);
    }

    _connexionMoodmusic() {
       var params = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Origin': '',
                'Host': 'http://moodmusic.fr'
            }
        }

        fetch('http://localhost:8080/')
            .then((response) => { return response.json()})
            .then((responseData) => { return responseData;})
            .then((data) => {
                alert(data.message);
            });
        fetch('http://localhost:8888/api/user/1144738637/info-playlists')
            .then((response) => { return response.json()})
            .then((responseData) => { return responseData;})
            .then((data) => {
                console.log(data);
            });
    }

    render() {
        return (
          <View style={styles.container}>
              <Image source={require('../tastr/img/splashcreen3.jpg')} style={styles.backgroundImage}>
                  <View style={styles.backdropView}>
                      <Text style={styles.h1}>
                        {strings.hello}
                      </Text>
                      <Text style={styles.h2}>
                        {strings.headline}
                      </Text>
                  </View>
                  <this.props.typeConnection />
              </Image>
          </View>
        );
    }
}

class ConnectShows extends Tastr {
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
                        <TouchableOpacity onPress={this._connexionMoodmusic}>
                            <Image source={require('../tastr/img/tvst_logo.png')} style={styles.logoSignin}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.transparentElement}>
                        <TouchableOpacity onPress={this._connexionMoodmusic}>
                            <Image source={require('../tastr/img/bs_logo.png')} style={styles.logoSignin}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

class ConnectMusic extends Tastr {
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
                        <TouchableOpacity onPress={this._connexionMoodmusic}>
                            <Image source={require('../tastr/img/moodmusic_logo.png')} style={styles.logoSignin}>
                            </Image>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

export default class swiper extends Component {
    render() {
        return (
            <Swiper
                style={styles.wrapper}
                showsPagination={false}
                showsButtons={true}
                loop= {false}>
                <Tastr typeConnection={ConnectMusic} />
                <Tastr typeConnection={ConnectShows} />
            </Swiper>
        )
    }
}
AppRegistry.registerComponent('tastr', () => swiper);
