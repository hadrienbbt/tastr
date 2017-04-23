import React, {Component} from 'react';
import * as Animatable from 'react-native-animatable';
import {
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
} from 'react-native';

var styles = require('../styles/styles.js');
var width = Dimensions.get('window').width;

var img_seen = require('../img/seen.png')
var img_subtitles = require('../img/subtitles.png')


export default class ToWatchItem extends Component {
    constructor(props) {
        super(props)
        this._onSeen = this._onSeen.bind(this)
    }

    _onSeen() {
        this.refs.item.bounceOutLeft(400)
        this.props._vu(this.props.id_tvdb).then(
            () => {
                this.refs.item.bounceInRight(400)
            },
            () => this.refs.item.bounceInLeft(400)
        )
    }

    render() {
        return (
            <Animatable.View ref="item" style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20}}>
                <View style={{
                    marginLeft: 0.05 * width, marginRight: 20,
                    shadowOpacity: 0.7, shadowOffset: {width:3, height:7}, shadowRadius: 2, shadowColor: 'black',
                    backgroundColor: 'black'
                }}>
                    <Image style={{
                        width: 110, height: 150,
                        borderColor: 'rgba(255, 255, 255, 0.4)', borderWidth: 2}}
                           source={{uri: this.props.image ? this.props.image : 'https://www.betaseries.com/images/fonds/poster/161511.jpg'}}/>
                </View>
                <View style={{flex: 1}}>
                    <Text style={{fontSize: 23, color: 'white'}}>{this.props.title}</Text>{/*30 CARAC MAX*/}
                    <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                        <Text style={{fontSize: 15, color: 'white'}}>{this.props.code}</Text>
                        <Text style={{fontSize: 13, color: '#9E9E9E', marginLeft: 10}}>{this.props.remaining > 0 ? '+'+this.props.remaining+' épisodes' : ''}</Text>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', marginTop: 20}}>
                        <View style={{alignItems: 'center',marginRight: 40}}>
                            <View style={{
                                backgroundColor: '#3F51B5',
                                width: 40,
                                height: 40,
                                borderRadius: 50,
                                shadowOpacity: 0.7,
                                shadowOffset: {width:0, height:4},
                                shadowRadius: 2,
                                shadowColor: 'black',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <Image style={{width: 22, height: 22}} source={img_subtitles}/>
                            </View>
                            <Text style={{marginTop: 10, fontSize: 13, color: '#9E9E9E'}}>Sous-titres</Text>
                        </View>
                        <TouchableOpacity onPress={this._onSeen}>
                            <View style={{alignItems: 'center', height: 70}}>
                                <View style={{
                                    backgroundColor: '#CDDC39',
                                    width: 40,
                                    height: 40,
                                    borderRadius: 50,
                                    shadowOpacity: 0.7,
                                    shadowOffset: {width:0, height:4},
                                    shadowRadius: 2,
                                    shadowColor: 'black',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Image style={{width: 28, height: 28}} source={img_seen}/>
                                </View>
                                <Text style={{marginTop: 10, fontSize: 13, color: '#9E9E9E'}}>Vu</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animatable.View>
        )
    }
}