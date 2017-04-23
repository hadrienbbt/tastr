import React, {Component} from 'react';
import {
    View,
    Button,
    ListView,
    Text,
    Dimensions,
} from 'react-native';

import Title from "./Title";
import ToWatchItem from "./ToWatchItem";
import AppleWatchInterface from "./AppleWatchInterface";

var styles = require('../styles/styles.js')
var width = Dimensions.get('window').width;
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class ToWatchList extends Component {
    constructor(props) {
        super(props)

        this.state = {model: this.props.model, user: this.props.user}

        this._getToWatchList = this._getToWatchList.bind(this)
        this._displayList = this._displayList.bind(this)
        this._initAppleWatchComponent = this._initAppleWatchComponent.bind(this)
        this._getToWatchList()
    }

    _getToWatchList() {
        this.state.model.getToWatchList(this.state.user.show_infos.access_token).then(
            (tabItems) => {
                this.setState({
                    ds_toWatch: ds.cloneWithRows(tabItems),
                    toWatch: tabItems
                })
            }, (error) => console.log(error)
        )
    }

    _vu(id_tvdb, access_token) {
        console.log('ajout vu à '+id_tvdb+'...')
        return new Promise((resolve,reject) => this.state.model.postEpisodeWatched(id_tvdb, access_token).then(
            (tabItems) => {
                this.setState({
                    ds_toWatch: ds.cloneWithRows(tabItems),
                    toWatch: tabItems
                })
                console.log('vu succès !')
                resolve()
            }, (error) => reject(error)
        ))
    }

    _displayList() {
        if (this.state.ds_toWatch) {
            return (
                <ListView
                    style={{width: width}}
                    dataSource={this.state.ds_toWatch}
                    renderRow={(rowData) =>
                        <ToWatchItem id_tvdb={rowData.id_tvdb} _vu={(_id) => this._vu(_id,this.state.user.show_infos.access_token)} image={rowData.image} title={rowData.title} code={rowData.code} remaining={rowData.remaining} subtitle={rowData.subtitle}/>
                    }
                />
            )
        } else {
            return(<Text style={styles.h1}>Chargement...</Text>)
        }
    }

    _initAppleWatchComponent() {
        if (this.state.toWatch) {
            return (<AppleWatchInterface toWatch={this.state.toWatch} id_user={this.state.user._id} _vu={(_id) => this._vu(_id,this.state.user.show_infos.access_token)}/>)
        }
    }

    render() {
        return (
            <View style={{flex: 1, alignItems: 'center'}}>
                <Title subtitle='Épisodes à voir'/>
                {this._displayList()}
                {this._initAppleWatchComponent()}
                <View style={{height: 60}}/>
            </View>
        )
    }
}