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

// config
var styles = require('../styles/styles.js');
var conf = require('../const/conf.js');
var width = Dimensions.get('window').width;

export default class SelectionGroupe extends Component {
    constructor(props) {
        super(props);
        this._selectionnerGroupe = this._selectionnerGroupe.bind(this)
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            allGroups: false,
            groupsChecked: [],
            dataSourceFav: ds.cloneWithRows([
                {_id: 1, series: ['Black Mirror','The 100','Humans']},
                {_id: 2, series: ['The OA', 'American Horror Story']}
            ]),
            dataSourceNiveau: ds.cloneWithRows([
                {_id: 3, series: ['The 100','Black Mirror','Humans', 'The OA', 'American Horror Story','The 100','Black Mirror','Humans','The OA','The 100','Black Mirror','The OA']},
                {_id: 4, series: ['The 100','Black Mirror','Humans', 'The OA', 'American Horror Story','The 100','Black Mirror','Humans', 'The OA','The 100','Black Mirror']},
                {_id: 5, series: ['The OA', 'American Horror Story']},
                {_id: 6, series: ['The 100','Black Mirror','Humans', 'The OA', 'American Horror Story','The 100','Black Mirror','Black Mirror','Black Mirror']},
                {_id: 7, series: ['The 100','Black Mirror','Humans', 'The OA', 'American Horror Story','The 100','Black Mirror','Black Mirror','Black Mirror']}
            ])
        }
    }

    _selectionnerGroupe(_id) {
        this.state.groupsChecked.includes(_id) ? this.state.groupsChecked.splice(this.state.groupsChecked.indexOf(_id),1) : this.state.groupsChecked.push(_id)
        this.state.groupsChecked.sort()
    }

    render() {
        var anchor = this;
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
                            {!this.state.allGroups ? 'Tout sélectionner' : 'Tout désélectionner'}</Text>
                        </View>
                    </TouchableWithoutFeedback> */ }
                    <HeaderSection title="Séries favorites" />
                    <ListView
                        dataSource={this.state.dataSourceFav}
                        renderRow={(rowData) => <GroupOverview _id={rowData._id} isChecked={anchor.state.allGroups} _selectionnerGroupe={anchor._selectionnerGroupe} series={rowData.series} />}
                    />
                    <HeaderSection title="Niveau du groupe" />
                    <ListView
                        dataSource={this.state.dataSourceNiveau}
                        renderRow={(rowData) => <GroupOverview _id={rowData._id} isChecked={anchor.state.allGroups} _selectionnerGroupe={anchor._selectionnerGroupe} series={rowData.series} />}
                    />
                    <View style={{
                        backgroundColor: '#DDDDDD',
                        margin: 30
                    }}>
                        <Button
                        onPress={() => console.log(this.state.groupsChecked)}
                        title="SUIVANT"
                        color="#424242"
                        accessibilityLabel="Tap here to validate group selection" />
                    </View>
                </View>
            </ScrollView>
        )
    }
}