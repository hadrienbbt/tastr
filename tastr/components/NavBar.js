/**
 * Created by hadrien1 on 04/04/2017.
 */

import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableWithoutFeedback,
    Image,
    Dimensions,
    StyleSheet
} from 'react-native';

var styles = require('../styles/styles.js');
var width = Dimensions.get('window').width;

// img
var groups = require('../img/icn_navbar/groups.png')
var groups_selected = require('../img/icn_navbar/groups_selected.png')

var upgrade = require('../img/icn_navbar/upgrade.png')
var upgrade_selected = require('../img/icn_navbar/upgrade_selected.png')

var tvshow = require('../img/icn_navbar/tvshow.png')
var tvshow_selected = require('../img/icn_navbar/tvshow_selected.png')

export default class NavBar extends Component {
    constructor(props) {
        super(props)
        this._rendertabs = this._rendertabs.bind(this)

        this.state = { tabs: [
            {
                icn: groups,
                icn_selected: groups_selected,
                label: 'Groupes',
            },
            {
                icn: upgrade,
                icn_selected: upgrade_selected,
                label: 'Découvrir',
            },
            {
                icn: tvshow,
                icn_selected: tvshow_selected,
                label: 'Séries à voir',
            },
        ]}

    }

    componentDidMount() {
        this.setState({widthTab: width/this.state.tabs.length})
    }

    _rendertabs() {
        var render = []

        for (var i = 0; i < this.state.tabs.length; i++) {
            var tab = this.state.tabs[i]
            render.push(
                <TouchableWithoutFeedback key={i} onPress={this.props.changeTab.bind(this,i,this.props.activeTab)}>
                    <View style={[styles.container_navtab,{width: this.state.widthTab}]}>
                        <Image source={this.props.activeTab == i ? tab.icn_selected : tab.icn} style={styles.icn_navbar}/>
                        <Text style={styledText(this.props.activeTab,i)}>{tab.label}</Text>
                    </View>
                </TouchableWithoutFeedback>
            )
            if (i != (this.state.tabs.length-1))
                render.push(
                    <View key={i+this.state.tabs.length}
                          style={{width: (width - (this.state.widthTab*this.state.tabs.length))/(this.state.tabs.length+1)}}//width - (WIDTH_TAB_CLICKABLE * NB_TAB) / NB_BLANK
                    />
                )
        }

        return render
    }

    render() {
        return (
            <View style={{
                height: 61,
                justifyContent: 'flex-end',
                alignItems: 'center',
            }}>
                <View style={{width: width, height: 1, backgroundColor: '#95989A'}} />
                <View style={{
                    width: width,
                    height: 60,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    {this._rendertabs()}
                </View>
            </View>
        )
    }
}

var styledText = (activeTab, tabNum) => {
    return {
        fontSize: 12,
        color: activeTab == tabNum ? 'white' : '#9E9E9E',
    }
}