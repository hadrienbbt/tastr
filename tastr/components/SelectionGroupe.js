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
    } from 'react-native';

import HeaderSection from './HeaderSection.js';
import GroupOverview from './GroupOverview.js';

var styles = require('../styles/styles.js');
var conf = require('../const/conf.js');


export default class SelectionGroupe extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Animatable.View ref="connecte" style={styles.page}>
                <View style={styles.backdropView}>
                    <ScrollView>
                        <View style={{
                            flex: 1,
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            marginTop: 30,
                        }}>
                            <Text style={styles.h1}>Bienvenue sur Tastr !</Text>
                            <Text style={[styles.h2, styles.instructions_group]}>À propos de quelles séries veux-tu discuter ?</Text>
                            <HeaderSection title="Séries favorites" />
                            <GroupOverview series={['Black Mirror','The 100','Humans']} />
                            <GroupOverview series={['The OA', 'American Horror Story']} />
                            <HeaderSection title="Niveau du groupe" />
                            <GroupOverview series={['The 100','Black Mirror','Humans', 'The OA', 'American Horror Story','The 100','Black Mirror','Humans','The OA','The 100','Black Mirror','The OA']} />
                            <GroupOverview series={['The 100','Black Mirror','Humans', 'The OA', 'American Horror Story','The 100','Black Mirror','Humans', 'The OA','The 100','Black Mirror']} />
                            <GroupOverview series={['The OA', 'American Horror Story']} />
                            <GroupOverview series={['The 100','Black Mirror','Humans', 'The OA', 'American Horror Story','The 100','Black Mirror','Black Mirror','Black Mirror']} />
                            <GroupOverview series={['The 100','Black Mirror','Humans', 'The OA', 'American Horror Story','The 100','Black Mirror','Black Mirror','Black Mirror']} />
                        </View>
                    </ScrollView>
                </View>
            </Animatable.View>
        )
    }
}