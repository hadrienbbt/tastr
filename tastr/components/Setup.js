/**
 * Created by hadrien1 on 16/03/17.
 */

'use strict'

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

import Tutoriel from './Tutoriel.js';
import SelectionGroupe from './SelectionGroupe.js';

export default class Setup extends Component {
    constructor(props) {
        super(props)
        this._pageGroupes = this._pageGroupes.bind(this);
        this._pageTuto = this._pageTuto.bind(this);
        this._setupDone = this._setupDone.bind(this);
    }

    _pageGroupes() {
        this.refs.tutoriel.transitionTo({flex: null, width: 0})
        this.refs.tutoriel.bounceOutLeft(400)

        this.refs.selectionGroup.transitionTo({flex: 1, width: null})
        this.refs.selectionGroup.bounceInRight(1000)
    }

    _pageTuto() {
        this.refs.tutoriel.transitionTo({flex: 1, width: null})
        this.refs.tutoriel.bounceInRight(400)

        this.refs.selectionGroup.transitionTo({flex: null, width: 0})
        this.refs.selectionGroup.bounceOutRight(1000)
    }

    _setupDone() {
        return new Promise((resolve,reject) => {
            // Animation au clic
            this.refs.selectionGroup.transitionTo({flex: null, width: 0})
            this.refs.selectionGroup.bounceOutLeft(400).then(() => resolve())
        })
    }

    componentDidMount() {
        this._pageTuto();
    }

    render() {
        return(
            <View style={styles.page}>
                <View style={[styles.backdropView,styles.container_menu_slide]}>
                    <Animatable.View ref='tutoriel' style={{flex: 1, width: null, alignItems: 'center'}}>
                        <Tutoriel _pageSuivante={this._pageGroupes.bind(this)} />
                    </Animatable.View>

                    <Animatable.View ref='selectionGroup' style={{flex: null, width: 0}}>
                        <SelectionGroupe _setupDone={this._setupDone.bind(this)} anchor={this.props.anchor} id_user={this.props.id_user} groups={this.props.groups} />
                    </Animatable.View>
                </View>
            </View>
        )
    }
}