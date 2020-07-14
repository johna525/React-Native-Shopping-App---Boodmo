import React from 'react';
import {
    StyleSheet
} from 'react-native';
import * as Colors from '../../constants/Colors';

export default StyleSheet.create({
    supportWrapper: {
      marginTop: 20,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    overlay: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      overflow: 'hidden',
      flexDirection: 'row'
    },
    modalBlock: {
      backgroundColor: '#fff',
      padding: 20,
      height: 'auto'
    },
    supportButtonText: {
      color: '#fff',
      fontSize: 16
    },
    submitButton: {
      backgroundColor: Colors.BUTTON_BLUE,
      marginBottom: 20
    },
    descriptionInput: {
      fontSize: 16,
      flexGrow: 1,
      paddingHorizontal: 20
    },
    descriptionWrapper: {
      flexGrow: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderColor: Colors.PRIMARY_LIGHT,
      borderWidth: 1,
      borderRadius: 3,
      backgroundColor: '#fff',
      overflow: 'hidden',
      height: 100,
      paddingVertical: 5
    },
    formGroupError: {
      color: Colors.NOT_VALID
    },
    selectInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: Colors.PRIMARY_LIGHT,
        borderWidth: 1,
        borderRadius: 3,
        height: 40,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    selectInputTextStyle: {
        fontFamily: 'Arial',
        fontSize: 15,
        flex: 1,
        color: Colors.SEARCH_PLACEHOLDER
    },
    selectInputIconStyle: {
        color: Colors.PLACEHOLDER,
        marginLeft: 10,
        fontSize: 15,
    },
    thankYouForReview: {
      backgroundColor: Colors.BUTTON_GREEN
    }
});
