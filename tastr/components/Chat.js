import React, {Component} from 'react';
import {
    View
} from 'react-native';

import { GiftedChat } from 'react-native-gifted-chat';

export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            model: this.props.model,
            id_group: this.props.group._id,
            messages: this.props.group.messages,
            participants: this.props.group.participants,
            shows: this.props.group.shows
        };
        this.onSend = this.onSend.bind(this);
    }

    onSend(messages = []) {
        this.state.model.saveMessage(messages,this.state.id_group)
        this.setState((previousState) => {
            return {
                messages: GiftedChat.append(previousState.messages, messages),
            };
        });
        console.log(messages)
        this.props.onSend(messages,this.props.index)
    }
    render() {
        return (
            <GiftedChat
                messages={this.state.messages}
                onSend={this.onSend}
                user={{_id: this.props.user._id}}
            />
        )
    }
}