import React from 'react';
import {
    Text,
    View,
    Image,
    Platform,
    TouchableNativeFeedback,
    TouchableOpacity,
    StyleSheet,
    Dimensions
} from 'react-native';

var Touchable = Platform.OS == 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableOpacity;
import * as Colors from "../constants/Colors";
import * as _ from "lodash";

const SCREEN_WIDTH = Dimensions.get('window').width;

class RadioForm extends React.Component {

    constructor(props) {
        super(props);
    }


    handleSelectRadioButton(value) {
        this.props.onSelect(value);
    }

    render() {
        const {buttons, disabledMessage, loadingDisabled, selected} = this.props;

        return (
            <View style={styles.formHorizontal}>
                {
                    buttons.map((radioButton, key) => (
                        !radioButton.disabled &&
                        <RadioButton
                            key={key}
                            isSelected={_.findIndex(buttons, (button) => {
                                return button.value == selected;
                            }) === key}
                            disabled={radioButton.disabled}
                            loadingDisabled={loadingDisabled}
                            disabledMessage={disabledMessage}
                            value={radioButton.value}
                            name={radioButton.name}
                            image={radioButton.image}
                            discount={radioButton.discount}
                            deliveryDiscount={radioButton.deliveryDiscount}
                            total_amount={radioButton.total_amount}
                            base_currency={radioButton.base_currency}
                            onPress={(value) => this.handleSelectRadioButton(value)}
                        />
                    ))
                }
            </View>
        );
    }
}

export class RadioButton extends React.Component {

    render() {
        const {
            onPress,
            value,
            disabled,
            loadingDisabled,
            discount,
            isSelected,
            image,
            base_currency,
            disabledMessage,
            name,
            total_amount,
            deliveryDiscount
        } = this.props;

        return (
            <View>
                <Touchable
                    onPress={() => onPress(value)}
                    disabled={disabled || loadingDisabled}>
                    <View
                        style={[styles.radioWrapper, disabled && styles.disabled, (discount > 0 || deliveryDiscount) && styles.radioWrapperDiscount]}>
                        <View
                            style={[styles.radioInnerWrapper, (discount > 0 || deliveryDiscount) && styles.wrapperDiscount]}>
                            <View
                                style={[styles.radioBox, (discount > 0 || deliveryDiscount) && styles.wrapperDiscount]}>
                                <View style={styles.radioOuter}>
                                    <View style={[styles.radioInner,
                                        isSelected && styles.selected
                                    ]}>
                                    </View>
                                </View>
                            </View>
                            <View
                                style={[styles.labelBox, (discount > 0 || deliveryDiscount) && styles.wrapperDiscount]}>
                                {
                                    image &&
                                    <View style={styles.paymentMethodImage}>
                                        <Image
                                            source={image}
                                        />
                                    </View>
                                }
                                <View>
                                    <Text style={[styles.paymentMethodLabel, styles.label]}>
                                        {name}
                                    </Text>
                                    {
                                        discount > 0 &&
                                        <Text style={[styles.paymentMethodLabel, styles.paymentMethodDiscount]}>
                                            -{discount}%
                                        </Text>
                                    }
                                    {
                                        deliveryDiscount > 0 &&
                                        <Text style={[styles.paymentMethodLabel, styles.paymentMethodDiscount]}>
                                            -50% ON DELIVERY!
                                        </Text>
                                    }
                                </View>
                            </View>
                        </View>
                        <View style={styles.currencyWrapper}>
                            <Text
                                style={styles.paymentAmount}>{base_currency.outputCurrency()} {total_amount.formatPrice(base_currency)}</Text>
                        </View>
                    </View>
                </Touchable>
                {
                    disabled ?
                        <Text style={styles.disabledMessage}>{disabledMessage}</Text>
                        : null
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    formHorizontal: {
        flexDirection: 'column',
    },
    radioWrapper: {
        flexGrow: 1,
        height: 45 * 2,
        backgroundColor: '#fff',
        borderColor: Colors.PRIMARY_LIGHT,
        borderWidth: 1,
        borderRadius: 3,
        overflow: 'hidden',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        marginBottom: 20
    },
    radioWrapperDiscount: {
        height: 55 * 2
    },
    radioInnerWrapper: {
        flexDirection: 'row',
        height: 45,
        borderColor: Colors.PRIMARY_LIGHT,
        borderBottomWidth: 1,
    },
    wrapperDiscount: {
        height: 55
    },
    currencyWrapper: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 45
    },
    disabled: {
        opacity: 0.3
    },
    radioBox: {
        borderRightWidth: 1,
        borderRightColor: Colors.PRIMARY_LIGHT,
        width: 42,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioOuter: {
        width: 10 + 10,
        height: 10 + 10,
        borderRadius: (10 + 10) / 2,
        borderColor: Colors.PRIMARY_BLUE,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 10 / 2,
        backgroundColor: 'transparent'
    },
    selected: {
        backgroundColor: Colors.PRIMARY_BLUE
    },
    labelBox: {
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    label: {
        width: SCREEN_WIDTH - 130,
    },
    paymentMethodImage: {
        marginRight: 10,
        width: 35
    },
    paymentMethodLabel: {
        color: '#000',
        textAlign: 'left'
    },
    paymentMethodDiscount: {
        color: Colors.PAYMENT_DISCOUNT,
    },
    paymentAmount: {
        color: Colors.PAYMENT_DISCOUNT,
    },
    disabledMessage: {
        marginTop: -10,
        marginBottom: 20
    },
});


export default RadioForm;