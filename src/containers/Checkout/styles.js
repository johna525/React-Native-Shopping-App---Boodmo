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
  },
  imageWrapper: {
    alignItems: 'center',
    backgroundColor: '#fff',
    width: SCREEN_WIDTH,
    borderBottomWidth: 1,
    borderBottomColor: Colors.SEPARATOR
  },
  separator: {
    height: 1,
    flex: 1,
    width: SCREEN_WIDTH - 40,
    marginVertical: 15,
    backgroundColor: Colors.SEPARATOR
  },
  separatorItem: {
    marginVertical: 0
  },
  buttonSubmit: {
    backgroundColor: Colors.BUTTON_BLUE,
  },
  buttonSubmitText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  totalContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 5,
    borderTopWidth: 1,
    borderColor: Colors.SEPARATOR,
  },
  innerTotalContainer: {
    width: SCREEN_WIDTH - 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subtotalText: {
    fontSize: 18,
    color: '#000000',
    lineHeight: 20
  },
  totalAmountText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
    lineHeight: 20
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
  rowBack: {
    alignItems: 'flex-end',
    backgroundColor: Colors.GREY,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    width: 75,
    backgroundColor: Colors.BUTTON_DELETE
  },
  quantityWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: Colors.BUTTON_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    height: 50,
    width: 50,
    borderRadius: 3
  },
  textInputWrapper: {
    marginHorizontal: 10,
    borderColor: Colors.PRIMARY_LIGHT,
    borderWidth: 1,
    borderRadius: 3,
    width: 55,
  },
  textInput: {
    fontSize: 15,
    height: 50,
    width: 50,
    textAlign: 'center'
  },
  stepBar: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10
  },
  stepPart: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  stepButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    overflow: 'hidden',
    padding: 5,
    zIndex: 2
  },
  stepButtonRound: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.BUTTON_BLUE,
    padding: 12,
    marginLeft: 5,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 10,
  },
  stepDisabled: {
    backgroundColor: Colors.BUTTON_GREY,
  },
  stepDone: {
    backgroundColor: Colors.SUCCESS
  },
  stepSelected: {
    backgroundColor: Colors.BUTTON_BLUE
  },
  stepButtonLabel: {},
  stepButtonLabelSelected: {
    color: Colors.BUTTON_BLUE,
    fontWeight: '500'
  },
  stepProgress: {
    width: 50,
    height: 5,
    backgroundColor: Colors.BUTTON_BLUE,
    top: -15,
    marginLeft: -20,
    marginRight: -20,
    zIndex: 1
  },
  stepContent: {
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10
  },
  stepsWrapper: {
    paddingVertical: 10,
  },
  stepContainer: {
    width: SCREEN_WIDTH,
    overflow: 'hidden'
  },
  stepHeader: {
    height: 50,
    paddingHorizontal: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepHeaderDisabled: {
    backgroundColor: Colors.STEP_HEADER_DISABLED
  },
  stepHeaderSelected: {
    backgroundColor: Colors.STEP_HEADER_SELECTED
  },
  stepHeaderDone: {
    backgroundColor: Colors.STEP_HEADER_DONE
  },
  stepHeaderLabel: {
    color: Colors.STEP_HEADER_TEXT,
  },
  stepHeaderDoneLabel: {
    color: Colors.STEP_HEADER_DONE_TEXT,
  },
  stepHeaderInner: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  doneIcon: {
    marginRight: 10,
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: Colors.STEP_HEADER_DONE_TEXT
  },
  goToStepButton: {
    padding: 2,
    borderWidth: 1,
    borderColor: Colors.STEP_HEADER_BUTTON,
    borderRadius: 4,
    margin: 0
  },
  changeEmailWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10
  },
  changeEmailText: {
    color: '#000',
    fontWeight: 'bold',
    marginRight: 5
  },
  changeEmailDescription: {
    marginBottom: 10
  },
  changeEmailButton: {
    color: Colors.PRIMARY_BLUE
  },
  formGroup: {
    marginBottom: 20
  },
  formInputWrapper: {
    flexGrow: 1,
    borderColor: Colors.PRIMARY_LIGHT,
    borderWidth: 1,
    borderRadius: 3,
    // height: 45
  },
  formLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000'
  },
  formInput: {
    fontSize: 16,
    height: 40,
    paddingHorizontal: 10
  },
  formInputError: {
    borderColor: Colors.NOT_VALID
  },
  formGroupError: {
    color: Colors.NOT_VALID,
  },
  descriptionBlock: {
    marginVertical: 20
  },
  descriptionTitle: {
    fontSize: 16,
    color: '#000'
  },
  descriptionContent: {
    fontSize: 14,
    color: Colors.GREY
  },
  buttonGroup: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  socialButton: {
    width: (SCREEN_WIDTH - 50) / 2
  },
  selectInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderBottomWidth: 0.5,
    borderRadius: 3,
    borderColor: Colors.PRIMARY_LIGHT,
    height: 45,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  selectInputTextStyle: {
    fontFamily: 'Arial',
    fontSize: 15,
    flex: 1
  },
  selectInputIconStyle: {
    color: Colors.PLACEHOLDER,
    marginLeft: 10,
    fontSize: 15,
  },
  selectWrapInput: {
    paddingTop: 5,
    paddingBottom: 5,
    width: SCREEN_WIDTH - 20,
    marginBottom: 10,
    marginTop: 0
  },
  alertContainer: {
    marginBottom: 20
  },
  alertTotal: {
    alignItems: 'flex-end'
  },
  alertTotalText:{
    textAlign: 'right'
  },
  alertWrapper: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  alertMessage: {
    fontSize: 14,
    color: '#000',
    marginRight: 5,
  },
  alertContent: {
    width: SCREEN_WIDTH - 155
  },
  alertContentWide: {
    width: SCREEN_WIDTH - 70
  },
  bold: {
    fontWeight: 'bold'
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
    fontWeight: 'bold',
    color: '#000'
  },
  reviewProduct: {
    flexDirection: 'column',
    paddingHorizontal: 0
  },
  reviewTotalContainer: {},
  reviewTotalText: {
    textAlign: 'right',
    color: '#000',
  },
  reviewGrandTotalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10
  },
  loadingModal: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  signInButton: {
    marginBottom: 10
  },
  successOrderWrapper: {
    padding: 10,
    backgroundColor: '#fff',
  },
  successOrderHeader: {
    flexDirection: 'column',
    marginBottom: 20,
    justifyContent: 'center'
  },
  successOrderDoneIcon: {
    borderColor: Colors.STEP_HEADER_SELECTED
  },
  successOrderShipping: {
    paddingLeft: 5,
    marginTop: -2
  },
  successOrderThanks: {
    color: Colors.STEP_HEADER_SELECTED,
    fontSize: 16,
    lineHeight: 30,
    fontWeight: '500',
    marginBottom: 15
  },
  successOrderNumber: {
    color: Colors.GREY,
    fontSize: 18,
    marginBottom: 15
  },
  successOrderHeaderPrice: {
    color: '#000',
    marginBottom: 20,
    fontSize: 16
  },
  successOrderAddressTitle: {
    marginBottom: 15,
    fontSize: 18
  },
  successOrderAddressItem: {
    marginBottom: 10
  },
  successOrderPackage: {
    marginBottom: 20
  },
  successOrderFooter: {
    marginBottom: 20
  },
  loadingProfile: {
    textAlign: 'center',
    marginBottom: 10
  },
  paymentCurrencyTitle: {
    color: '#000',
    marginBottom: 20,
    fontSize: 16,
    fontWeight: 'bold'
  },
  loadingIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    height: 50,
    marginBottom: 20
  },
  paymentWarning: {
    width: SCREEN_WIDTH - 10,
    alignSelf: 'center',
    backgroundColor: '#f2dede',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: 'red',
    marginBottom: 10
  }
});
