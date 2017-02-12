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
var height = Dimensions.get('window').height;

module.exports = StyleSheet.create({
    h1: {
        fontSize: 32,
        textAlign: 'center',
        margin: 10,
        color: '#FFFFFF',
    },
    h2: {
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 5,
        fontSize: 15,
    },
    backgroundImage: {
        flex: 1,
        alignSelf: 'stretch',
        width: null,
        height: null,
        resizeMode: 'cover',
    },
    page: {
        flex: 1,
        backgroundColor: 'transparent',
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
    container_menu_slide: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: 'transparent',
        flex: 1,
    },
    formContainer: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    view_music_connection: {
        width: width * 0.8,
        paddingTop: 30,
        backgroundColor: 'transparent',
    },
    marginTop25: {
        marginTop: 25,
    },
    biggerFont: {
        fontSize: 20,
        marginBottom: 0,
    },
    textfield: {
        marginTop: 20,
        marginBottom: 30,
    },
    code_connect: {
        backgroundColor: 'transparent',
        opacity: 1,
        flex: 1,
        alignItems: 'center',
    },
    justify_start: {
        justifyContent: 'flex-start',
    },
});