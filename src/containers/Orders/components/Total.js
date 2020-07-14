import React from 'react';
import styles from '../styles';
import {
  Text,
  View
} from 'react-native';
import Button from '../../../components/Button';

import * as _ from 'lodash';
import * as Colors from '../../../constants/Colors';

require('../../../utils/Helper');

class Total extends React.Component {

  getSubTotal() {
    let {baseGrandTotal, baseDeliveryCharge} = this.props;
    let subTotal = baseGrandTotal.amount - baseDeliveryCharge.amount;

    return `${baseGrandTotal.currency.outputCurrency()} ${subTotal.formatPrice(baseGrandTotal.currency)}`;
  }

  render() {
    let {
      total,
      baseGrandTotal,
      baseDeliveryCharge,
      grandTotal,
      deliveryCharge,
      cancelButton,
      cancelOrder,
      id
    } = this.props;

    let baseDeliveryChargeValue = baseDeliveryCharge.amount > 0 ?
      `${baseDeliveryCharge.currency.outputCurrency()} ${baseDeliveryCharge.amount.formatPrice(baseDeliveryCharge.currency)}`
      : 'Free';
    let baseGrandTotalValue = `${baseGrandTotal.currency.outputCurrency()} ${baseGrandTotal.amount.formatPrice(baseGrandTotal.currency)}`;

    let deliveryTotalValues = [];
    let showDeliveryTotalValues = false;
    _.forEach(deliveryCharge, (total) => {
      if (total.amount > 0) {
        showDeliveryTotalValues = total.currency != baseDeliveryCharge.currency;
        deliveryTotalValues.push(`${total.currency.outputCurrency()} ${total.amount.formatPrice(total.currency)}`);
      }
    });
    let grandTotalValues = _.map(grandTotal, (total) => {
      return `${total.currency.outputCurrency()}${total.amount.formatPrice(total.currency)}`;
    });

    return (
      <View style={styles.orderInfoFooter}>
        <Text
          style={styles.reviewTotalText}>
                    SubTotal: {total} item(s)&nbsp;
          {this.getSubTotal()}
        </Text>
        <Text
          style={styles.reviewTotalText}>
                    Total Delivery charge:&nbsp;
          {
            baseDeliveryCharge.amount > 0 ?
              baseDeliveryChargeValue
              : 'Free'
          }
          {
            baseDeliveryCharge.amount > 0 && showDeliveryTotalValues ?
              ` (${deliveryTotalValues.join(' + ')})`
              : null

          }
        </Text>
        <Text
          style={[styles.reviewTotalText, styles.reviewGrandTotalText]}>
                    Grand Total:&nbsp;
          {
            grandTotalValues.length === 1 ?
              grandTotalValues.toString()
              :
              baseGrandTotalValue
          }&nbsp;
          {
            grandTotalValues.length > 1 ?
              `(${grandTotalValues.join(' + ')})`
              : null
          }
        </Text>
        {
          cancelButton &&
          <Button
            disabled={false}
            onPress={() => cancelOrder(id)}
            underlayColor={Colors.DRAWER_LINK_BACKGROUND}
            style={styles.buttonCancel}
            textStyle={styles.buttonCancelText}>
            Cancel Order
          </Button>
        }
      </View>
    );
  }
}


export default Total;
