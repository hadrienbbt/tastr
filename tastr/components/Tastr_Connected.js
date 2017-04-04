/**
 * Created by hadrien1 on 27/02/17.
 */

import React, { Component } from 'react';
import TextField from 'react-native-md-textinput';
import {
    Text,
    View,
    Button,
    } from 'react-native';

var styles = require('../styles/styles.js');

export default class Tastr_Connected extends Component {
    constructor(props) {
        super(props);
        this.state = {model: this.props.model, user: this.props.user, groups: this.props.groups}
        this._getShow = this._getShow.bind(this)
        console.log(this.state.groups)
    }

    _getShow() {
        var access_token = this.state.user.show_infos.access_token;
        var name = this.refs.textfield_searchShowByName.state.text;
        this.state.model.searchShowByName(name,access_token).then(
            (show) => console.log(show),
            (error) => console.log(error)
        )
    }

    render() {
        return (
            <View style={styles.backdropView}>
                <View style={styles.view_music_connection}>
                    <Text style={[styles.instructions, styles.biggerFont]}>
                        Recherchez une série
                    </Text>
                    <View style={styles.textfield}>
                        <TextField ref='textfield_searchShowByName' label={'Série'} highlightColor={'white'} labelColor={'white'} textColor={'white'}/>
                    </View>
                    <View ref='button_getCode'>
                        <Button ref='button_getCode' title="GO" color='white' onPress={this._getShow}/>
                    </View>
                </View>
            </View>
        )
    }
}