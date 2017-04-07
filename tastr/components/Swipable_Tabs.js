import React, {Component} from 'react';
import TextField from 'react-native-md-textinput';
import Swiper from 'react-native-swiper';
import {
    Text,
    View,
    Button,
} from 'react-native';

import NavBar from './NavBar.js';
import Conversations from "./Conversations.js"
import ToWatchList from "./ToWatchList.js";

import Title from "./Title";

var styles = require('../styles/styles.js');

export default class Swipable_Tabs extends Component {
    constructor(props) {
        super(props)

        this.state = {model: this.props.model, user: this.props.user, groups: this.props.groups, selected: 0}

        this._getShow = this._getShow.bind(this)
        this._onMomentumScrollEnd = this._onMomentumScrollEnd.bind(this)
        this._changeTab = this._changeTab.bind(this)

    }

    _getShow() {
        var access_token = this.state.user.show_infos.access_token;
        var name = this.refs.textfield_searchShowByName.state.text;
        this.state.model.searchShowByName(name,access_token).then(
            (show) => console.log(show),
            (error) => console.log(error)
        )
    }

    _changeTab(numNewTab, numPreviousTab) {
        this.refs.tabs.scrollBy(numNewTab - numPreviousTab)
        this.setState({selected: numNewTab})
    }

    _onMomentumScrollEnd(e,state,context) {
        this.setState({selected: state.index})
    }

    render() {
        return (
            <View style={{flex:1}}>
                <View style={{flex:1}}>
                    <Swiper
                        ref='tabs'
                        onMomentumScrollEnd ={this._onMomentumScrollEnd}
                        showsPagination={false}
                        showsButtons={false}
                        loop= {false}
                        index={this.state.selected}>

                        <Conversations navigator={this.props.navigator} route={this.props.route} groups={this.state.groups} />

                        <View style={{flex: 1}}>
                            <Title subtitle='Séries qui pourraient te plaire'/>
                            {/*<View style={{flex:1}}>
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
                            <View style={{height: 60}}/>*/}
                            <Button color="white" title="SE DECONNECTER" text="SE DECONNECTER" onPress={this.props._disconnect}/>
                        </View>

                        <ToWatchList user={this.state.user} model={this.state.model} />
                    </Swiper>
                </View>
                <NavBar changeTab={this._changeTab} activeTab={this.state.selected}/>
            </View>
        )
    }
}