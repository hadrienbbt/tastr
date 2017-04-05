/**
 * Created by hadrien1 on 04/04/2017.
 */

import React, { Component } from 'react';
import Hr from 'react-native-hr';
import {
    Text,
    View,
    Dimensions
} from 'react-native';

var styles = require('../styles/styles.js');
var width = Dimensions.get('window').width;

export default class Title extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={{alignItems: 'center'}}>
                <Text style={{marginTop: 30, fontSize: 32, color: 'white'}}>Tastr</Text>
                <Text style={{marginBottom: 10, fontSize: 20, color: "#F5F5F5"}}>{this.props.subtitle}</Text>
            <View style={{width: 0.85 * width}}><Hr lineColor='#616161'/></View>
            </View>
        )
    }
}