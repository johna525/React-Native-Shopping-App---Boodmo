import React from 'react';
import {
    Text,
    View,
    TextInput
} from 'react-native';

import styles from './inputStyles';
import * as Colors from "../constants/Colors";

class FormPhoneInput extends React.Component {

    constructor(props) {
        super(props);

        this.input = null;
    }

    handleSubmitEditing() {
        if (this.props.onBlur) {
            this.props.onBlur();
        }
        this.input.blur();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.focus || this.props.error != nextProps.error) {
            setTimeout(() => this.input.focus(), 50);
        }
    }

    render() {
        return (
            <View style={styles.formGroup}>
                {
                    this.props.label ?
                        <Text style={styles.formLabel}>{this.props.label}</Text>
                        : null
                }
                <View style={[
                        styles.formInputWrapper,
                        styles.formPhoneInputWrapper,
                        this.props.error ? styles.formInputError : null
                        ]}>
                    <Text style={styles.phoneCode}>
                        {this.props.phoneCode}
                    </Text>
                    <View style={styles.divider}></View>
                    <TextInput
                        ref={(input) => this.input = input}
                        name={this.props.name}
                        underlineColorAndroid="transparent"
                        style={[styles.formInput, styles.formPhone]}
                        onChangeText={this.props.onChangeText}
                        onChange={this.props.onChange}
                        onEndEditing={this.props.onBlur}
                        onSubmitEditing={this.handleSubmitEditing.bind(this)}
                        value={this.props.value}
                        maxLength={10}
                        numberOfLines={1}
                        keyboardType="phone-pad"
                        placeholder={this.props.placeholder}
                        placeholderTextColor={Colors.PLACEHOLDER}
                    />
                </View>
                {
                    this.props.error ?
                        <Text style={styles.formGroupError}>{this.props.errorMessage}</Text>
                        : null
                }
            </View>
        );
    }
}


export default FormPhoneInput;
