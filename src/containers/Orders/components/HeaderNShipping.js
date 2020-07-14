import React from 'react';
import {
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';
import * as _ from 'lodash';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from '../styles';
import Payment from './Payment';
import {ORDER_CANCELLED, ORDER_CLOSED, ORDER_OPEN} from '../../../constants/Orders';
require('../../../utils/Helper');

const moment = require('moment');
const SCREEN_WIDTH = Dimensions.get('window').width;

export default class HeaderNShipping extends React.Component {

  getPaymentView(payment) {
    if (payment.is_open) {
      return (
        <View key={payment.id} style={{marginBottom: 10}}>
          <Payment
            onPayNow={() => this.props.onPayNow(payment.id)}
            currency={payment['total_money']['currency']}
            amountToPay={payment['total_money']['amount']}/>
        </View>
      );
    }

    return null;
  }
  renderAmount = (total_money) => {
    return 'Rs. ' + total_money.amount.formatPrice(total_money.currency);
  };

  renderReceivedPayment = (payment) => {
    let paymentView = null;

    if (payment.is_closed) {
      paymentView = <PaymentRow key={payment.id}>
        <Icon name="check" style={styles.paymentIcon}/>
        <Text>
          Payment <Text style={{fontWeight: 'bold'}}>{this.renderAmount(payment.total_money)}</Text> was captured on <Text style={{fontWeight: 'bold'}}>{moment(payment.created_at.date).format('M-D-Y hh:mm')}</Text> by <Text style={{fontWeight: 'bold'}}>{payment.payment_method}</Text>
        </Text>
      </PaymentRow>;
    }

    return paymentView;
  };

  renderRefundedPayment = (payment) => {
    let paymentView = null;

    if (!payment.is_open) {
      paymentView = <PaymentRow key={payment.id}>
        <Icon name="arrow-circle-o-down" style={styles.paymentIcon}/>
        <Text>
          Payment <Text style={{fontWeight: 'bold'}}>{this.renderAmount(payment.total_money)}</Text> is refunded on <Text style={{fontWeight: 'bold'}}>{moment(payment.closed.date).format('M-D-Y hh:mm')}</Text>
        </Text>
      </PaymentRow>;
    } else {
      paymentView = <PaymentRow key={payment.id}>
        <Icon name="repeat" style={[styles.paymentIcon, styles.pendingPayment]}/>
        <Text>
          Refund process of <Text style={{fontWeight: 'bold'}}>{this.renderAmount(payment.total_money)}</Text> was started on <Text style={{fontWeight: 'bold'}}>{moment(payment.created_at.date).format('M-D-Y hh:mm')}</Text>
        </Text>
      </PaymentRow>;
    }

    return paymentView;
  };

  getPaymentInfo(payments = []) {
    let orderStatus = null;
    let paymentAmounts = [];
    if (payments.length > 0) {
      _.forEach(payments, (payment) => {
        if (payment['is_open'] === true) {
          orderStatus = ORDER_OPEN;
          paymentAmounts.push(payment['total_money'].currency.outputCurrency() + ' ' + payment['total_money'].amount.formatPrice(payment['total_money'].currency));
        } else if (payment['is_open'] === false && payment['is_closed'] === false) {
          orderStatus = ORDER_CLOSED;
        } else if (payment['is_open'] === false && payment['is_closed'] === true) {
          orderStatus = ORDER_CANCELLED;
        }
      });
    }

    return this.getOrderStatusText(orderStatus, paymentAmounts);
  }

  getOrderStatusText(status, amounts = []) {
    let statusText = '';
    switch (status) {
    case ORDER_OPEN:
      if (amounts.length > 1) {
        statusText = 'Payments for ' + amounts.join(' and ') + ' left.';
      } else if (amounts.length === 1) {
        statusText = 'Payment for ' + amounts[0] + ' left.';
      } else {
        statusText = 'No payments left.';
      }
      break;
    case ORDER_CLOSED:
      statusText = 'All payments was closed for this order.';
      break;
    case ORDER_CANCELLED:
      statusText = 'No payments left.';
      break;
    }

    return statusText;
  }

  render() {
    const {
      number,
      address,
      payments,
      selectedOrder
    } = this.props;
    const {refunds} = selectedOrder;
    let pendingPayments = [];
    let receivedPayments = [];
    let openedRefunds = [];
    let closedRefunds = [];

    if (payments) {
      _.map(payments, (payment) => {
        payment.is_open ? pendingPayments.push(payment) : receivedPayments.push(payment);
      });

      if (receivedPayments.length > 0) {
        receivedPayments = _.sortBy(receivedPayments, (payment) => {
          return payment.created_at.date;
        });
      }
    }

    if (refunds) {
      _.map(refunds, (refund) => {
        refund.is_open ? openedRefunds.push(refund) : closedRefunds.push(refund);
      });

      openedRefunds = _.sortBy(openedRefunds, (refund) => {
        return refund.created_at.date;
      });
      closedRefunds = _.sortBy(closedRefunds, (refund) => {
        return refund.created_at.date;
      });
    }

    return (
      <View>
        {
          address &&
          <View style={styles.successOrderHeader}>
            <View>
              <Text style={styles.successOrderNumber}>Your order #{number}</Text>
              <Text style={styles.successOrderAddressTitle}>Shipping to:</Text>
              {
                address.first_name &&
                <Text
                  style={styles.successOrderAddressItem}>
                  {address.first_name} {address.last_name}
                </Text>
              }
              <Text style={styles.successOrderAddressItem}>{address.address}</Text>
              <Text
                style={styles.successOrderAddressItem}>{address.city}, {address.state}, {address.pin}</Text>
              <Text style={styles.successOrderAddressItem}>Phone: {address.phone}</Text>
            </View>
            <TouchableWithoutFeedback onPress={() => {
              this.props.navigator.push({
                id: 'OrderTrackingPage',
                orderId: selectedOrder.id
              });
            }}>
              <StyledButton>
                <ButtonText>Delivery Tracker</ButtonText>
              </StyledButton>
            </TouchableWithoutFeedback>
          </View>
        }
        {
          payments &&
          <View style={styles.successOrderHeader}>
            <Text style={styles.successOrderAddressTitle}>Payment info:</Text>

            {/* Opened payments */}

            {
              pendingPayments.length > 0 && <Text style={styles.successOrderAddressItem}>{this.getPaymentInfo(payments)}</Text>
            }
            {
              pendingPayments.length > 0 && _.map(pendingPayments, (payment) => {
                return this.getPaymentView(payment);
              })
            }

            {/* Closed payments */}

            {
              receivedPayments.length > 0 && _.map(receivedPayments, (payment) => {
                return this.renderReceivedPayment(payment);
              })
            }

            {/* Refunds */}

            {
              openedRefunds.length > 0 && _.map(openedRefunds, (refund) => {
                return this.renderRefundedPayment(refund);
              })
            }
            {
              closedRefunds.length > 0 && _.map(closedRefunds, (refund) => {
                return this.renderRefundedPayment(refund);
              })
            }

            {/* Credit Points */}

            {
              selectedOrder.bills && selectedOrder.bills[0] && selectedOrder.bills[0].credit_points_applied && selectedOrder.bills[0].credit_points_applied.length > 0 ? (
                <View>
                  <Text>Credit Points: </Text>
                  {
                    selectedOrder.bills.map((bill) => {
                      return bill.credit_points_applied.length > 0 ? (
                        bill.credit_points_applied.map((point, key) => {
                          return (
                            <View key={key}>
                              <Text>{point.amount_money.currency.outputCurrency() + ' ' + point.amount.formatPrice(point.amount_money.currency) + ' ' + 'applied:'}</Text>
                              <Text>{moment(point.created_at.date).format('M-D-Y, hh:mm')}</Text>
                            </View>
                          );
                        })
                      ) : null;
                    })
                  }
                </View>
              ) : null
            }
          </View>
        }
      </View>
    );
  }
}

const StyledButton = styled.View`
  border-radius: 4;
  border-color: #2d86df;
  background-color: #2d86df;
  border-width: 1px;
  justify-content: center;
  align-items: center;
  width: ${SCREEN_WIDTH / 2 - 60};
  margin: 10px 0px 0px 0px;
  padding: 8px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 12px;
  font-weight: 800;
`;

const PaymentRow = styled.View`
  marginBottom: 10px;
  flex-direction: row;
  flex-grow: 1;
  width: ${SCREEN_WIDTH - 40};
`;