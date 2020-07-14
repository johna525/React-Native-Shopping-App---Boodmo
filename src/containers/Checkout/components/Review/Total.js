import React from 'react';
import styles from '../../styles';
import {
  Text,
  View,
} from 'react-native';
import Alert from '../../../../components/Alert';
import * as _ from 'lodash';

class Total extends React.Component {
  render() {
    let {
      currency,
      subTotal,
      deliveryTotal,
      grandTotal,
      itemsCount,
      originalTotal
    } = this.props;

    let grandTotalValues = _.map(originalTotal, (total) => {
      return `${total.currency.outputCurrency()}${total.amount.formatPrice(total.currency)}`;
    });

    return (
      <View style={styles.reviewTotalContainer}>
        <Text
          style={styles.reviewTotalText}>
          {itemsCount} item(s):&nbsp;
          {currency.outputCurrency()} {subTotal.formatPrice(currency)}
        </Text>
        <Text
          style={styles.reviewTotalText}>
                    Delivery charge:&nbsp;
          {
            deliveryTotal.amount > 0 ?
              `${deliveryTotal.currency.outputCurrency()} ${deliveryTotal.amount.formatPrice(deliveryTotal.currency)}`
              : 'Free'
          }
        </Text>
        <Text
          style={[styles.reviewTotalText, styles.reviewGrandTotalText]}>
                    Grand Total:&nbsp;
          {grandTotal.currency.outputCurrency()} {grandTotal.amount.formatPrice(grandTotal.currency)}
        </Text>
        <View style={[styles.alertContainer, styles.alertTotal]}>
          <Alert
            type="warning">
            <Text style={[styles.alertMessage, styles.bold, styles.alertTotalText]}>
                            You will pay:&nbsp;
              {grandTotalValues.join(' + ')}
            </Text>
          </Alert>
        </View>
      </View>
    );
  }
}


export default Total;
