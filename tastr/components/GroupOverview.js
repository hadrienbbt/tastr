/**
 * Created by hadrien1 on 13/03/17.
 */

import React, { Component, PropTypes } from 'react';
import {
    Text,
    View,
    Dimensions,
    TouchableWithoutFeedback,
    LayoutAnimation,
} from 'react-native';

var width = Dimensions.get('window').width;

export default class GroupOverview extends Component {
    constructor(props) {
        super(props);
        this._unwrapableIfNeeded = this._unwrapableIfNeeded.bind(this);
        var circle_color;
        switch (this.props.series.length) {
            case 1:
                circle_color = '#3F51B5'
                break;
            case 2:
                circle_color = '#3F51B5'
                break;
            case 3:
                circle_color = '#673AB7'
                break;
            case 4:
                circle_color = '#3F51B5'
                break;
            case 5:
                circle_color = '#B71C1C'
                break;
            case 6:
                circle_color = '#3F51B5'
                break;
            case 7:
                circle_color = '#3F51B5'
                break;
            case 8:
                circle_color = '#3F51B5'
                break;
            case 9:
                circle_color = '#FF5722'
                break;
            case 10:
                circle_color = '#3F51B5'
                break;
            case 11:
                circle_color = '#FF1744'
                break;
            case 12:
                circle_color = '#B71C1C'
                break;
            case 13:
                circle_color = '#3F51B5'
                break;
            case 14:
                circle_color = '#3F51B5'
                break;
        }
        this.state = {circle_color: circle_color, maxLengthDisplay: 50, minimize: true};
    }

    _unwrapableIfNeeded() {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        if (this.props.series.join(', ').length > this.state.maxLengthDisplay)
            return(
            <TouchableWithoutFeedback onPress={() => this.setState({minimize: !this.state.minimize})}>
                <View>
                    <Text style={{
                        color: '#03A9F4',
                        fontSize: 12,
                    }}>{this.state.minimize ? 'Voir plus' : 'Voir moins'}
                    </Text>
                    <Text style={{
                        color: '#9E9E9E',
                        fontSize: 12,
                    }}>Groupe de force {this.props.series.length}</Text>
                </View>
            </TouchableWithoutFeedback>
            )
        else
            return(
                <View>
                    <Text style={{
                        color: '#9E9E9E',
                        fontSize: 12,
                    }}>Groupe de force {this.props.series.length}</Text>
                </View>
            )
    }

    render() {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        return(
            <View style={{
                width: 0.9 * width,
                flexDirection: 'row',
                marginTop: 15,
                paddingLeft: 30,
                paddingRight: 10,
            }}>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                }}>
                    <Text style={{
                        color: 'white',
                        fontSize: 16,
                        paddingRight: 10,
                        width: 0.9 * width - 90,
                    }}>{this.props.series.join(', ').length > this.state.maxLengthDisplay && this.state.minimize ? this.props.series.join(', ').slice(0,this.props.series.join(', ').indexOf(' ',this.state.maxLengthDisplay)) + '...' : this.props.series.join(', ')}</Text>
                    {this._unwrapableIfNeeded()}
                </View>
                <View style={{
                    height: 40,
                    width: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: this.state.circle_color,
                    borderRadius: 50,
                    shadowOpacity: 0.7,
                    shadowOffset: {width:0, height:4},
                    shadowRadius: 2,
                    shadowColor: 'black',
                }}>
                    <Text style={{
                        textAlign: 'center',
                        color: 'white',
                        fontSize: 20,
                    }}>{this.props.series.length}</Text>
                </View>
            </View>
        )
    }
}