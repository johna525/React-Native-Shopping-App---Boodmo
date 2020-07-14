import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform
} from 'react-native';
import Button from '../../../components/Button';
import FormTextInput from '../../../components/FormTextInput';
import FormPasswordInput from '../../../components/FormPasswordInput';
import FacebookLoginButton from '../../../components/FacebookLoginButton';
import FormAlert from '../../../components/FormAlert';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as messages from '../../../constants/Messages';
import * as validate from '../../../utils/Validator';

import {metricsAuthLoginClick, metricsAuthForgotPassClick, metricsAuthRecoverClick} from '../../../utils/metrics';

const styles = require('../styles');
const dismissKeyboard = require('dismissKeyboard');

class SignIn extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      focus: '',
      showForgotPassword: false,
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    this.refs.alert.hideAlert();
    if (nextProps.authError && nextProps.authError.length) {
      this.refs.alert.showAlert({
        message: nextProps.authError,
        type: 'danger'
      });
    }
    if (nextProps.sentRecoveryMessage) {
      this.refs.alert.showAlert({
        message: messages.sentRecoveryMessage,
        type: 'success'
      });
    }
  }

    handleChange = (event, type) => {
      let text = event.nativeEvent.text;
      this.validate(type, text);
      this.setState({
        [type]: text,
        focus: ''
      });
    };

    validate = (type, text) => {
      let errors = JSON.parse(JSON.stringify(this.state.errors));
      switch (type) {
      case 'email':
        if (!validate.email(text)) {
          errors.email = {
            value: true,
            message: messages.validation.email.invalid
          };
        } else {
          errors.email = null;
        }
        break;
      case 'password':
        if (text.length < 6) {
          errors.password = {
            value: true,
            message: messages.validation.password.tooShort
          };
        } else {
          errors.password = null;
        }
        break;
      }
      this.setState({errors});
    };

    handleSubmitEmail() {
      dismissKeyboard();
      let focus = '';
      if (this.state.errors.email && (this.state.errors.email.value === true)) {
        focus = 'email';
      } else {
        focus = 'password';
      }
      this.setState({focus});
    }

    handleSignIn() {
      dismissKeyboard();
      metricsAuthLoginClick('Form');
      let errors = JSON.parse(JSON.stringify(this.state.errors));

      if (!this.state.password) {
        errors.password = {
          value: true,
          message: messages.validation.password.required
        };
      }

      if (errors.password && (errors.password.value === true)) {
        this.setState({focus: 'password'});
      }

      if (!this.state.email) {
        errors.email = {
          value: true,
          message: messages.validation.email.required
        };
      }

      this.setState({errors});
      if (errors.email === null && errors.password === null) {
        this.props.onSignIn(this.state.email, this.state.password);
      }
    }

    handlePasswordRecover() {
      dismissKeyboard();
      metricsAuthRecoverClick();
      let errors = JSON.parse(JSON.stringify(this.state.errors));
      let emailErrorMessage = '';
      if (!this.state.email) {
        emailErrorMessage = messages.validation.email.required;
      } else if (!validate.email(this.state.email)) {
        emailErrorMessage = messages.validation.email.invalid;
      }
      if (emailErrorMessage.length > 0) {
        errors.email = {
          value: true,
          message: emailErrorMessage
        };
        this.setState({focus: 'email'});
      } else {
        errors.email = null;
      }
      this.setState({errors});

      if (!emailErrorMessage.length) {
        this.props.onRecoverPassword(this.state.email);
      }
    }

    clear() {
      dismissKeyboard();
      this.setState({
        focus: ''
      });
    }

    toggleForgotPassword() {
      metricsAuthForgotPassClick();
      this.setState({
        showForgotPassword: !this.state.showForgotPassword,
        errors: {},
        email: '',
        password: ''
      });
      this.refs.alert.clearAlert();
      this.props.clearErrors();
    }

    render() {
      return (
        <KeyboardAwareScrollView
          extraScrollHeight={Platform.OS === 'ios' ? 90 : 0}
          keyboardShouldPersistTaps="always">
          <TouchableWithoutFeedback
            onPress={this.clear.bind(this)}>
            <View
              style={styles.tabView}>
              <Text style={styles.tabLabel}>
                {this.state.showForgotPassword ? 'Recover Password' : 'LOGIN'}
              </Text>
              <View style={styles.containerDotOuter}>
                <View style={styles.containerDotInner}>
                  <View style={styles.inputWrapper}>
                    <FormAlert ref="alert"
                      style={{marginHorizontal: -20, paddingLeft: 10, paddingRight: 5}}/>
                    <FormTextInput
                      value={this.state.email}
                      placeholder="Email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      loading={false}
                      focus={'email' == this.state.focus}
                      error={(this.state.errors.email && this.state.errors.email.value) || false}
                      errorMessage={(this.state.errors.email && this.state.errors.email.message) || ''}
                      onSubmit={this.handleSubmitEmail.bind(this)}
                      onBlur={this.clear.bind(this)}
                      onChange={(e) => this.handleChange(e, 'email')}
                    />
                    {
                      !this.state.showForgotPassword ?
                        <FormPasswordInput
                          value={this.state.password}
                          placeholder="Password"
                          focus={'password' == this.state.focus}
                          error={(this.state.errors.password && this.state.errors.password.value) || false}
                          errorMessage={(this.state.errors.password && this.state.errors.password.message) || ''}
                          onBlur={this.clear.bind(this)}
                          onSubmit={this.handleSignIn.bind(this)}
                          onChange={(e) => this.handleChange(e, 'password')}
                        />
                        : null
                    }
                  </View>
                </View>
              </View>
              {
                !this.state.showForgotPassword ?
                  <Button
                    onPress={this.handleSignIn.bind(this)}
                    style={styles.buttonSubmit}
                    loading={this.props.isFetching}
                    loadingDisabled={this.props.isFetching}
                    textStyle={{color: '#fff'}}>
                                    Login
                  </Button>
                  :
                  <Button
                    onPress={this.handlePasswordRecover.bind(this)}
                    style={styles.buttonSubmit}
                    loading={this.props.isFetching}
                    loadingDisabled={this.props.isFetching}
                    textStyle={{color: '#fff'}}>
                                    Recover
                  </Button>
              }
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  disabled={this.props.isFetching}
                  onPress={this.toggleForgotPassword.bind(this)}>
                  <Text style={styles.textButton}>
                    {
                      !this.state.showForgotPassword ?
                        'Forgot password?'
                        :
                        'Sign In'
                    }
                  </Text>
                </TouchableOpacity>
              </View>
              <View onTouchStart={() => metricsAuthLoginClick('Facebook')} style={styles.buttonGroup}>
                <FacebookLoginButton
                  fbSignedIn={this.props.fbSignedIn}
                  signedIn={this.props.signedIn}
                  signInFacebook={
                    (userId, token) => {
                      this.props.signInFacebook(userId, token);
                    }
                  }
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
      );
    }
}

export default SignIn;
