import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import Button from '../../../components/Button';
import RadioForm from '../../../components/RadioForm';
import styles from '../styles';
import * as _ from 'lodash';
import {ALERT_DANGER} from '../../../constants/Colors';
import Alert from '../../../components/Alert';
require('../../../utils/Helper');

class PaymentStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      localPaymentMethod: 'razorpay',
      crossboardPaymentMethod: 'checkout.com',
    };

    this.PAYMENT_METHODS_LOCAL = [
      {
        value: 'razorpay',
        name: 'CREDIT/DEBIT CARD \nOR NET BANKING (INDIA)',
        disabled: true,
        total_amount: 0,
        discount: 0,
        deliveryDiscount: false,
        base_currency: 'INR',
        image: require('../../../assets/payment_credit_card.png')
      },
      {
        value: 'cash',
        name: 'CASH ON DELIVERY',
        disabled: true,
        total_amount: 0,
        discount: 0,
        deliveryDiscount: false,
        base_currency: 'INR',
        image: require('../../../assets/payment_cash.png')
      }
    ];
    this.PAYMENT_METHODS_CROSSBOARD = [
      {
        value: 'checkout.com',
        name: 'CREDIT/DEBIT CARD \n(INTERNATIONAL)',
        disabled: true,
        total_amount: 0,
        discount: 0,
        deliveryDiscount: false,
        base_currency: 'USD',
        image: require('../../../assets/payment_credit_card.png')
      },
      {
        value: 'paypal',
        name: 'PAYPAL',
        disabled: true,
        total_amount: 0,
        discount: 0,
        deliveryDiscount: false,
        base_currency: 'USD',
        image: require('../../../assets/payment_paypal.png')
      }
    ];
  }

  componentWillReceiveProps(props) {
    if (props.localPayment && props.availablePaymentMethods.local) {
      let newPaymentMethod = null,
        needChangePayment = false;
      _.each(this.PAYMENT_METHODS_LOCAL, (payMethod) => {
        let methodObject = props.availablePaymentMethods.local[payMethod.value] || null;
        if (methodObject) {
          payMethod.disabled = false;
          payMethod.total_amount = methodObject.deliveryDiscount ?
            methodObject.total_pay.amount - methodObject.deliveryDiscount.amount
            : methodObject.total_pay.amount;
          payMethod.base_currency = methodObject.total_pay.currency;
          payMethod.deliveryDiscount = !!methodObject.deliveryDiscount;
        } else {
          payMethod.disabled = true;
        }
        if ((this.state.localPaymentMethod === payMethod.value && payMethod.disabled)) {
          needChangePayment = true;
        }
        if (newPaymentMethod == null && !payMethod.disabled) {
          newPaymentMethod = payMethod.value;
        }
      });
      if (needChangePayment) {
        this.setState({
          localPaymentMethod: newPaymentMethod
        });
      }
    }
    if (props.crossboardPayment && props.availablePaymentMethods.crossboard) {
      let newPaymentMethod = null;
      let needChangePayment = false;
      _.each(this.PAYMENT_METHODS_CROSSBOARD, (payMethod) => {
        let methodObject = props.availablePaymentMethods.crossboard[payMethod.value] || null;
        if (methodObject) {
          payMethod.disabled = false;
          payMethod.total_amount = methodObject.deliveryDiscount ?
            methodObject.total_pay.amount - methodObject.deliveryDiscount.amount
            : methodObject.total_pay.amount;
          payMethod.base_currency = methodObject.total_pay.currency;
          payMethod.deliveryDiscount = !!methodObject.deliveryDiscount;
        } else {
          payMethod.disabled = true;
        }
        // payMethod.discount = methodObject.discount;
        if ((this.state.crossboardPaymentMethod === payMethod.value && payMethod.disabled)) {
          needChangePayment = true;
        }
        if (newPaymentMethod == null && !payMethod.disabled) {
          newPaymentMethod = payMethod.value;
        }
      });
      if (needChangePayment) {
        this.setState({
          crossboardPaymentMethod: newPaymentMethod
        });
      }
    }
  }

  getPaymentMethodObjectByCode(methods, code) {
    let index = _.findIndex(methods, function (o) {
      return o.code == code;
    });
    return methods[index];
  }

  handleSubmit() {
    this.props.onSubmit(this.state.localPaymentMethod, this.state.crossboardPaymentMethod);
  }

  handleChangeLocalPaymentMethod(method) {
    this.setState({
      localPaymentMethod: method
    });
  }

  handleChangeCrossboardPaymentMethod(method) {
    this.setState({
      crossboardPaymentMethod: method
    });
  }

  render() {
    return (
      <View style={styles.stepContainer}>
        <View style={styles.stepContent}>
          {
            this.props.localPayment && this.props.crossboardPayment &&
            <View style={styles.alertContainer}>
              <Alert
                type="default"
                iconColor={ALERT_DANGER}
                icon="exclamation">
                <Text style={styles.alertMessage}>
                                    IMPORTANT:
                </Text>
                <Text style={[styles.alertMessage, styles.bold, styles.alertContent]}>
                                    Order’s amount was divided into two payments (INR and USD). We need you to pay both
                                    of these to proceed your order.
                </Text>
              </Alert>
            </View>
          }
          {
            this.props.localPayment &&
            <View>
              <Text style={styles.paymentCurrencyTitle}>Select payment method
                                for {this.PAYMENT_METHODS_LOCAL[0].base_currency}</Text>
              <RadioForm
                buttons={this.PAYMENT_METHODS_LOCAL}
                loadingDisabled={this.props.isFetching}
                selected={this.state.localPaymentMethod}
                onSelect={this.handleChangeLocalPaymentMethod.bind(this)}
                disabledMessage="This payment method is not available for selected sellers"
              />
            </View>
          }
          {
            this.props.crossboardPayment &&
            <View>
              <Text style={styles.paymentCurrencyTitle}>Select payment method
                                for {this.PAYMENT_METHODS_CROSSBOARD[0].base_currency}</Text>
              <RadioForm
                buttons={this.PAYMENT_METHODS_CROSSBOARD}
                loadingDisabled={this.props.isFetching}
                selected={this.state.crossboardPaymentMethod}
                onSelect={this.handleChangeCrossboardPaymentMethod.bind(this)}
                disabledMessage="This payment method is not available for selected sellers"
              />
            </View>
          }
          <Button
            disabled={false}
            loading={this.props.isFetching}
            loadingDisabled={this.props.isFetching}
            onPress={this.handleSubmit.bind(this)}
            style={styles.buttonSubmit}
            textStyle={styles.buttonSubmitText}>
                        CONTINUE
          </Button>
        </View>
      </View>

    );
  }
}

export default PaymentStep;
