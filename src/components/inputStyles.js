import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import * as Colors from '../constants/Colors';

module.exports = StyleSheet.create({
  formGroup: {
    marginBottom: 20
  },
  formInputWrapper: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: Colors.PRIMARY_LIGHT,
    borderWidth: 1,
    borderRadius: 3,
    backgroundColor: '#fff',
    overflow: 'hidden',
    height: 45,
  },
  formPhoneInputWrapper: {
    flexDirection: 'row',
    height: 45,
  },
  formLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000'
  },
  formInput: {
    fontSize: 16,
    height: 43,
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  formTextArea: {
    height: 80,
  },
  formInputError: {
    borderColor: Colors.NOT_VALID
  },
  formGroupError: {
    color: Colors.NOT_VALID,
  },
  formPhone: {
    flexGrow: 1,
    height: 43,
  },
  phoneCode: {
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    borderBottomLeftRadius: 3,
    borderTopLeftRadius: 3,
    fontSize: 16,
    height: 42,
    overflow: 'hidden',
  },
  divider: {
    width: 1,
    height: 43,
    backgroundColor: Colors.PRIMARY_LIGHT
  }
});
