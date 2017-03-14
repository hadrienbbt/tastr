/**
 * Created by hadrien1 on 14/03/17.
 */

import React, { Component, PropTypes } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    } from 'react-native'

var styles = require('../styles/styles.js');
var strings = require('../const/lang.js');

var moodmusic_logo = require('../img/moodmusic_logo.png');

export default class ConnectMusic extends Component {
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
