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
    marginLeft: -10,
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
  tabLabel: {
    fontSize: 13,
    width: SCREEN_WIDTH - 40 * 2,
    color: '#7b92ae',
  },
  textInputWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 5,
    width: SCREEN_WIDTH - 80,
    borderColor: Colors.PRIMARY_LIGHT,
    borderWidth: 1,
    borderRadius: 3,
  },
  textInput: {
    flexGrow: 1,
    fontSize: 15,
    paddingLeft: 0,
    height: 40,
  },
  selectInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderBottomWidth: 0.5,
    borderRadius: 3,
    borderColor: Colors.PRIMARY_LIGHT,
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
  selectWrapInput: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    width: SCREEN_WIDTH - 20 * 2,
  },
  buttonSubmit: {
    backgroundColor: Colors.BUTTON_BLUE,
    minWidth: 280,
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
  }
});
