import React from 'react';
import {
    Text,
    View,
    TextInput
} from 'react-native';

import styles from './inputStyles';
import * as Colors from "../constants/Colors";

class FormPasswordInput extends React.Component {

    handleSubmitEditing() {
        if (this.props.onBlur) {
            this.props.onBlur();
        }
        if (this.props.onSubmit) {
            this.props.onSubmit();
        }
        this.refs[this.props.placeholder].blur();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.focus) {
            setTimeout(() => this.refs[this.props.placeholder].focus(), 50)
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
                        this.props.error ? styles.formInputError : null
                        ]}>
                    <TextInput
                        ref={this.props.placeholder}
                        underlineColorAndroid="transparent"
                        style={styles.formInput}
                        onChangeText={this.props.onChangeText}
                        onChange={this.props.onChange}
                        onEndEditing={this.props.onBlur}
                        onSubmitEditing={this.handleSubmitEditing.bind(this)}
                        value={this.props.value}
                        maxLength={this.props.maxLength || null}
                        secureTextEntry={true}
                        numberOfLines={1}
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


export default FormPasswordInput;
