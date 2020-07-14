import React from 'react';
import {
  Text,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../../styles';
import * as Colors from '../../../../constants/Colors';

class HeaderNShipping extends React.Component {
  render() {
    let {number, total, address, order} = this.props;
    let paymentWarning = false;

    order.payments_list.map((payment) => {
      if (payment.is_open && !payment.is_closed) {paymentWarning = true;}
    });

    return (
      <View>
        <View style={styles.successOrderHeader}>
          {
            paymentWarning === true ?
              <View style={styles.paymentWarning}>
                <Text
                  style={{
                    padding: 10,
                    fontSize: 14
                  }}
                >Payment error {'\n'}Sorry, your payment was not successful. {'\n'}You can pay your order in My orders section</Text>
              </View> : null
          }
          <View style={{flexDirection: 'row'}}>
            <View style={[styles.doneIcon, styles.successOrderDoneIcon]}>
              <Icon
                name="check"
                color={Colors.STEP_HEADER_SELECTED}
                size={16}/>
            </View>
            <View style={styles.successOrderShipping}>
              <Text style={styles.successOrderThanks}>THANK YOU FOR YOUR ORDER</Text>
              <Text style={styles.successOrderNumber}>Your order #{number}</Text>
              <Text style={styles.successOrderHeaderPrice}>{total.currency.outputCurrency()} {total.amount.formatPrice(total.currency)}</Text>
              <Text style={styles.successOrderAddressTitle}>Shipping address</Text>
              <Text
                style={styles.successOrderAddressItem}>{address.first_name} {address.last_name}</Text>
              <Text style={styles.successOrderAddressItem}>{address.address}</Text>
              <Text style={styles.successOrderAddressItem}>{address.city}
                              - {address.pin}</Text>
              <Text style={styles.successOrderAddressItem}>{address.state}</Text>
              <Text style={styles.successOrderAddressItem}>Phone: {address.phone}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default HeaderNShipping;
