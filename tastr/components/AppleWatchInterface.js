import React, {Component} from 'react';
import {
    Text,
    View,
    Button,
} from 'react-native';
import * as watch from 'react-native-watch-connectivity'
import Title from './Title'

var styles = require('../styles/styles.js');

export default class AppleWatchInterface extends Component {
    constructor(props) {
        super(props)
        this.state = {
            messages:   [],
            reachable:  false,
            loading:    false,
            text:       '',
            watchState: watch.WatchState.Inactive,
            fileAPI:    true,
            pings:      0,
            id_user: props.id_user,
            model: props.model,
            toWatch: props.toWatch,
        }
        this.receiveWatchState = this.receiveWatchState.bind(this)
        this.receiveWatchReachability = this.receiveWatchReachability.bind(this)
        this.receiveUserInfo = this.receiveUserInfo.bind(this)
        this.receiveApplicationContext = this.receiveApplicationContext.bind(this)
        this.sendToWatchList = this.sendToWatchList.bind(this)
        this.receiveMessage = this.receiveMessage.bind(this)
        this.formatWatchList = this.formatWatchList.bind(this)
    }

    subscribeToWatchEvents () {
        this.subscriptions = [
            watch.subscribeToMessages(this.receiveMessage),
            watch.subscribeToWatchState(this.receiveWatchState),
            watch.subscribeToWatchReachability(this.receiveWatchReachability),
            watch.subscribeToUserInfo(this.receiveUserInfo),
            watch.subscribeToApplicationContext(this.receiveApplicationContext),
        ]
    }

    receiveMessage (err, message, replyHandler) {
        if (err) console.error(`Error receiving message`, err)
        else {
            console.log('app received message', message)

            if (message.message === 'ping') {
                this.setState({pings: this.state.pings + 1})
                if (replyHandler) {
                    //replyHandler({message: 'pong'})
                }
                else {
                    console.error('no reply handler...')
                }
            }
            if (message.seen) {
                console.log("USER A VU "+ message.seen)
                this.props._vu(message.seen)
            }
            if (message.ask) {
                if (replyHandler) replyHandler({watchList: this.formatWatchList()})
                else console.error('no reply handler...')
            }

            this.setState({messages: [...this.state.messages, message]})
        }
    }

    receiveWatchState (err, watchState) {
        if (err) console.error(`Error receiving watch state`, err)
        else {
            this.setState({watchState})
        }
    }

    receiveWatchReachability (err, reachable) {
        if (!err) {
            console.log('received watch reachability', reachable)
            this.setState({reachable})
        }
        else {
            console.error('error receiving watch reachability', err)
        }
    }

    receiveUserInfo (err, userInfo) {
        if (!err) {
            console.log('received user info', userInfo)
            this.setState({userInfo})
        }
        else {
            console.error('error receiving user info', err)
        }
    }

    receiveApplicationContext (err, applicationContext) {
        if (!err) {
            this.setState({applicationContext})
        }
        else {
            console.error('error receiving application context', err)
        }
    }

    componentDidMount () {
        this.subscribeToWatchEvents()
        watch.sendUserInfo({_id: this.state.id_user})
    }

    unsubscribeFromWatchEvents () {
        this.subscriptions.forEach(fn => fn())
    }

    componentWillUnmount () {
        this.unsubscribeFromWatchEvents()
    }

    componentWillReceiveProps(nextProps) {
        this.sendToWatchList(nextProps.toWatch)
    }

    // Remplir la liste des épisodes à voir, formatés pour l'apple watch
    sendToWatchList(items) {
        watch.updateApplicationContext({watchList: this.formatWatchList(items)})
    }

    formatWatchList(items = this.state.toWatch) {
        var watchListMinified = []
        for (var i=0; i< items.length; i++)
            watchListMinified.push({
                title: items[i].title,
                details: items[i].code,
                id_tvdb: items[i].id_tvdb
            })
        return watchListMinified
    }

    render() {
        return(<View/>)
    }
}