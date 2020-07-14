import React from 'react';
import styles from '../../styles';
import {
  Text,
  View,
} from 'react-native';
import * as _ from 'lodash';

class Total extends React.Component {
  render() {
    let {
      itemsCount,
      currency,
      subTotal,
      deliveryCharge,
      grandTotal,
      originalTotal
    } = this.props;

    originalTotal = _.values(originalTotal);

    let showGrandTotalValues = (originalTotal.length === 1 && _.values(originalTotal)[0].currency !== currency) || originalTotal.length > 1;
    let grandTotalValues = _.map(originalTotal, (total) => {
      return `${total.currency.outputCurrency()}${total.amount.formatPrice(total.currency)}`;
    });

    return (
      <View>
        <Text
          style={styles.reviewTotalText}>SubTotal: {itemsCount}
                    &nbsp;item(s) {currency.outputCurrency()} {subTotal.formatPrice(currency)}
        </Text>
        <Text
          style={styles.reviewTotalText}>Total Delivery
                    charge:&nbsp;
          {
            deliveryCharge.amount > 0 ?
              `${deliveryCharge.currency.outputCurrency()} ${deliveryCharge.amount.formatPrice(deliveryCharge.currency)}`
              : 'Free'
          }
        </Text>
        <Text
          style={[styles.reviewTotalText, styles.reviewGrandTotalText]}>
                    Grand Total: {grandTotal.currency.outputCurrency()}&nbsp;
          {grandTotal.amount.formatPrice(grandTotal.currency)}
          {
            showGrandTotalValues ?
              `(${grandTotalValues.join(' + ')})`
              : null
          }
        </Text>
      </View>
    );
  }
}


export default Total;
