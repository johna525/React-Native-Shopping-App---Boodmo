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
    tableHeaderContainer: {
        backgroundColor: '#ffffff',
        padding: 0
    },
    tableHeader: {
        flexDirection: 'row',
    },
    cell: {
        paddingHorizontal: 2,
        paddingVertical: 2,
        borderWidth: 0.5,
        flexGrow: 1,
        fontSize: 13,
        borderColor: Colors.SEPARATOR
    },
    tableHeaderText: {
        color: '#000',
        fontWeight: 'bold',
        flexGrow: 1,
        fontSize: 16,
        textAlign: 'center'
    }

});