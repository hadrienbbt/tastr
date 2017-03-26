/**
 * Created by hadrien1 on 16/03/17.
 */

'use strict'

import React, { Component, PropTypes } from 'react';
import * as Animatable from 'react-native-animatable';
import TextField from 'react-native-md-textinput';
import Cookie from 'react-native-cookie';
import {
    Text,
    View,
    ScrollView,
    Button,
    TouchableOpacity,
    Dimensions,
    TouchableWithoutFeedback,
    Image,
    ListView
    } from 'react-native';

import HeaderSection from './HeaderSection.js';
import GroupOverview from './GroupOverview.js';

// functions tastr
var controllerTastr = require('../controller/tastr.js');

// config
var styles = require('../styles/styles.js');
var conf = require('../const/conf.js');
var width = Dimensions.get('window').width;

export default class SelectionGroupe extends Component {
    constructor(props) {
        super(props)
        this._afficherGroupes = this._afficherGroupes.bind(this)
        this._selectionnerGroupe = this._selectionnerGroupe.bind(this)
        this._envoyerGroupesSelectionnes = this._envoyerGroupesSelectionnes.bind(this)
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            allGroupsCheked: false,
            groupsChecked: [],
            groups : [{
                label : this.props.groups.favorites.length > 2  || (this.props.groups.favorites.length == 1 && this.props.groups.favorites[0].shows.length > 1) ? "Séries favorites" : "Série favorite",
                dataSource: ds.cloneWithRows(this.props.groups.favorites)
            },{
                label: 'Niveau du groupe',
                dataSource: ds.cloneWithRows(this.props.groups.shows)
            },{
                label: this.props.groups.existing.length > 1 ? "Groupes existants" : "Groupe existant",
                dataSource: ds.cloneWithRows(this.props.groups.existing)
            }],
        }
    }

    _afficherGroupes() {
        var render = [],
            key = 0,
            id_groupe_tmp = 0;
        for (var i=0; i<this.state.groups.length; i++) {
            if (this.state.groups[i].dataSource.getRowCount() > 0) {
                render.push(<HeaderSection key={key++} title={this.state.groups[i].label} />)
                render.push(
                    <ListView
                        key={key++}
                        enableEmptySections={true}
                        dataSource={this.state.groups[i].dataSource}
                        renderRow={(rowData) => <GroupOverview _id={id_groupe_tmp++} isChecked={this.state.allGroupsCheked} _selectionnerGroupe={this._selectionnerGroupe} shows={rowData.shows} />}
                    />
                )
            }
        }
        return render;
    }

    _selectionnerGroupe(_id) {
        this.state.groupsChecked.includes(_id) ? this.state.groupsChecked.splice(this.state.groupsChecked.indexOf(_id),1) : this.state.groupsChecked.push(_id)
        this.state.groupsChecked.sort()
    }

    // Récupérer tous les groupes sélectionnés et les ajouter à un tableau qu'on enverra au controler pour créer les groupes
    _envoyerGroupesSelectionnes() {
        console.log(this.state.groupsChecked)

        var tabIndexGroupesSelectionnes = this.state.groupsChecked // numéro de ligne des groupes selectionnés par l'utilisateur (commence à 0)

        var tabGroupes = this.props.groups.favorites.concat(this.props.groups.shows) // tableau de groupes ligne par ligne
        var groupsToCreate = new Array()
        var groupsToJoin = new Array()

        for(var i = 0; i < tabGroupes.length; i++)
            if(tabIndexGroupesSelectionnes.includes(i))
                groupsToCreate.push(tabGroupes[i]);

        // La suite des groupes sélectionnés sont les groupes existants
        // On les rejoint
        for(var i = tabGroupes.length; i < tabGroupes.length + this.props.groups.existing.length; i++)
            if(tabIndexGroupesSelectionnes.includes(i))
                groupsToJoin.push(this.props.groups.existing[i-tabGroupes.length]); // enlever l'offset

        if (groupsToCreate.length + groupsToJoin.length == 0) alert('Sélectionnez au moins un groupe à rejoindre !')
        else {
            if (groupsToCreate.length > 0)
                controllerTastr.creerGroupes(this.props.id_user, groupsToCreate).then(
                    (data) => console.log(data),
                    (err) => console.log(err)
                )
            if (groupsToJoin.length > 0)
                controllerTastr.rejoindreGroupes(this.props.id_user, groupsToJoin).then(
                    (data) => console.log(data),
                    (err) => console.log(err)
                )
        }
    }


    render() {
        return (
            <ScrollView>
                <View style={{
                    flex: 1,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginTop: 30,
                }}>
                    <Text style={styles.h1}>Bienvenue sur Tastr !</Text>
                    <Text style={[styles.h2, styles.instructions_group, {width: 0.7 * width}]}>À propos de quelles séries veux-tu discuter ?</Text>
                    { /* Tout (dé)sélectionner
                    <TouchableWithoutFeedback onPress={() => {
                        this._selectionnerGroupe(1)
                    }}>
                        <View style={{
                            marginTop: 30,
                            marginBottom: -25,
                            paddingRight: 10,
                            width: width*0.9}}>
                            <Text style={{textAlign: 'right', fontSize: 15, color: 'white'}}>
                            {!this.state.allGroupsCheked ? 'Tout sélectionner' : 'Tout désélectionner'}</Text>
                        </View>
                    </TouchableWithoutFeedback> */ }
                    {this._afficherGroupes()}
                    <View style={{
                        backgroundColor: '#DDDDDD',
                        margin: 30
                    }}>
                        <Button
                        onPress={this._envoyerGroupesSelectionnes} // récup le tableau concat et envoyer les groupes au serveur
                        title="SUIVANT"
                        color="#424242"
                        accessibilityLabel="Tap here to validate group selection" />
                    </View>
                </View>
            </ScrollView>
        )
    }
}