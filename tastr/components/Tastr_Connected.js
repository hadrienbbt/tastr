/**
 * Created by hadrien1 on 27/02/17.
 */

import React, { Component } from 'react'
import {
    Text,
    View,
    Navigator,
    Image
    } from 'react-native'

import Title from "./Title"
import Swipable_Tabs from "./Swipable_Tabs"

export default class Tastr_Connected extends Component {
    constructor(props) {
        super(props)

        this.state = { model: this.props.model, user: this.props.user, groups: this.props.groups}
        this._navigatorRenderScene = this._navigatorRenderScene.bind(this)
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
                    />
                )
            case 1: // messages du groupe
                console.log(route.id_groupe)
                return (
                    <View style={{flex: 1, backgroundColor: '#009688'}}>
                        <Title subtitle='Messages'/>
                    </View>
                );
        }
    }

    render() {
        return (
            <Navigator
                initialRoute={{id:0}}
                renderScene={this._navigatorRenderScene}
                configureScene={(route, routeStack) =>
                    Navigator.SceneConfigs.PushFromRight}
                style={{flex: 1}}
            />
        )
    }
}