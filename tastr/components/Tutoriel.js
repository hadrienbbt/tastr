/**
 * Created by hadrien1 on 16/03/17.
 */

import React, { Component, PropTypes } from 'react';
import {
    Text,
    View,
    Dimensions,
    Image,
    Button
    } from 'react-native';

// config
var styles = require('../styles/styles.js');
var conf = require('../const/conf.js');
var width = Dimensions.get('window').width;

export default class Tutoriel extends Component {
    constructor(props) {
        super(props)

    }

    render() {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginTop: 30,
                width: width * 0.9
            }}>
                <Text style={styles.h1}>Bienvenue sur Tastr !</Text>
                <Text style={[styles.h2, {marginTop: 25}]}>Tu vas pouvoir rejoindre des groupes de discussion sur tes séries préférées et rencontrer tes nouveaux internet buddies !</Text>
                <Text style={[styles.h2, {marginTop: 25}]}>Le niveau du groupe correspond au nombre de séries que vous avez tous en commun. Découvrez ensemble de nouvelles séries et gagnez des niveaux pour impressionner tout le monde !</Text>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 30,
                }}>
                    <View style={{
                        height: 40,
                        width: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#4CAF50',
                        borderRadius: 50,
                        shadowOpacity: 0.7,
                        shadowOffset: {width:0, height:4},
                        shadowRadius: 2,
                        shadowColor: 'black',
                    }}>
                        <Text style={{
                            textAlign: 'center',
                            color: 'white',
                            fontSize: 20,
                        }}>6</Text>
                    </View>
                    <Text style={[styles.h2, {
                        marginLeft: 15,
                        color: 'white',
                    }]}>= Groupe de niveau 6</Text>
                </View>

                <View style={{
                    backgroundColor: '#DDDDDD',
                    margin: 30
                }}>
                    <Button
                        onPress={this.props._pageSuivante}
                        title="SUIVANT"
                        color="#424242"
                        accessibilityLabel="Tap here to choose your groups" />
                </View>
            </View>
        )
    }
}