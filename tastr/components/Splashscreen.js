/**
 * Created by hadrien1 on 20/03/17.
 */

'use strict'

import React, { Component, PropTypes } from 'react';
import {Image} from 'react-native'

var styles = require('../styles/styles.js');
var splashcreen = require('../img/splashcreen3.png');

export default class Splashscreen extends Component {
    constructor(props) {super(props)}

    render() {
        return(<Image source={splashcreen} style={styles.backgroundImage} />)
    }
}