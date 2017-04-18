import React, {Component} from 'react';
import {
    Text,
    View,
    Button,
    Dimensions,
    Image,
    TouchableOpacity,
    ListView
} from 'react-native';

import CircleGroupLevel from './CircleGroupLevel'
import Title from "./Title"

// functions tastr

var width = Dimensions.get('window').width;
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Discover extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: this.props.user,
            model: this.props.model,
            ds_discover: ds.cloneWithRows([])
        }
        this._linkConversation = this._linkConversation.bind(this)
        this._displayDiscover = this._displayDiscover.bind(this)
        this._displayDiscover()
    }


    _linkConversation() {
        console.log('coucou')
    }

    _displayDiscover() {
        this.state.model.getDiscover(this.state.user._id).then((discover) => {
            this.setState({ds_discover: ds.cloneWithRows(discover)})
        })
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Title subtitle='Séries qui pourraient te plaire'/>

                <ListView
                    enableEmptySections={true}
                    dataSource={this.state.ds_discover}
                    renderRow={(rowData) =>
                        <DiscoverItem _id={rowData._id} image={rowData.image} title={rowData.title}/>
                    }
                />

                <View style={{height: 60}}/>

            </View>
        )
    }
}

class DiscoverItem extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (

                <View ref="item" style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20}}>
                    <View style={{
                        marginLeft: 0.05 * width, marginRight: 20,
                        shadowOpacity: 0.7, shadowOffset: {width:3, height:7}, shadowRadius: 2, shadowColor: 'black',
                        backgroundColor: 'black'
                    }}>
                        <Image style={{
                            width: 110, height: 150,
                            borderColor: 'rgba(255, 255, 255, 0.4)', borderWidth: 2}}
                               source={{uri: this.props.image ? this.props.image : 'https://www.betaseries.com/images/fonds/poster/79481.jpg'}}/>
                    </View>
                    <View style={{flex: 1, marginRight: 10}}>

                        <TouchableOpacity style={{flex: 1}} onPress={this._linkConversation}>
                            <Text style={{color: '#9E9E9E', fontStyle: 'italic', fontSize: 15}}>Augmente le niveau de
                                <Text style={{color: '#03A9F4', fontStyle: 'normal'}}> Netflix and chill </Text>
                                en regardant:</Text >
                        </TouchableOpacity>

                        <Text style={{fontSize: 23, color: 'white'}}>{this.props.title}</Text>{/*30 CARAC MAX*/}

                        <TouchableOpacity style={{width: 80}} onPress={this._linkConversation}>
                            <Text style={{color: '#03A9F4', fontSize: 15}}>Infos</Text>
                        </TouchableOpacity>

                        <View style={{flex: 1, flexDirection: 'row', marginTop: 15}}>
                            <CircleGroupLevel level="13" />
                            <Image style={{margin: 20, marginTop: 10}} source={require('../img/right-arrow2.png')}/>
                            <CircleGroupLevel level="14" />
                        </View>
                    </View>
                </View>
        )
    }
}