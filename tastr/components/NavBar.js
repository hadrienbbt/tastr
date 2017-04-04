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
                    backgroundColor: 'black',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <TouchableWithoutFeedback onPress={() => this.props.changeTab(0,this.props.activeTab)}>
                        <View style={styles.container_navtab}>
                            <Image source={this.props.activeTab == 0 ? groups_selected : groups} style={styles.icn_navbar}/>
                            <Text style={{fontSize: 10,color: this.props.activeTab == 0 ? '#009688' : 'white'}}>Groupes</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.spaceTab}/>
                    <TouchableWithoutFeedback onPress={() => this.props.changeTab(1,this.props.activeTab)}>
                        <View style={styles.container_navtab}>
                            <Image source={this.props.activeTab == 1 ? upgrade_selected : upgrade} style={styles.icn_navbar}/>
                            <Text style={{fontSize: 10,color: this.props.activeTab == 1 ? '#009688' : 'white'}}>Améliorer</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={styles.spaceTab}/>
                    <TouchableWithoutFeedback onPress={() => this.props.changeTab(2,this.props.activeTab)}>
                        <View style={styles.container_navtab}>
                            <Image source={this.props.activeTab == 2 ? tvshow_selected : tvshow} style={styles.icn_navbar}/>
                            <Text style={{fontSize: 10,color: this.props.activeTab == 2 ? '#009688' : 'white'}}>Séries</Text>
                        </View>
                    </TouchableWithoutFeedback>


                </View>
            </View>
        )
    }
}