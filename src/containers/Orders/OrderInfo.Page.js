import React from 'react';
import {
  View,
  Modal
} from 'react-native';
import ConfirmModal from '../../components/ConfirmModal';
import ActionBar from 'boodmo/src/components/ActionBar';
import LoadingIndicator from 'boodmo/src/components/LoadingIndicator';
import HeaderNShipping from './components/HeaderNShipping';
import Products from './components/Products';
import Total from './components/Total';

import styles from './styles';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ordersActions from '../../actions/Orders';
import * as sweetAlertActions from '../../actions/SweetAlert';
import * as paymentActions from '../../actions/Payment';

import RazorpayCheckout from 'react-native-razorpay';
import * as Config from '../../constants/Config';
import * as Colors from '../../constants/Colors';
import * as Log from '../../actions/Log';
import * as Events from '../../constants/Events';
import CheckoutComModal from '../../components/CheckoutComModal';
import * as _ from 'lodash';
import {STATUSES} from '../../constants/Orders';

require('../../utils/Helper');

class OrderInfoPage extends React.Component {

  constructor(props) {
    super(props);
    this.openPayment = false;
    this.checkoutComModal = null;
  }

  componentDidMount() {
    this.props.actions.getOrder(this.props.route.orderId);
    if (this.props.route.paymentId) {
      this.props.actions.getPaymentInfo(this.props.route.paymentId);
    }
  }

  componentWillReceiveProps(nextProps) {
    let payment = nextProps.payment;
    if (payment) {
      this.payOrder(payment);
    }
  }

  onRefresh() {
    this.props.actions.getOrder(this.props.route.orderId, true);
  }

  cancelProduct(itemId) {
    Log.logEvent(Events.EVENT_MY_ORDERS_CANCEL);
    this.refs.confirmModal.showConfirm(
      {
        header: 'REMOVE ITEM',
        message: 'Please confirm item cancellation.'
      },
      () => {
        this.props.actions.cancelProduct(this.props.route.orderId, itemId);
      }
    );
  }

  cancelOrder(orderId) {
    Log.logEvent(Events.EVENT_MY_ORDER_CANCEL);
    this.refs.confirmModal.showConfirm(
      {
        header: 'CANCEL ORDER',
        message: 'Please confirm order cancellation.'
      },
      () => {
        this.props.actions.cancelOrder(orderId);
      }
    );
  }

  payOrder(payment) {
    switch (payment['provider_code']) {
    case 'razorpay':
      Log.logEvent(Events.EVENT_MY_ORDERS_PAYMENT_RAZOR);
      this.payWithRazorPay(payment, this.props.route.orderId);
      break;
    case 'paypal':
      Log.logEvent(Events.EVENT_MY_ORDERS_PAYMENT_PAYPAL);
      if (payment['external_link']) {
        this.props.navigator.push({
          id: 'WebBrowser',
          url: payment['external_link']
        });
      }
      this.props.actions.clearPayment();
      break;
    case 'checkout.com':
      Log.logEvent(Events.EVENT_MY_ORDERS_PAYMENT_CHECKOUT_COM);
      this.payWithCheckoutCom(payment);
      break;
    default:
      break;
    }
  }


  payWithRazorPay(payment, orderId) {
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
      self.onRefresh();
      self.props.actions.clearPayment();
    }).catch(() => {
      self.props.actions.clearPayment();
    });
  }

  payWithCheckoutCom(payment) {
    let options = {
      email: payment['customerEmail'],
      amount: payment['value'],
      currency: payment['currency'],
      paymentToken: payment['paymentToken'],
      key: payment['publicKey']
    };
    const self = this;
    this.checkoutComModal.open(options).then(() => {
      self.onRefresh();
      self.props.actions.clearPayment();
    }).catch(() => {
      self.props.actions.clearPayment();
    });
  }

  isOrderCancelled() {
    let cancelled = true;
    _.map(this.props.selectedOrder.packages, (orderPackage) => {
      if (orderPackage['status']['G'] !== 'CANCELLED' && orderPackage['status']['G'] !== 'DELIVERED') {
        cancelled = false;
      }
    });

    return cancelled;
  }

  render() {
    let {
      navigator,
      total,
      selectedOrder,
      isFetching,
      isFetchingModal,
      paymentIsFetching,
      actions
    } = this.props;

    return (
      <View style={styles.container}>
        {this.props.platformOS === 'ios' ? <View style={styles.iosStatusBar}/> : null}
        <ActionBar
          navigator={navigator}
          openDrawer={() => this.props.openDrawer()}
          onBackPress={this.onRefresh.bind(this)}
          title={`Order #${this.props.route.number}`}
          total={total}/>
        <View style={styles.wrapper}>
          <Modal
            animationType={'fade'}
            transparent={true}
            visible={isFetchingModal || paymentIsFetching}
            onRequestClose={() => {
            }}>
            <View style={styles.loadingModal}>
              <LoadingIndicator
                size="xx-large"/>
            </View>
          </Modal>
          <CheckoutComModal ref={(modal) => this.checkoutComModal = modal}/>
          <Products
            packages={selectedOrder.packages}
            navigator={navigator}
            isFetching={isFetching}
            onRefresh={this.onRefresh.bind(this)}
            cancelProduct={this.cancelProduct.bind(this)}
            header={
              <HeaderNShipping
                navigator={this.props.navigator}
                selectedOrder={selectedOrder}
                number={this.props.route.number}
                address={selectedOrder['customerAddress']}
                payments={selectedOrder['payments']}
                onPayNow={(paymentId) => {
                  Log.logEvent(Events.EVENT_MY_ORDERS_PAY_NOW_ORDER_PAGE);
                  actions.getPaymentInfo(paymentId);
                }}/>
            }
            footer={
              selectedOrder.packages.length && !this.isOrderCancelled() ?
                <View style={styles.successOrderFooter}>
                  <Total
                    total={selectedOrder.items_count}
                    baseGrandTotal={selectedOrder['base_grand_total']}
                    baseDeliveryCharge={selectedOrder['base_delivery_total']}
                    grandTotal={selectedOrder['grand_total']}
                    deliveryCharge={selectedOrder['delivery_total']}
                    id={selectedOrder['id']}
                    cancelButton={selectedOrder.customer_status !== STATUSES.DELIVERED && selectedOrder.customer_status !== STATUSES.CANCELLED}
                    cancelOrder={this.cancelOrder.bind(this)}/>
                </View>
                : null
            }/>
          <ConfirmModal ref="confirmModal"/>
        </View>
      </View>
    );
  }
}


function mapStateToProps(state) {
  return {
    connected: state.network.connected,
    platformOS: state.device.platformOS,
    total: state.cart.total,
    selectedOrder: state.orders.selectedOrder,
    isFetching: state.orders.orderIsFetching,
    isFetchingModal: state.orders.isFetchingModal,
    payment: state.payment.payment,
    paymentIsFetching: state.payment.isFetching,
  };
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({...ordersActions, ...sweetAlertActions, ...paymentActions}, dispatch)};
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(OrderInfoPage);
