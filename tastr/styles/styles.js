/**
 * Created by hadrien1 on 08/02/17.
 */

'use strict';

import {
    StyleSheet,
    Dimensions
    } from 'react-native';

// Store width in variable
var width = Dimensions.get('window').width;

module.exports = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    h1: {
        fontSize: 32,
        textAlign: 'center',
        margin: 10,
        color: '#FFFFFF',
    },
    h2: {
        color: '#FFFFFF',
        marginBottom: 5,
        fontSize: 15,
    },
    backgroundImage: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        width: null,
        opacity: 1,
    },
    backdropView: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    loginStyle: {
        color: 'white',
        fontSize: 20,
    },
    transparentElement: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    container_connection: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
    container_instructions: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
        width: width * 0.7,
    },
    instructions: {
        color: 'white',
        textAlign: 'center',
        backgroundColor: 'transparent',
        marginBottom: 30,
        fontSize: 15,
    },
    viewButton: {
        flex: 1,
        height: 100,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        paddingBottom: 30,
        width: width * 0.7,
    },
    logoSignin: {
        width: 70,
        height: 70,
        borderRadius: 10,
    },
});
