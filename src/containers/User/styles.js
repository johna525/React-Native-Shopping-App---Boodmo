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
        alignItems: 'center',
        backgroundColor: Colors.PRIMARY_LIGHT,
    },
    iosStatusBar: {
        backgroundColor: Colors.PRIMARY,
        height: 20,
        width: SCREEN_WIDTH,
        zIndex: 1
    },
    imageWrapper: {
        alignItems: 'center',
        backgroundColor: Colors.PRIMARY,
        width: SCREEN_WIDTH,
        paddingBottom: 10,
        zIndex: 2,
        shadowColor: Colors.SHADOW,
        shadowOpacity: 20,
        shadowRadius: 3,
        shadowOffset: {width: 0, height: 0}
    },
    buttonSubmit: {
        backgroundColor: Colors.BUTTON_BLUE,
        width: SCREEN_WIDTH - 80,
    },
    headerButton: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
    },
    drawerMenuButtonWrapper: {
        position: 'absolute',
        left: 0,
        top: 0
    },
    wrapScrollTab: {
        width: SCREEN_WIDTH,
        backgroundColor: Colors.PRIMARY_DARK,
    },
    tabView: {
        width: SCREEN_WIDTH - 20 * 2,
        margin: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingVertical: 20,
        overflow: 'hidden',
    },
    tabLabel: {
        fontSize: 16,
        width: SCREEN_WIDTH - 40 * 2,
        color: '#000',
        fontWeight: 'bold'
    },
    containerDotOuter: {
        borderColor: Colors.BORDER_DOT,
        borderStyle: 'dotted',
        borderWidth: 2,
        marginVertical: 15,
        width: SCREEN_WIDTH - 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerDotInner: {
        width: SCREEN_WIDTH - 20,
        paddingVertical: 15,
        paddingHorizontal: 15,
        marginLeft: 0,
        overflow: 'hidden',
        backgroundColor: '#fff'
    },
    tabTitle: {
        fontSize: 19,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
        color: Colors.PRIMARY_DARK,
    },
    inputWrapper: {
        paddingHorizontal: 15,
        marginBottom: -20
    },
    textButton: {
        color: Colors.PRIMARY_LIGHT,
        textAlign: 'center'
    },
    buttonGroup: {
        marginTop: 15
    },
    loadingModal: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
});