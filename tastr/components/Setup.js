/**
 * Created by hadrien1 on 16/03/17.
 */

import React, { Component, PropTypes } from 'react';
import * as Animatable from 'react-native-animatable';

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
var splashcreen = require('../img/splashcreen3.png');

import Tutoriel from './Tutoriel.js';
import SelectionGroupe from './SelectionGroupe.js';

export default class Setup extends Component {
    constructor(props) {
        super(props)
        this._pageSuivante = this._pageSuivante.bind(this);
    }

    _pageSuivante() {
        this.refs.tutoriel.transitionTo({flex: null, width: 0})
        this.refs.tutoriel.bounceOutLeft(400)

        this.refs.selectionGroup.transitionTo({flex: 1, width: null})
        this.refs.selectionGroup.bounceInRight(1000)
    }

    render() {
        return(
            <Image source={splashcreen} style={styles.backgroundImage}>
                <View style={styles.page}>
                    <View style={[styles.backdropView,styles.container_menu_slide]}>
                        <Animatable.View ref='tutoriel' style={{flex: 1, width: null, alignItems: 'center'}}>
                            <Tutoriel _pageSuivante={this._pageSuivante.bind(this)} />
                        </Animatable.View>

                        <Animatable.View ref='selectionGroup' style={{flex: null, width: 0}}>
                            <SelectionGroupe />
                        </Animatable.View>
                    </View>
                </View>
            </Image>
        )
    }
}