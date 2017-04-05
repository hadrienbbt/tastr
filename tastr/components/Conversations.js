import React, { Component } from 'react';
import {
    Text,
    View,
    Button,
    TouchableHighlight,
    Navigator,
    ListView,
    TouchableWithoutFeedback,
    Image
} from 'react-native';

import GroupOverview from './GroupOverview.js';
import Title from "./Title";

var styles = require('../styles/styles.js');
var rightArrow = require('../img/right-arrow.png')

export default class Conversations extends Component {
    constructor(props) {
        super(props)
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {ds_groups: ds.cloneWithRows(this.props.groups), groups: this.props.groups, selected: 0}
    }

    render() {
        return (
            <View style={[styles.backdropView]}>
                <View style={{flex: 1}}>
                    <Title subtitle='Tes conversations'/>
                    <ListView style={{flex: 1}}
                      dataSource={this.state.ds_groups}
                      renderRow={(rowData) =>
                          <View>
                              <View style={{flexDirection: 'row', paddingBottom: 10}}>
                                  <GroupOverview _selectionnerGroupe={(_id) => this.props.navigator.push({id: 1, id_groupe: _id})} _id={rowData._id} bloquerSelection={true} shows={rowData.shows}/>
                                  <Image source={rightArrow} style={styles.rightArrow}/>
                              </View>
                              {/*<View style={{marginLeft: 30}}><Hr lineColor='#616161'/></View>*/}
                          </View>
                      }
                    />
                    <View style={{height: 60}}/>
                </View>
            </View>
        )
    }
}