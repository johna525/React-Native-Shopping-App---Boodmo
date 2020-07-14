import React from 'react';
import {
    StyleSheet,
    Platform,
    Dimensions
} from 'react-native';
import * as Colors from '../../constants/Colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

module.exports = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: Colors.PAGE_BACKGROUND,
    },
    iosStatusBar: {
        backgroundColor: Colors.PRIMARY,
        height: 20,
        width: SCREEN_WIDTH,
        zIndex: 1
    },
    wrapper: {
        paddingTop: 0,
        paddingBottom: 0,
        width: SCREEN_WIDTH,
        flexGrow: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    separator: {
        height: 1,
        backgroundColor: Colors.SEPARATOR
    },
    button: {
        marginRight: 5,
        borderWidth: 1,
        width: (SCREEN_WIDTH - 70) / 2
    },
    buttonText: {
        fontSize: 14,
        margin: 0
    },
    buttonsContainer: {
        flexGrow: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        marginTop: 0,
        marginBottom: 0
    },
    lastWrapItem: {
        marginBottom: 10
    },

});