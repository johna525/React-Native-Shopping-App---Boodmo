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
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 5,
        paddingBottom: 5,
        width: SCREEN_WIDTH,
    },
    itemText: {
        fontSize: 12,
        color: '#a8aab0',
    },
    partImage: {
        borderColor: Colors.GREY_LIGHT,
        borderWidth: 1,
        width: 100,
        height: 100,
    },
    resultsText: {
        height: 50,
        paddingLeft: 15,
        justifyContent: 'center',
        flexDirection: 'column',
    },
    infoText: {
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10,
        fontSize: 16,
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        width: 50
    },
    actionsContainer: {
        height: 50,
        width: SCREEN_WIDTH,
        backgroundColor: '#ffffff',
        borderColor: Colors.GREY_LIGHT,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    filterWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 50,
    },
    filterText: {
        color: Colors.FILTER_BUTTON
    },
    filterIcon: {
        color: Colors.FILTER_BUTTON,
        marginLeft: 10
    },
    part: {
        backgroundColor: '#fff',
        padding: 10,
        margin: 5,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowRadius: 2,
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.3,
        elevation: 2
    },
    partDescription: {
        paddingLeft: 5,
        overflow: 'hidden',
        width: SCREEN_WIDTH - 150,
    },
    partName: {
        fontWeight: '400',
        fontSize: 16,
        width: SCREEN_WIDTH - 200,
        color: Colors.FILTER_BUTTON,
        marginBottom: 5,
    },
    partPrice: {
        fontWeight: '400',
        fontSize: 16,
        width: SCREEN_WIDTH - 200,
        color: Colors.PRICE,
        marginBottom: 5
    },
    footerLoadingIndicator: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        height: 50,
        marginBottom: 20
    },
    mainLoadingIndicator: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        height: 50
    }
});
