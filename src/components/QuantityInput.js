import React from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    Text
} from 'react-native';
import QuantitySelect from './QuantitySelect';
import * as Colors from "../constants/Colors";


class QuantityInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            quantity: '1',
        }
        this.submitQuantity = this.submitQuantity.bind(this);
        this.changeQuantity = this.changeQuantity.bind(this);
    }

    componentWillMount() {
        this.setState({
            quantity: this.props.value.toString()
        });
    }

    componentWillReceiveProps(nextPros) {
        this.setState({
            quantity: nextPros.value.toString()
        });
    }

    changeQuantity(value) {
        this.setState({
            quantity: value
        });
    }

    submitQuantity(value, focus = false) {
        if (parseInt(value) == 10 && focus) {
            setTimeout(() => this.textInput.focus(), 10);
        }
        this.props.onSubmit(parseInt(value));
    }

    render() {

        return (
            <View style={styles.quantityWrapper}>
                <Text style={styles.textQty}>Qty:</Text>
                {
                    this.props.value < 10 ?
                        <QuantitySelect
                            value={this.state.quantity}
                            onSubmit={(value) => this.submitQuantity(value, true)}/>
                        : null
                }
                <View style={[styles.textInputWrapper, this.props.value < 10 ? styles.displayNone : null]}>
                    <TextInput
                        ref={(textInput) => this.textInput = textInput}
                        underlineColorAndroid="transparent"
                        style={styles.textInput}
                        keyboardType="numeric"
                        onChangeText={(value) => this.changeQuantity(value)}
                        onEndEditing={() => this.submitQuantity(this.state.quantity)}
                        blurOnSubmit={true}
                        value={this.state.quantity}
                        numberOfLines={1}
                        maxLength={2}
                    />
                </View>

            </View >
        );
    }
}
;

const styles = StyleSheet.create({
    quantityWrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    textInput: {
        fontSize: 15,
        height: 30,
        padding: 0,
        paddingHorizontal: 5,
        width: 75,
        textAlign: 'left',
    },
    textInputWrapper: {
        borderColor: Colors.PRIMARY_LIGHT,
        borderWidth: 1,
        borderRadius: 3,
        width: 80,
        marginLeft: 10
    },
    textQty: {
        color: '#000',
    },
    displayNone: {
        height: 0,
        opacity: 0
    }
});

export default QuantityInput;
