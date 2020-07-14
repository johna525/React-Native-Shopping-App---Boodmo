import React from 'react';
import {
  StyleSheet,
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
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 75,
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#fff'
  },
  loadingIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    height: 50,
    marginBottom: 20
  },
  loadingModal: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  bold: {
    fontWeight: 'bold'
  },
  alignRight: {
    textAlign: 'right'
  },
  orderEmpty: {
    textAlign: 'center',
    paddingVertical: 10
  },
  orderListItem: {
    padding: 10,
  },
  orderListLabel: {
    fontSize: 16,
  },
  orderListValue: {
    textAlign: 'right',
  },
  orderListDescItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  itemText: {
    fontSize: 12,
    fontWeight: '100',
    color: Colors.GREY,
  },
  link: {
    textAlign: 'right',
    color: Colors.PRIMARY_BLUE
  },
  alertWrapper: {
    flex: 1,
  },
  alertMessage: {
    color: '#000'
  },
  separator: {
    height: 1,
    flex: 1,
    flexGrow: 1,
    marginVertical: 15,
    backgroundColor: Colors.SEPARATOR
  },
  packageHeaderText: {
    color: '#000'
  },
  packageBody: {
    paddingTop: 10,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.PACKAGE_BORDER
  },
  packageFooter: {
    marginBottom: 20
  },
  packageFooterText: {
    textAlign: 'right',
    color: '#000'
  },
  successOrderPackage: {
    paddingHorizontal: 10
  },
  successOrderWrapper: {
    backgroundColor: '#fff',
  },
  successOrderHeader: {
    marginBottom: 10,
    padding: 10
  },
  successOrderDoneIcon: {
    borderColor: Colors.STEP_HEADER_SELECTED
  },
  successOrderThanks: {
    color: Colors.STEP_HEADER_SELECTED,
    fontSize: 16,
    lineHeight: 30,
    fontWeight: '500',
    marginBottom: 15
  },
  successOrderNumber: {
    color: '#000',
    marginBottom: 15,
    fontSize: 20,
    fontWeight: 'bold'
  },
  successOrderHeaderPrice: {
    color: '#000',
    marginBottom: 20,
    fontSize: 16
  },
  successOrderAddressTitle: {
    marginBottom: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  successOrderAddressItem: {
    marginBottom: 10
  },
  successOrderFooter: {
    marginBottom: 10
  },
  reviewProduct: {
    flexDirection: 'column',
    paddingHorizontal: 0
  },
  reviewTotalText: {
    textAlign: 'right',
    color: '#000',
  },
  reviewGrandTotalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10
  },
  part: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff'
  },
  partHeader: {
    paddingBottom: 10
  },
  partImage: {
    borderColor: Colors.GREY_LIGHT,
    borderWidth: 1,
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10
  },
  partDescription: {
    paddingLeft: 5,
    overflow: 'hidden',
    width: SCREEN_WIDTH - 150,
  },
  partName: {
    fontWeight: 'bold',
    color: Colors.BUTTON_BLUE,
    marginBottom: 5
  },
  partPrice: {
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5
  },
  cancelWrapper: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  buttonCancel: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.BUTTON_DELETE,
  },
  buttonCancelText: {
    color: Colors.BUTTON_DELETE,
  },
  paymentWrapper: {
    flex: 1,
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingTop: 10
  },
  orderInfoFooter: {
    padding: 10
  },
  productTotalItemText: {
    color: '#000'
  },
  paymentIcon: {
    color: Colors.SUCCESS,
    fontSize: 16,
    marginRight: 8,
  },
  pendingPayment: {
    color: Colors.ALERT_WARNING
  }
});