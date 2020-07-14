import React from 'react';
import {
    StyleSheet,
    Platform,
    Dimensions
} from 'react-native';
import * as Colors from '../../constants/Colors';
const HEADER_HEIGHT = 50;

module.exports = StyleSheet.create({
    headerButton: {
        height: HEADER_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        width: HEADER_HEIGHT
    },
    badgeBubble: {
        position: 'absolute',
        top: 7,
        right: 5,
        borderRadius: 2
    },
    badgeText: {
        paddingHorizontal: 4,
        color: '#fff',
        fontSize: 10
    },
    notEmptyCart: {
        backgroundColor: Colors.CART_NOT_EMPTY
    },
    emptyCart: {
        backgroundColor: Colors.CART_EMPTY
    }
});