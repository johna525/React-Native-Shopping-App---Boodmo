import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Button from '../../../components/Button';
import FacebookLoginButton from '../../../components/FacebookLoginButton';
import FormTextInput from '../../../components/FormTextInput';
import FormPasswordInput from '../../../components/FormPasswordInput';
import FormAlert from '../../../components/FormAlert';
import styles from '../styles';
import * as validate from '../../../utils/Validator';
import * as messages from '../../../constants/Messages';
const dismissKeyboard = require('dismissKeyboard');

class EmailStep extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: this.props.userEmail || '',
      emailError: false,
      emailErrorMessage: '',
      password: '',
      passwordError: false,
      passwordErrorMessage: '',
    };

    this.clearPassword = this.clearPassword.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.refs.alert.hideAlert();
    if (nextProps.signedIn || nextProps.signedOut) {
      this.clearPassword();
    }
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

  clearPassword() {
    this.setState({
      password: ''
    });
  }


  handleEmailChange(email) {
    this.setState({
      email
    });
  }

  handlePasswordChange(password) {
    this.setState({
      password
    });
  }

  handleSubmit() {
    dismissKeyboard();
    let emailErrorMessage = '';
    if (this.state.email.length === 0) {
      emailErrorMessage = messages.validation.email.required;
    } else if (!validate.email(this.state.email)) {
      emailErrorMessage = messages.validation.email.invalid;
    }
    if (emailErrorMessage.length > 0) {
      this.setState({
        emailError: true,
        emailErrorMessage: emailErrorMessage
      });
    } else {
      this.setState({
        emailError: false,
        emailErrorMessage: ''
      });
      this.props.onSubmit(this.state.email);
    }
  }

  handleSignIn() {
    dismissKeyboard();
    let passwordErrorMessage = '';
    if (this.state.password.length === 0) {
      passwordErrorMessage = messages.validation.password.required;
    } else if (this.state.password.length < 6) {
      passwordErrorMessage = messages.validation.password.tooShort;
    }
    if (passwordErrorMessage.length > 0) {
      this.setState({
        passwordError: true,
        passwordErrorMessage: passwordErrorMessage
      });
    } else {
      this.props.onSubmit(this.state.email, this.state.password);
      this.setState({
        passwordError: false,
        passwordErrorMessage: ''
      });
    }
  }

  handlePasswordRecovery() {
    this.props.onForgotPassword(this.state.email);
    this.props.clearErrors();
    this.clearPassword();
  }

  render() {
    return (
      <View style={styles.stepContainer}>
        <View style={styles.stepContent}>
          <FormAlert ref="alert"
            style={{marginHorizontal: -10, paddingLeft: 5}}/>
          {
            this.props.emailExists === 'empty' || this.props.emailExists === false ?
              <View>
                <FormTextInput
                  label="Email Address"
                  value={this.state.email}
                  placeholder="Enter your email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={this.state.emailError}
                  errorMessage={this.state.emailErrorMessage}
                  onSubmit={this.handleSubmit.bind(this)}
                  onChangeText={this.handleEmailChange.bind(this)}/>
                <Button
                  disabled={false}
                  loading={this.props.isFetching}
                  loadingDisabled={this.props.isFetching || this.props.recoveryIsFetching}
                  onPress={this.handleSubmit.bind(this)}
                  style={styles.buttonSubmit}
                  textStyle={styles.buttonSubmitText}>
                                    CONTINUE
                </Button>
              </View>
              :
              <View>
                {
                  this.props.emailExists === true ?
                    <View>
                      <View style={styles.changeEmailWrapper}>
                        <Text style={styles.changeEmailText}>{this.state.email}</Text>
                        <TouchableOpacity
                          disabled={this.props.isFetching || this.props.recoveryIsFetching}
                          onPress={() => {
                            this.props.onChangeEmail();
                            this.clearPassword();
                          }}>
                          <Text style={styles.changeEmailButton}>Change email</Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.changeEmailDescription}>
                                                The above email is registered with us. Please enter the password below and sign in to continue
                      </Text>
                      <FormPasswordInput
                        value={this.state.password}
                        placeholder="Password"
                        error={this.state.passwordError}
                        errorMessage={this.state.passwordErrorMessage}
                        onSubmit={this.handleSignIn.bind(this)}
                        onChangeText={this.handlePasswordChange.bind(this)}/>
                      <Button
                        disabled={false}
                        loading={this.props.isFetching}
                        loadingDisabled={this.props.isFetching || this.props.recoveryIsFetching}
                        onPress={this.handleSignIn.bind(this)}
                        style={[styles.buttonSubmit, styles.signInButton]}
                        textStyle={styles.buttonSubmitText}>
                                                SIGN IN
                      </Button>
                      <Button
                        disabled={false}
                        loading={this.props.recoveryIsFetching}
                        loadingDisabled={this.props.isFetching || this.props.recoveryIsFetching}
                        onPress={this.handlePasswordRecovery.bind(this)}
                        style={styles.buttonSubmit}
                        textStyle={styles.buttonSubmitText}>
                                                PASSWORD RECOVERY
                      </Button>
                    </View>
                    : null
                }
              </View>
          }
          <View style={styles.descriptionBlock}>
            <Text style={styles.descriptionTitle}>
                            Sign in with your social account.
            </Text>
            <Text style={styles.descriptionContent}>
                            We promise that we don't post anything on you behalf.
            </Text>
          </View>
          <View style={styles.buttonGroup}>
            <FacebookLoginButton
              fbSignedIn={this.props.fbSignedIn}
              signedIn={this.props.signedIn}
              signInFacebook={
                (userId, token) => {
                  this.props.signInFacebook(userId, token);
                  this.clearPassword();
                }
              }
            />
          </View>
        </View>
      </View>

    );
  }
}

export default EmailStep;
