import React from 'react';
import styles from '../styles';
import {
    Text,
    View,
} from 'react-native';
import ProceedButton from './ProceedButton';
require('../../../utils/Helper');

class Total extends React.Component {
    render() {
        let {
            total,
            amount,
            currency,
            onPress,
        } = this.props;

        return (
            <View style={styles.totalContainer}>
                <View style={styles.innerTotalContainer}>
                    <Text style={styles.subtotalText}>SUBTOTAL ({total} items):</Text>
                    <Text
                        style={styles.totalAmountText}>{currency.outputCurrency()} {amount.formatPrice(currency)}</Text>
                </View>
                <ProceedButton
                    onPress={() => {
                        onPress()
                    }}/>
            </View>
        );
    }
}


export default Total;
