/**
 * Created by hadrien1 on 27/02/17.
 */

import React, { Component } from 'react'
import {
    Text,
    View,
    Navigator,
    TouchableHighlight,
    Image
    } from 'react-native'

import Swipable_Tabs from "./Swipable_Tabs"
import Chat from "./Chat"
import CircleGroupLevel from './CircleGroupLevel.js'

var styles = require('../styles/styles.js');
var splashcreen = require('../img/splashcreen3.png');

var icn_info = require('../img/icn_navigatorbar/icn_info.png')
var icn_back = require('../img/icn_navigatorbar/icn_back.png')

export default class Tastr_Connected extends Component {
    constructor(props) {
        super(props)

        this.state = { model: this.props.model, user: this.props.user, groups: this.props.groups}
        this._updateGroup = this._updateGroup.bind(this)
        this._navigatorRenderScene = this._navigatorRenderScene.bind(this)
        this._renderActionBar = this._renderActionBar.bind(this)
    }

    _updateGroup(messages,index) {
        var updated = this.state.groups;
        updated[index].messages = messages.concat(this.state.groups[index].messages);
        this.setState({groups: updated})
    }

    _navigatorRenderScene (route, navigator) {
        switch (route.id) {
            case 0:
                return (
                    <Swipable_Tabs
                        navigator={navigator}
                        route={route}
                        user={this.state.user}
                        groups={this.state.groups}
                        model={this.state.model}
                        _disconnect={this.props._disconnect}
                    />
                )
            case 1: // messages du groupe
                var id_group_targeted = this.state.groups.findIndex(function(group, i){
                    return group._id === route.id_groupe
                }) // Récupérer le bon groupe pour l'envoyer au chat
                return (
                    <View style={{flex: 1, backgroundColor: 'white'}}>
                        <Image source={splashcreen} style={styles.backgroundImage}>
                            <Chat group={this.state.groups[id_group_targeted]}
                                  user={this.state.user}
                                  model={this.state.model}
                                  index={id_group_targeted}
                                  onSend={this._updateGroup}
                            />
                        </Image>
                    </View>
                );
        }
    }

    _renderActionBar () {
        return ({
            LeftButton: (route, navigator, index, navState) =>
            {
                if (route.id === 0) {
                    return null;
                } else {
                    return (
                        <TouchableHighlight onPress={() => navigator.pop()}>
                            <View style={{flexDirection: 'row', margin: 10}}>
                                <Image source={icn_back} style={{width: 20, height: 20}} />
                                <Text style={{color: 'white', fontSize: 20}}>Groupes</Text>
                            </View>
                        </TouchableHighlight>
                    )
                }
            },
            Title: (route, navigator, index, navState) =>
            {
                if (route.id === 0) {
                    return null;
                } else {
                    var id_group_targeted = this.state.groups.findIndex(function(group, i){
                        return group._id === route.id_groupe
                    }) // Récupérer le bon groupe
                    return (
                        <View style={{alignItems: 'center'}}>
                            <CircleGroupLevel level={this.state.groups[id_group_targeted].shows.length} />
                            <Text style={{marginTop: 5, fontSize: 16, color: 'white'}}>{this.state.groups[id_group_targeted].participants.length + ' personnes'}</Text>
                        </View>
                    )
                }
            },
            RightButton: (route, navigator, index, navState) =>
            {
                if (route.id === 0) {
                    return null;
                } else {
                    return (
                        <TouchableHighlight onPress={() => console.log('infos')}>
                            <Image source={icn_info} style={{width: 25, height: 25,marginTop: 10, marginRight: 20}} />
                        </TouchableHighlight>
                    )
                }
            }
        })
    }

    render() {
        return (
            <Navigator
                initialRoute={{id:0}}
                renderScene={this._navigatorRenderScene}
                configureScene={(route, routeStack) =>
                    Navigator.SceneConfigs.PushFromRight}
                style={{flex: 1}}
                navigationBar={
                    <Navigator.NavigationBar
                        routeMapper={this._renderActionBar()}
                    />
                }
            />
        )
    }
}