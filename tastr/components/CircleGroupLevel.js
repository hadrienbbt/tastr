import React, {Component} from 'react';
import {
    Text,
    View,
} from 'react-native';

export default class CircleGroupLevel extends Component {
    constructor(props) {
        super(props)
        var circle_color;
        switch (parseInt(this.props.level) % 30) {
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
        this.state = {circle_color: circle_color}
    }

    render() {
        return (
            <View style={{
                backgroundColor: this.state.circle_color,
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
                <Text style={{
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 20,
                }}>{this.props.level}</Text>
            </View>
        )
    }
}