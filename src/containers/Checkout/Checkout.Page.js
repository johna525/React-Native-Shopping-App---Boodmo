import React from 'react';
import {View, Platform} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ActionBar from '../../components/ActionBar';
import styles from './styles';
import * as Colors from '../../constants/Colors';
import * as Config from '../../constants/Config';
import * as Log from '../../actions/Log';
import * as Events from '../../constants/Events';
import CheckoutComModal from '../../components/CheckoutComModal';
import {getPaymentInfo} from '../../actions/Payment';

require('../../utils/Helper');

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as checkoutActions from '../../actions/Checkout';
import * as userActions from '../../actions/User';
import * as sweetAlertActions from '../../actions/SweetAlert';
import Steps from './components/Steps';

class Checkout extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      openedRazorPay: false,
      openedCheckoutCom: false,
    };

    this.payWithRazorPay = this.payWithRazorPay.bind(this);
    this.payWithCheckoutCom = this.payWithCheckoutCom.bind(this);
    this.finishOrder = this.finishOrder.bind(this);
  }

  componentDidMount() {
    this.props.actions.getInitialStep();
  }

  componentWillUnmount() {
    this.props.actions.resetLoadedProfileState();
  }

  componentWillReceiveProps(nextProps) {
    let createdOrder = nextProps.createdOrder;
    let payment = nextProps.payment;
    let currentPaymentIndex = nextProps.currentPaymentIndex;

    if (createdOrder
            && nextProps.stepPaymentDone
            && !createdOrder['payments']) {
      Log.logEvent(Events.EVENT_CHECKOUT_STEP_PAYMENT_CASH);
      this.finishOrder('SuccessOrderPage');
      return;
    }

    if (createdOrder
            && nextProps.stepPaymentDone
            && payment
            && (createdOrder['payments'][currentPaymentIndex] === payment['paymentID']
                || createdOrder['payments'][currentPaymentIndex] === payment['payment_id']
            )) {
      switch (payment['provider_code']) {
      case 'razorpay':
        Log.logEvent(Events.EVENT_CHECKOUT_STEP_PAYMENT_RAZOR);
        if (!this.state.openedRazorPay) {
          this.payWithRazorPay(payment, createdOrder['order_id']);
        }
        break;
      case 'paypal':
        Log.logEvent(Events.EVENT_CHECKOUT_STEP_PAYMENT_PAYPAL);
        if (payment['external_link']) {
          this.finishOrder('WebBrowser', payment['external_link']);
        } else {
          this.finishOrder('OrdersPage');
        }
        break;
      case 'checkout.com':
        Log.logEvent(Events.EVENT_CHECKOUT_STEP_PAYMENT_CHECKOUT_COM);
        if (!this.state.openedCheckoutCom) {
          this.payWithCheckoutCom(payment);
        }
        break;
      default:
        Log.logEvent(Events.EVENT_CHECKOUT_STEP_PAYMENT_CASH);
        this.finishOrder('SuccessOrderPage');
      }
    }
  }

  checkIfHasMorePayments() {
    return this.props.currentPaymentIndex !== this.props.createdOrder['payments'].length - 1;
  }

  getNextPayment() {
    let nextPaymentIndex = this.props.currentPaymentIndex + 1;
    this.props.actions.getPaymentInfo(this.props.createdOrder['payments'][nextPaymentIndex], nextPaymentIndex);
  }

  onEmailStepSubmit(email, password) {
    Log.logEvent(Events.EVENT_CHECKOUT_STEP_EMAIL);
    this.props.actions.checkEmail(email, password);
  }

  onChangeEmail() {
    Log.logEvent(Events.EVENT_CHECKOUT_STEP_EMAIL_CHANGE_EMAIL);
    this.props.actions.changeEmailCheckout();
  }

  onDeliveryStepSubmit(deliveryInfo) {
    Log.logEvent(Events.EVENT_CHECKOUT_STEP_DELIVERY);
    this.props.actions.validateDeliveryInfo(deliveryInfo);
  }

  onReviewStepSubmit() {
    Log.logEvent(Events.EVENT_CHECKOUT_STEP_REVIEW);
    this.props.actions.getAvailablePaymentMethods();
  }

  onPaymentStepSubmit(localPaymentMethod, crossboardPaymentMethod) {
    Log.logEvent(Events.EVENT_CHECKOUT_STEP_PAYMENT);
    this.props.actions.updatePaymentMethods(localPaymentMethod, crossboardPaymentMethod);
  }

  finishOrder(page, url = null) {
    this.props.navigator.immediatelyResetRouteStack([{
      id: page,
      url: url,
    }]);
    this.props.actions.finishOrder();
  }

  payWithCheckoutCom(payment) {
    this.setState({
      openedCheckoutCom: true
    });
    let options = {
      email: payment['customerEmail'],
      amount: payment['value'],
      currency: payment['currency'],
      paymentToken: payment['paymentToken'],
      key: payment['publicKey']
    };
    const self = this;
    this.checkoutComModal.open(options).then(() => {
      if (self.checkIfHasMorePayments()) {
        self.getNextPayment();
      } else {
        self.finishOrder('SuccessOrderPage');
      }
    }).catch(() => {
      if (self.checkIfHasMorePayments()) {
        self.getNextPayment();
      } else {
        self.finishOrder('SuccessOrderPage');
      }
    });

  }

  payWithRazorPay(payment, orderId) {
    this.setState({
      openedRazorPay: true
    });
    const options = {
      key: Config.ENV === 'prod' ? payment['apiKey'] : Config.API_KEY_RAZORPAY_TEST,
      name: 'Smart Parts Online Pvt Ltd',
      description: `#${payment.number}`,
      image: Config.BOODMO_LOGO_SMALL,
      currency: 'INR',
      amount: payment.amount,
      prefill: {
        email: payment.email,
        contact: payment.phone,
        name: payment.name
      },
      notes: {
        order_number: payment.number,
        order_id: orderId ? orderId : payment['orderID'] ? payment['orderID'] : null,
        bill_id: payment['paymentID']
      },
      theme: {
        color: Colors.RAZORPAY_THEME
      }
    };
    const self = this;
    RazorpayCheckout.open(options).then(() => {
      if (self.checkIfHasMorePayments()) {
        self.getNextPayment();
      } else {
        self.finishOrder('SuccessOrderPage');
      }
    }).catch(() => {
      if (self.checkIfHasMorePayments()) {
        self.getNextPayment();
      } else {
        self.finishOrder('SuccessOrderPage');
      }
    });
  }

  render() {
    return (
      <KeyboardAwareScrollView
        extraScrollHeight={Platform.OS === 'ios' ? -70 : 0}
        keyboardShouldPersistTaps="always">
        <View style={styles.container}>
          {this.props.platformOS === 'ios' ? <View style={styles.iosStatusBar}/> : null}
          <ActionBar
            navigator={this.props.navigator}
            openDrawer={() => this.props.openDrawer()}
            title="CHECKOUT"
            total={this.props.total}/>
          <CheckoutComModal ref={(modal) => this.checkoutComModal = modal}/>
          <View style={styles.wrapper}>
            <Steps
              {...this.props}
              selectedStep={this.props.selectedStep}
              onChangeEmail={this.onChangeEmail.bind(this)}
              clearErrors={this.props.actions.clearErrors}
              onEmailStepSubmit={this.onEmailStepSubmit.bind(this)}
              validatePin={this.props.actions.validatePin}
              saveDeliveryInfo={this.props.actions.saveDeliveryInfo}
              changeCurrentStep={this.props.actions.goToStep}
              onDeliveryStepSubmit={this.onDeliveryStepSubmit.bind(this)}
              onReviewStepSubmit={this.onReviewStepSubmit.bind(this)}
              onPaymentStepSubmit={this.onPaymentStepSubmit.bind(this)}
              isFetching={this.props.isFetching || this.props.authIsFetching || this.props.paymentIsFetching}
              getAvailablePaymentMethods={this.props.actions.getAvailablePaymentMethods}
              signInFacebook={
                (userId, token) => {
                  this.props.actions.signInFacebook(userId, token, true);
                }
              }
              onForgotPassword={(email) => {
                this.props.actions.sendPasswordRecovery(email);
                Log.logEvent(Events.EVENT_FORGOT_PASSWORD);
              }}/>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

function mapStateToProps(state) {
  return {
    connected: state.network.connected,
    platformOS: state.device.platformOS,
    deliveryInfo: state.checkout.deliveryInfo,
    loadedDeliveryInfo: state.checkout.loadedDeliveryInfo,
    signedIn: state.user.signedIn,
    signedOut: state.user.signedOut,
    steps: state.checkout.steps,
    total: state.cart.total,
    reviewCart: state.checkout.reviewCart,
    products: state.cart.products,
    availablePaymentMethods: state.checkout.availablePaymentMethods,
    paymentMethod: state.checkout.paymentMethod,
    createdOrder: state.checkout.createdOrder,
    pinError: state.checkout.pinError,
    pinFetched: state.checkout.pinFetched,
    deliveryErrors: state.checkout.deliveryErrors,
    isFetching: state.checkout.isFetching,
    pinIsFetching: state.checkout.pinIsFetching,
    recoveryIsFetching: state.user.recoveryIsFetching,
    authIsFetching: state.user.isFetching,
    emailExists: state.user.emailExists,
    userEmail: state.user.email,
    fbSignedIn: state.checkout.fbToken != null,
    stepEmailDone: state.checkout.stepEmailDone,
    stepDeliveryDone: state.checkout.stepDeliveryDone,
    stepReviewDone: state.checkout.stepReviewDone,
    stepPaymentDone: state.checkout.stepPaymentDone,
    authError: state.user.authError,
    sentRecoveryMessage: state.user.sentRecoveryMessage,
    payment: state.payment.payment,
    paymentIsFetching: state.payment.isFetching,
    selectedStep: state.checkout.selectedStep,
    localPayment: state.checkout.localPayment,
    crossboardPayment: state.checkout.crossboardPayment,
    currentPaymentIndex: state.payment.currentPaymentIndex,
    currentCurrency: state.user.currentCurrency.name
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...checkoutActions, ...userActions, ...sweetAlertActions,
      getPaymentInfo
    }, dispatch)
  };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Checkout);
