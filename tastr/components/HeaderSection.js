/**
 * Created by hadrien1 on 13/03/17.
 */

import React, { Component, PropTypes } from 'react';
import Hr from 'react-native-hr';
import {
    Text,
    View,
    Dimensions
} from 'react-native';

var width = Dimensions.get('window').width;

export default class HeaderSection extends Component {
    constructor(props) {super(props)}

    render() {
        return (
            <View style={{width: 0.90 * width, marginTop: 30}}>
                <Hr lineColor='#95989A'/>
                <Text style={{
                    fontSize: 15,
                    color: 'white',
                    marginTop: 5,
                    marginLeft: 10
                }}>{this.props.title}</Text>
            </View>
        )
    }
}