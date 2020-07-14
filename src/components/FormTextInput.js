import React from 'react';
import {
  Text,
  View,
  TextInput
} from 'react-native';

import styles from './inputStyles';
import * as Colors from '../constants/Colors';
import LoadingIndicator from './LoadingIndicator';

class FormTextInput extends React.Component {

  constructor(props) {
    super(props);

    this.input = null;
  }

  handleSubmitEditing() {
    if (this.props.onBlur) {
      this.props.onBlur();
    }
    if (this.props.onSubmit) {
      this.props.onSubmit();
    }
    this.input.blur();
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
            autoCorrect={false}
            ref={(input) => this.input = input}
            name={this.props.name}
            underlineColorAndroid="transparent"
            style={[styles.formInput, this.props.multiline ? styles.formTextArea : null]}
            onChangeText={this.props.onChangeText}
            onChange={this.props.onChange}
            onEndEditing={this.props.onBlur}
            onSubmitEditing={this.handleSubmitEditing.bind(this)}
            value={this.props.value}
            maxLength={this.props.maxLength || null}
            numberOfLines={this.props.multiline ? 3 : 1}
            keyboardType={this.props.keyboardType || 'default'}
            autoCapitalize={this.props.autoCapitalize || null}
            placeholder={this.props.placeholder}
            placeholderTextColor={this.props.placeholderTextColor || Colors.PLACEHOLDER}
          />
          {
            this.props.loading ?
              <LoadingIndicator
                style={{marginRight: 10}}
                size="small"/>
              : null
          }
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


export default FormTextInput;
