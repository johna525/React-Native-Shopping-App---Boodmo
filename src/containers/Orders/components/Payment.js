import React from 'react';
import {
  Text,
  View,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity
} from 'react-native';

import styles from '../styles';
import Alert from '../../../components/Alert';
require('../../../utils/Helper');

const Touchable = Platform.OS === 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableOpacity;

class Payment extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {
      onPayNow,
      amountToPay,
      currency
    } = this.props;

    return (
      <Touchable
        onPress={onPayNow.bind(this)}>
        <View>
          <Alert
            type="warning"
            icon="exclamation-circle">
            <View style={styles.alertWrapper}>
              <Text style={styles.alertMessage}>
                <Text style={styles.bold}>
                  IMPORTANT:
                </Text>
                <Text> we expect you to pay for this order {currency.outputCurrency()} {amountToPay.formatPrice(currency)}</Text>
                <Text style={[styles.link, styles.bold]}> Pay now</Text>
              </Text>
            </View>
          </Alert>
        </View>
      </Touchable>
    );
  }
}

export default Payment;
