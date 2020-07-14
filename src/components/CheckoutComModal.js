import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Dimensions,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import {CreditCardForm} from 'react-native-credit-card-input';
import * as Colors from '../constants/Colors';
import Button from './Button';
import CCTextInput from './CreditCardForm/CCTextInput';
import * as Validator from '../utils/Validator';
import Icon from 'react-native-vector-icons/Ionicons';
import * as CheckoutCom from '../utils/CheckoutCom';
import * as _ from 'lodash';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const dismissKeyboard = require('dismissKeyboard');
const CheckoutComResponses = require('../constants/CheckoutComResponses.json');
const Touchable = Platform.OS === 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableOpacity;

const SCREEN_WIDTH = Dimensions.get('window').width;

class CheckoutComModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      submitDisabled: true,
      form: null,
      email: '',
      emailStatus: 'empty',
      errors: '',
      errorMessage: '',
      isFetching: false,
      warningMessage: '',
      status: null
    };
    this.amount = 0;
    this.currency = 'USD';
    this.key = null;
    this.reject = null;
    this.resolve = null;
    this.paymentToken = null;

    this.pay = this.pay.bind(this);
    this.open = this.open.bind(this);
    this.hide = this.hide.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.clearErrors = this.clearErrors.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  open(options) {
    const {email, amount, currency, paymentToken, key} = options;
    this.setState({
      visible: true,
      email,
      emailStatus: email ? 'valid' : 'empty'
    });
    this.amount = amount;
    this.currency = currency;
    this.paymentToken = paymentToken;
    this.key = key;

    return new Promise(function (resolve, reject) {
      this.resolve = resolve;
      this.reject = reject;
    }.bind(this));
  }

  hide(reject) {
    this.clearErrors();
    this.setState({
      visible: false
    });
    if (reject) {
      this.reject(reject);
    } else {
      this.resolve(CheckoutCom.SUCCESS);
    }
  }

  setError(errorMessage, errors) {
    this.clearErrors();
    this.setState({
      status: 'error',
      errorMessage: errorMessage || 'Payment Unsuccessful',
      errors
    });
  }

  setWarning(message, status) {
    this.clearErrors();
    this.setState({
      status: 'warning',
      warningMessage: message
    });
    setTimeout(() => {
      this.hide(status);
    }, 3000);
  }

  setSuccess() {
    this.clearErrors();
    this.setState({
      status: CheckoutCom.SUCCESS
    });
    setTimeout(() => {
      this.hide(false);
    }, 3000);
  }

  onConfirm() {
    dismissKeyboard();
    this.clearErrors();
    if (!this.state.form) {
      return;
    }
    let {cvc, expiry, number} = this.state.form.values;
    let email = this.state.email;
    number = number.split(' ').join('');
    expiry = expiry.split('/');
    let expiryMonth = expiry[0];
    let expiryYear = expiry[1];
    let key = this.key;
    let options = {
      paymentToken: this.paymentToken,
      email,
      value: this.amount,
      currency: this.currency,
      card: {
        number,
        expiryMonth,
        expiryYear,
        cvv: cvc,
      },
    };
    this.pay(options, key);
  }

  pay(options, key) {
    this.setLoadingState(true);
    CheckoutCom.chargeWithCard(CheckoutCom.createChargePromise(options, key)
      .then(CheckoutCom.checkStatus)
      .then(() => {
        this.setSuccess();
        return;
      })
      .catch(error => {
        let errors = null;
        if (parseInt(error.errorCode) > 80000) {
          let message = 'Something went wrong. Please try later';
          let reject = CheckoutCom.SERVER_ERROR;
          if (parseInt(error.errorCode) === 83021) {
            message = 'Session expired.';
            reject = CheckoutCom.SESSION_EXPIRED;
          }
          this.setWarning(message, reject);
        } else {
          if (error['errors']) {
            errors = error['errors'].join('\n');
          } else if (error['responseCode']) {
            let responseCode = parseInt(error['responseCode']);
            let indexString = _.findIndex(CheckoutComResponses, {'Code': error['responseCode']});
            let indexInt = _.findIndex(CheckoutComResponses, {'Code': responseCode});
            let errorObjectIndex = indexString === -1 ? indexInt : indexString;

            let errorObject = CheckoutComResponses[errorObjectIndex];
            if (errorObject) {
              errors = [errorObject['Description']];
            } else {
              errors = ['Something went wrong. Please try later'];
            }
          }
          errors = errors ? errors.join('\n') : null;
          this.setError(error['message'], errors);
        }
        return;
      })
    );
  }


  onFormChange(form) {
    if (form.valid && this.state.emailStatus === 'valid') {
      this.setState({
        submitDisabled: false,
        form
      });
    } else {
      this.setState({
        submitDisabled: true
      });
    }
  }

  onEmailChange(email) {
    this.setState({email});
    this.validateEmail();
  }

  validateEmail() {
    let status = '';
    if (this.state.email.length < 3) {
      status = 'empty';
    } else if (Validator.email(this.state.email)) {
      status = 'valid';
    } else {
      status = 'invalid';
    }
    this.setState({
      emailStatus: status
    });
  }

  setLoadingState(isFetching) {
    this.setState({
      isFetching
    });
  }

  handleClose() {
    this.hide(CheckoutCom.CANCELED);
  }

  clearErrors() {
    this.setState({
      isFetching: false,
      status: null,
      errors: '',
      errorMessage: '',
      warningMessage: '',
    });
  }

  getStatus() {
    let iconName = 'ios-information-circle-outline';
    let iconColor = Colors.ALERT_INFO;
    let statusText = '';
    let disabled = false;
    switch (this.state.status) {
    case 'error':
      iconName = 'ios-alert-outline';
      iconColor = Colors.ALERT_DANGER;
      statusText = this.state.errorMessage;
      disabled = false;
      break;
    case 'warning':
      iconName = 'ios-warning-outline';
      iconColor = Colors.ALERT_WARNING;
      statusText = this.state.warningMessage;
      disabled = true;
      break;
    case 'success':
      iconName = 'ios-checkmark-circle-outline';
      iconColor = Colors.ALERT_SUCCESS;
      statusText = 'Payment successful';
      disabled = true;
      break;
    default:
      return null;
    }
    return (
      <View style={styles.statusWrapper}>
        <ScrollView>
          <Touchable
            disabled={disabled}
            onPress={this.clearErrors}>
            <View style={styles.resultWrapper}>
              <Icon size={100}
                color={iconColor}
                name={iconName}/>
              <Text style={styles.statusMessage}>{statusText}</Text>
              {
                this.state.errors ?
                  <Text style={styles.errors}>{this.state.errors}.
                                        Please verify the information and try again.
                  </Text>
                  : null
              }
              {
                this.state.status === 'error' ?
                  <Text style={styles.okButtonText}>OK</Text>
                  : null
              }
            </View>
          </Touchable>
        </ScrollView>
      </View>
    );
  }

  render() {
    return (
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={this.state.visible}
        onRequestClose={this.handleClose}>
        <View style={styles.modalBackgroundStyle}>
          <KeyboardAwareScrollView
            contentContainerStyle={styles.scrollViewStyle}
            keyboardShouldPersistTaps="always">
            <TouchableWithoutFeedback
              onPress={() => dismissKeyboard()}>
              <View style={styles.innerContainer}>
                <View style={styles.header}>
                  <Text style={styles.modalHeader}>Checkout.com</Text>
                  <View style={styles.roundButton}>
                    <Touchable
                      style={styles.roundButton}
                      onPress={() => this.hide(CheckoutCom.CANCELED)}>
                      <View style={styles.roundButton}>
                        <Icon name="md-close" size={20} color="#fff"/>
                      </View>
                    </Touchable>
                  </View>
                </View>
                <View style={styles.modalContent}>
                  <View style={styles.priceItem}>
                    <Text style={styles.priceItemLabel}>Transaction Value:</Text>
                    <Text
                      style={styles.priceItemValue}>
                      {this.currency} {this.amount.formatPrice(this.currency)}
                    </Text>
                  </View>
                  <CCTextInput
                    placeholder="email address"
                    keyboardType="email-address"
                    width={SCREEN_WIDTH - 60}
                    value={this.state.email}
                    status={this.state.emailStatus}
                    onChange={this.onEmailChange.bind(this)}
                    onBlur={this.validateEmail.bind(this)}
                  />
                  <CreditCardForm
                    width={SCREEN_WIDTH - 60}
                    onChange={this.onFormChange.bind(this)}/>
                </View>
                <Button
                  onPress={this.onConfirm}
                  style={[
                    styles.modalButton,
                  ]}
                  disabled={this.state.submitDisabled}
                  loading={this.state.isFetching}
                  loadingDisabled={this.state.isFetching}
                  underlayColor={Colors.BUTTON_BLUE_ACTIVE}
                  textStyle={styles.modalButtonText}>
                                    COMPLETE ORDER
                </Button>
                {this.getStatus()}
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAwareScrollView>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalBackgroundStyle: {
    flexGrow: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  scrollViewStyle: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    backgroundColor: '#fff',
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 4,
  },
  modalContainer: {
    paddingVertical: 10,
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalContent: {
    paddingTop: 20,
    paddingHorizontal: 10,
    width: SCREEN_WIDTH - 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  modalButton: {
    backgroundColor: Colors.BUTTON_BLUE,
    width: SCREEN_WIDTH - 60,
    height: 40,
    marginBottom: 20
  },
  modalButtonText: {
    fontSize: 16,
    margin: 0,
    color: '#ffffff'
  },
  priceItem: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    width: SCREEN_WIDTH - 60,
  },
  priceItemLabel: {
    fontSize: 16,
    color: '#000'
  },
  priceItemValue: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000'
  },
  statusMessage: {
    width: SCREEN_WIDTH - 60,
    textAlign: 'center',
    color: '#000',
    fontSize: 20,
    marginBottom: 20
  },
  errors: {
    width: SCREEN_WIDTH - 60,
    color: 'rgba(0,0,0,0.45)',
    textAlign: 'center',
  },
  statusWrapper: {
    position: 'absolute',
    zIndex: 100,
    top: 60,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  resultWrapper: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    width: SCREEN_WIDTH - 20
  },
  header: {
    width: SCREEN_WIDTH - 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#3075dd',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
  },
  roundButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'absolute',
    right: 3.5,
    top: 2.5
  },
  okButtonText: {
    color: Colors.DRAWER_LINK_COLOR,
    fontWeight: 'bold',
    marginTop: 20
  }
});
export default CheckoutComModal;
