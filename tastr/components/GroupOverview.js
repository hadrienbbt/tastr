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
    Image,
} from 'react-native';

var width = Dimensions.get('window').width;

export default class GroupOverview extends Component {
    constructor(props) {
        super(props);
        this._unwrapableIfNeeded = this._unwrapableIfNeeded.bind(this);
        this._displayInnerCircle = this._displayInnerCircle.bind(this);
        var circle_color;
        switch (this.props.shows.length % 30) {
            case 1:
                circle_color = '#673AB7'
                break;
            case 2:
                circle_color = '#3F51B5'
                break;
            case 3:
                circle_color = '#2196F3'
                break;
            case 4:
                circle_color = '#00BCD4'
                break;
            case 5:
                circle_color = '#009688'
                break;
            case 6:
                circle_color = '#4CAF50'
                break;
            case 7:
                circle_color = '#CDDC39'
                break;
            case 8:
                circle_color = '#FBC02D'
                break;
            case 9:
                circle_color = '#FFA726'
                break;
            case 10:
                circle_color = '#FF7043'
                break;
            case 11:
                circle_color = '#F44336'
                break;
            case 12:
                circle_color = '#D81B60'
                break;
            case 13:
                circle_color = '#B71C1C'
                break;
            case 14:
                circle_color = '#990000'
                break;
            case 15:
                circle_color = '#880E4F'
                break;
            case 16:
                circle_color = '#4A148C'
                break;
            case 17:
                circle_color = '#311B92'
                break;
            case 18:
                circle_color = '#0D47A1'
                break;
            case 19:
                circle_color = '#006064'
                break;
            case 20:
                circle_color = '#004D40'
                break;
            case 21:
                circle_color = '#1B5E20'
                break;
            case 22:
                circle_color = '#33691E'
                break;
            case 23:
                circle_color = '#827717'
                break;
            case 24:
                circle_color = '#F57F17'
                break;
            case 25:
                circle_color = '#FF6F00'
                break;
            case 26:
                circle_color = '#E65100'
                break;
            case 27:
                circle_color = '#BF360C'
                break;
            case 28:
                circle_color = '#3E2723'
                break;
            case 29:
                circle_color = '#263238'
                break;
            case 30:
                circle_color = '#263238'
                break;
            default :
                circle_color = '#263238'
                break;
        }
        this.state = {
            _ids: this.props.shows.map((show) => {return show._id}),
            shows: this.props.shows.map((show) => {return show.title}),
            circle_color: circle_color,
            circle_color_selected: '#009688',
            isChecked: this.props.isChecked,
            maxLengthDisplay: 50,
            minimize: true};
    }

    _displayInnerCircle() {
        if (!this.state.isChecked)
            return(
                <Text style={{
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 20,
                }}>{this.props.shows.length}</Text>
            )
        else
            return (
                <Image  source={require('../img/checked.png')}
                        style={{width: 28, height: 28}}/>
            )
    }

    _unwrapableIfNeeded() {
        if (this.state.shows.join(', ').length > this.state.maxLengthDisplay)
            return(
            <TouchableWithoutFeedback onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                this.setState({minimize: !this.state.minimize})
            }}>
                <View style={{width: 150}}>
                    <Text style={{
                        color: '#03A9F4',
                        fontSize: 12,
                    }}>{this.state.minimize ? 'Voir plus' : 'Voir moins'}
                    </Text>
                    <Text style={{
                        color: '#9E9E9E',
                        fontSize: 12,
                    }}>Groupe de niveau {this.props.shows.length}</Text>
                </View>
            </TouchableWithoutFeedback>
            )
        else
            return(
                <View>
                    <Text style={{
                        color: '#9E9E9E',
                        fontSize: 12,
                    }}>Groupe de niveau {this.props.shows.length}</Text>
                </View>
            )
    }

    render() {
        return(
            <TouchableWithoutFeedback onPress={() => {
                if(!this.props.bloquerSelection) {
                    this.setState({isChecked: !this.state.isChecked})
                }
                this.props._selectionnerGroupe(this.props._id)
            }}>
                <View style={{
                    width: 0.9 * width,
                    flexDirection: 'row',
                    marginTop: 15,
                    marginBottom: 5,
                    paddingLeft: 35,
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
                        }}>{this.state.shows.join(', ').length > this.state.maxLengthDisplay && this.state.minimize ? this.state.shows.join(', ').slice(0,this.state.shows.join(', ').indexOf(' ',this.state.maxLengthDisplay)) + '...' : this.state.shows.join(', ')}</Text>
                        {this._unwrapableIfNeeded()}
                    </View>
                    <View style={{
                        height: 40,
                        width: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: this.state.isChecked ? this.state.circle_color_selected: this.state.circle_color,
                        borderRadius: 50,
                        shadowOpacity: 0.7,
                        shadowOffset: {width:0, height:4},
                        shadowRadius: 2,
                        shadowColor: 'black',
                    }}>{this._displayInnerCircle()}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}