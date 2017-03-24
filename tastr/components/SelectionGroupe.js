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
        super(props);
        this._selectionnerGroupe = this._selectionnerGroupe.bind(this)
        this._envoyerGroupesSelectionnes = this._envoyerGroupesSelectionnes.bind(this)
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            allGroupsCheked: false,
            groupsChecked: [],
            dataSourceFav: ds.cloneWithRows(this.props.groups.favorites),
            dataSourceNiveau: ds.cloneWithRows(this.props.groups.shows),
            dataSourceExistants: ds.cloneWithRows(this.props.groups.existing),
            ids: this.props.groups.favorites.concat(this.props.groups.shows).concat(this.props.groups.existing).map((group,index) => {return index}),
        }
        console.log(this.state.ids);
    }

    _selectionnerGroupe(_id) {
        this.state.groupsChecked.includes(_id) ? this.state.groupsChecked.splice(this.state.groupsChecked.indexOf(_id),1) : this.state.groupsChecked.push(_id)
        this.state.groupsChecked.sort()
    }

    // Récupérer tout les groupes sélectionnés et les ajouter à un tableau qu'on enverra au controler pour créer les groupes
    _envoyerGroupesSelectionnes() {
        var tabIndexGroupesSelectionnes = this.state.groupsChecked;
        var tabGroupes = this.props.groups.favorites.concat(this.props.groups.shows).concat(this.props.groups.existing);
        var groupsToCreate = new Array();
        for(var i = 0; i < tabIndexGroupesSelectionnes.length; i++)
            groupsToCreate.push(tabGroupes[tabIndexGroupesSelectionnes[i]]);
        groupsToCreate.length == 0 ? alert('Sélectionnez au moins un groupe à rejoindre !')
        :controllerTastr.creerGroupes(this.props.id_user,groupsToCreate).then(
            (data) => console.log(data),
            (err) => console.log(err)
        );
    }


    render() {
        var anchor = this,
            i=0;

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
                    <HeaderSection title="Séries favorites" />
                    <ListView
                        enableEmptySections={true}
                        dataSource={this.state.dataSourceFav}
                        renderRow={(rowData) => <GroupOverview _id={this.state.ids[i++]} isChecked={anchor.state.allGroupsCheked} _selectionnerGroupe={anchor._selectionnerGroupe} shows={rowData.shows} />}
                    />
                    <HeaderSection title="Niveau du groupe" />
                    <ListView
                        enableEmptySections={true}
                        dataSource={this.state.dataSourceNiveau}
                        renderRow={(rowData) => <GroupOverview _id={this.state.ids[i++]} isChecked={anchor.state.allGroupsCheked} _selectionnerGroupe={anchor._selectionnerGroupe} shows={rowData.shows} />}
                    />
                    <HeaderSection title={this.props.groups.existing.length > 1 ? "Groupes existants" : "Groupe existant"} />
                    <ListView
                        enableEmptySections={true}
                        dataSource={this.state.dataSourceExistants}
                        renderRow={(rowData) => <GroupOverview _id={this.state.ids[i++]} isChecked={anchor.state.allGroupsCheked} _selectionnerGroupe={anchor._selectionnerGroupe} shows={rowData.shows} />}
                    />


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