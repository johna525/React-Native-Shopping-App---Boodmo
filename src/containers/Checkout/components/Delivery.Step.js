import React from 'react';
import {
  Text,
  View
} from 'react-native';

import Button from '../../../components/Button';
import FormTextInput from '../../../components/FormTextInput';
import FormPhoneInput from '../../../components/FormPhoneInput';
import CheckoutSelect from '../../../components/CheckoutSelect';
import Alert from '../../../components/Alert';
import styles from './../styles';
import * as validate from '../../../utils/Validator';
import * as messages from '../../../constants/Messages';

const dismissKeyboard = require('dismissKeyboard');
const countries = require('./../constants/countries.json');
const states = require('./../constants/states.json');

class DeliveryStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    let errors = {};
    if (!this.props.loadedDeliveryInfo || nextProps.selectedStep !== nextProps.oldStep) {
      this.setState({
        phone: nextProps.deliveryInfo.phone || '',
        first_name: nextProps.deliveryInfo.first_name || '',
        last_name: nextProps.deliveryInfo.last_name || '',
        address: nextProps.deliveryInfo.address || '',
        country: nextProps.deliveryInfo.country,
        city: nextProps.deliveryInfo.city || '',
        state: nextProps.deliveryInfo.state || null,
        pin: nextProps.deliveryInfo.pin || '',
        errors
      });
    }
    errors.pin = nextProps.pinError ? {
      value: true,
      message: messages.validation.pin.unknown
    } : null;
    this.setState({errors});
    if (!nextProps.pinError && nextProps.pinFetched) {
      errors.city = null;
      errors.state = null;
      this.setState({
        city: nextProps.deliveryInfo.city,
        state: nextProps.deliveryInfo.state,
        errors
      });
    }
  }

    saveDeliveryInfo = () => {
      if (this.errorsValidator() && this.props.selectedStep === 1) {
        this.props.saveDeliveryInfo({
          pin: this.state.pin,
          phone: this.state.phone,
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          address: this.state.address,
          city: this.state.city,
          state: this.state.state,
          country: this.state.country
        });
      }
    };

    errorsValidator = () => {
      let errors = JSON.parse(JSON.stringify(this.state.errors));
      let errArray = Object.values(errors);
      let submitCondition = true;
      errArray.forEach((value) => {
        if (value !== null) {submitCondition = false;}
      });
      return (errArray.length === 0 || submitCondition);
    };

    handlePinChange(pin) {
      if (validate.number(pin) || pin == '') {
        this.setState({pin});
      }
    }

    validatePin() {
      let errors = JSON.parse(JSON.stringify(this.state.errors));
      if (this.state.pin.length < 6 || !validate.number(this.state.pin)) {
        errors.pin = {
          value: true,
          message: ((this.state.pin.length < 6) ? messages.validation.pin.tooShort : '') +
          (!validate.number(this.state.pin) ? messages.validation.pin.unknown : '')
        };
      } else {
        errors.pin = null;
        this.props.validatePin({
          pin: this.state.pin,
          phone: this.state.phone,
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          address: this.state.address,
          city: this.state.city,
          state: this.state.state,
          country: this.state.country
        });
      }
      this.setState({errors});
    }

    handleChange = (event, name) => {
      this.validator(name, event.nativeEvent.text);
      if (name === 'phone') {
        if (validate.number(event.nativeEvent.text) || event.nativeEvent.text == '') {this.setState({[name]: event.nativeEvent.text});}
      } else {
        this.setState({[name]: event.nativeEvent.text});
      }
    };

    handleSelectChange = (data, name) => {
      this.validator(data, name);
      this.setState({[name]: data});
    };

    validator = (name, value) => {
      let errors = JSON.parse(JSON.stringify(this.state.errors));
      switch (name) {
      case 'phone':
        if (value.length < 10) {
          errors.phone = {value: true, message: messages.validation.phone.required};
        } else {
          errors.phone = null;
        }
        break;
      case 'first_name':
        if (value.isEmpty() || !validate.name(value)) {
          errors.first_name = {
            value: true,
            message: (value.isEmpty() ? messages.validation.required : '') +
              (!validate.name(value) ? messages.validation.firstName.invalid : '')
          };
        } else {
          errors.first_name = null;
        }
        break;
      case 'last_name':
        if (value.isEmpty() || !validate.name(value)) {
          errors.last_name = {
            value: true,
            message: (value.isEmpty() ? messages.validation.required : '') +
              (!validate.name(value) ? messages.validation.lastName.invalid : '')
          };
        } else {
          errors.last_name = null;
        }
        break;
      default:
        if (Object.values(value).length === 0) {
          errors[name] = {
            value: true,
            message: messages.validation.required
          };
        } else {
          errors[name] = null;
        }
        break;
      }
      this.setState({errors});
    };

    getErrors(input) {
      if (this.props.deliveryErrors && this.props.deliveryErrors[input]) {
        return Object.values(this.props.deliveryErrors[input]).join('\n');
      }
      return null;
    }

    handleSubmit = () => {
      dismissKeyboard();
      let errors = JSON.parse(JSON.stringify(this.state.errors));
      if (this.props.pinError) {
        errors.pin = {
          value: true,
          message: messages.validation.pin.unknown
        };
      } else {
        errors.pin = null;
      }
      for (key in this.state) {
        if (key !== 'errors' && (this.state[key] === null || this.state[key] === '') && !errors[key]) {
          errors[key] = {
            value: true,
            message: messages.validation.required
          };
        }
      }
      this.setState({errors},
        () => {
          if (this.errorsValidator() && this.props.selectedStep === 1) {
            this.props.onSubmit({
              pin: this.state.pin,
              phone: this.state.phone,
              first_name: this.state.first_name,
              last_name: this.state.last_name,
              address: this.state.address,
              city: this.state.city,
              state: this.state.state,
              country: this.state.country
            });
          }
        }
      );
    };

    render() {
      return (
        <View style={styles.stepContainer} removeClippedSubviews={true}>
          <View style={styles.stepContent}>
            <View style={styles.alertContainer}>
              <Alert
                type="warning"
                icon="exclamation-circle">
                <View style={styles.alertWrapper}>
                  <Text style={styles.alertMessage}>
                    IMPORTANT:
                  </Text>
                  <Text style={[styles.alertMessage, styles.bold, styles.alertContent]}>
                    We deliver to India only!
                  </Text>
                </View>
              </Alert>
            </View>
            {
              this.props.isFetching ?
                <Text style={styles.loadingProfile}>
                  Loading delivery info...
                </Text>
                : null
            }
            <FormTextInput
              value={this.state.pin || ''}
              name="pin"
              placeholder="Pincode"
              keyboardType="numeric"
              loading={this.props.pinIsFetching}
              maxLength={6}
              error={(this.state.errors.pin && this.state.errors.pin.value) || this.getErrors('pin')}
              errorMessage={(this.state.errors.pin && this.state.errors.pin.message) || this.getErrors('pin')}
              onChange={(e) => this.handleChange(e, 'pin')}
              onBlur={this.validatePin.bind(this)}
            />
            <FormPhoneInput
              value={this.state.phone || ''}
              name="phone"
              placeholder="Phone"
              phoneCode="+91"
              error={(this.state.errors.phone && this.state.errors.phone.value) || this.getErrors('phone')}
              errorMessage={(this.state.errors.phone && this.state.errors.phone.message) || this.getErrors('phone')}
              onBlur={this.saveDeliveryInfo}
              onChange={(e) => this.handleChange(e, 'phone')}
            />
            <FormTextInput
              value={this.state.first_name || ''}
              name="first_name"
              placeholder="First Name"
              loading={false}
              error={(this.state.errors.first_name && this.state.errors.first_name.value) || this.getErrors('first_name')}
              errorMessage={(this.state.errors.first_name && this.state.errors.first_name.message) || this.getErrors('first_name')}
              onBlur={this.saveDeliveryInfo}
              onChange={(e) => this.handleChange(e, 'first_name')}
            />
            <FormTextInput
              value={this.state.last_name || ''}
              name="last_name"
              placeholder="Last Name"
              loading={false}
              error={(this.state.errors.last_name && this.state.errors.last_name.value) || this.getErrors('last_name')}
              errorMessage={(this.state.errors.last_name && this.state.errors.last_name.message) || this.getErrors('last_name')}
              onBlur={this.saveDeliveryInfo}
              onChange={(e) => this.handleChange(e, 'last_name')}
            />
            <FormTextInput
              value={this.state.address || ''}
              name="address"
              placeholder="Address"
              loading={false}
              error={(this.state.errors.address && this.state.errors.address.value) || this.getErrors('address')}
              errorMessage={(this.state.errors.address && this.state.errors.address.message) || this.getErrors('address')}
              onBlur={this.saveDeliveryInfo}
              onChange={(e) => this.handleChange(e, 'address')}
            />
            <FormTextInput
              value={this.state.city || ''}
              name="city"
              placeholder="City"
              loading={false}
              error={(this.state.errors.city && this.state.errors.city.value) || this.getErrors('city')}
              errorMessage={(this.state.errors.city && this.state.errors.city.message) || this.getErrors('city')}
              onBlur={this.saveDeliveryInfo}
              onChange={(e) => this.handleChange(e, 'city')}/>
            <CheckoutSelect
              placeholder={'Select State'}
              data={states}
              value={this.state.state || null}
              error={(this.state.errors.state && this.state.errors.state.value) || this.getErrors('state')}
              errorMessage={(this.state.errors.state && this.state.errors.state.message) || this.getErrors('state')}
              onSubmit={this.saveDeliveryInfo}
              onValueChange={(data) => this.handleSelectChange(data, 'state')}/>
            <CheckoutSelect
              placeholder={'Select Country'}
              data={countries}
              value={this.state.country || {name: 'India', value: 'INDIA'}}
              error={(this.state.errors.country && this.state.errors.country.value) || this.getErrors('country')}
              errorMessage={(this.state.errors.country && this.state.errors.country.message) || this.getErrors('country')}
              onSubmit={this.saveDeliveryInfo}
              disabled={true}
              onValueChange={(data) => this.handleSelectChange(data, 'country')}/>
            <Button
              disabled={false}
              loading={this.props.isFetching}
              loadingDisabled={this.props.pinIsFetching}
              onPress={this.handleSubmit}
              style={styles.buttonSubmit}
              textStyle={{color: '#fff'}}
            >
              SAVE AND CONTINUE
            </Button>
          </View>
        </View>
      );
    }
}

export default DeliveryStep;
