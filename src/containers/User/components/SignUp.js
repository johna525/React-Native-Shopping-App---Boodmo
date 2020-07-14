import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    ScrollView,
    Platform
} from 'react-native';
import Button from '../../../components/Button';
import FormTextInput from '../../../components/FormTextInput';
import FormPasswordInput from '../../../components/FormPasswordInput';
import FacebookLoginButton from '../../../components/FacebookLoginButton';
import FormAlert from '../../../components/FormAlert';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as messages from "../../../constants/Messages";
import * as validate from "../../../utils/Validator";

import { metricsAuthRegistrationClick } from '../../../utils/metrics';

var styles = require('../styles');
const dismissKeyboard = require('dismissKeyboard')

class SignUp extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            emailError: false,
            emailErrorMessage: '',
            password: '',
            passwordError: false,
            passwordErrorMessage: '',
            repeatPassword: '',
            repeatPasswordError: false,
            repeatPasswordErrorMessage: '',
            focus: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        this.refs.alert.hideAlert();
        if (nextProps.registerError.length) {
            this.refs.alert.showAlert({
                message: nextProps.registerError,
                type: 'danger'
            });
        }

        if (nextProps.registeredSuccessfully) {
            this.refs.alert.showAlert({
                message: messages.registeredSuccessfully,
                type: 'success'
            });
        }
    }


    handleEmailChange(email) {
        this.setState({
            email,
            focus: ''
        });
    }

    handlePasswordChange(password) {
        this.setState({
            password,
            focus: ''
        });
    }

    handleRepeatPasswordChange(repeatPassword) {
        this.setState({
            repeatPassword,
            focus: ''
        });
    }

    handleSubmitEmail() {
        dismissKeyboard();
        let emailErrorMessage = '';
        if (!this.state.email.length) {
            emailErrorMessage = messages.validation.email.required;
        } else if (!validate.email(this.state.email)) {
            emailErrorMessage = messages.validation.email.invalid;
        }
        if (emailErrorMessage.length > 0) {
            this.setState({
                emailError: true,
                emailErrorMessage: emailErrorMessage,
                focus: 'email'
            });
        } else {
            this.setState({
                emailError: false,
                emailErrorMessage: '',
                focus: 'password'
            });
        }
    }

    handleSubmitPassword() {
        dismissKeyboard();
        let passwordErrorMessage = '';
        if (!this.state.password.length) {
            passwordErrorMessage = messages.validation.password.required;
        } else if (this.state.password.length < 6) {
            passwordErrorMessage = messages.validation.password.tooShort;
        }
        if (passwordErrorMessage.length > 0) {
            this.setState({
                passwordError: true,
                passwordErrorMessage: passwordErrorMessage,
                focus: 'password'
            });
        } else {
            this.setState({
                passwordError: false,
                passwordErrorMessage: '',
                focus: 'repeatPassword'
            });
        }
    }

    handleSignUp() {
        dismissKeyboard();
        metricsAuthRegistrationClick('Form');
        let passwordErrorMessage = '';
        if (!this.state.password.length) {
            passwordErrorMessage = messages.validation.password.required;
        } else if (this.state.password.length < 6) {
            passwordErrorMessage = messages.validation.password.tooShort;
        }
        if (passwordErrorMessage.length > 0) {
            this.setState({
                passwordError: true,
                passwordErrorMessage: passwordErrorMessage,
                focus: 'password'
            });
        } else {
            this.setState({
                passwordError: false,
                passwordErrorMessage: '',
            });
        }
        let repeatPasswordErrorMessage = '';
        if (!this.state.repeatPassword.length) {
            repeatPasswordErrorMessage = messages.validation.password.required;
        } else if (this.state.repeatPassword.length < 6) {
            repeatPasswordErrorMessage = messages.validation.password.tooShort;
        } else if (this.state.repeatPassword != this.state.password) {
            repeatPasswordErrorMessage = messages.validation.password.doesNotMatch;
        }
        if (repeatPasswordErrorMessage.length > 0) {
            this.setState({
                repeatPasswordError: true,
                repeatPasswordErrorMessage: repeatPasswordErrorMessage,
                focus: 'repeatPassword'
            });
        } else {
            this.setState({
                repeatPasswordError: false,
                repeatPasswordErrorMessage: '',
            });
        }
        let emailErrorMessage = '';
        if (!this.state.email.length) {
            emailErrorMessage = messages.validation.email.required;
        } else if (!validate.email(this.state.email)) {
            emailErrorMessage = messages.validation.email.invalid;
        }
        if (emailErrorMessage.length > 0) {
            this.setState({
                emailError: true,
                emailErrorMessage: emailErrorMessage,
                focus: 'email'
            });
        } else {
            this.setState({
                emailError: false,
                emailErrorMessage: '',
            });
        }

        if (!emailErrorMessage.length && !passwordErrorMessage.length && !repeatPasswordErrorMessage.length) {
            this.props.onSignUp(this.state.email.toLowerCase(), this.state.password, this.state.repeatPassword);
        }
    }

    clear() {
        dismissKeyboard();
        this.setState({
            focus: ''
        });
    }

    render() {
        return (
            <KeyboardAwareScrollView
                extraScrollHeight={Platform.OS == 'ios' ? 90 : 0}
                keyboardShouldPersistTaps="always">
                <TouchableWithoutFeedback
                    onPress={this.clear.bind(this)}>
                    <View
                        style={styles.tabView}>
                        <Text style={styles.tabLabel}>
                            REGISTRATION
                        </Text>
                        <View style={styles.containerDotOuter}>
                            <View style={styles.containerDotInner}>
                                <View style={styles.inputWrapper}>
                                    <FormAlert ref="alert"
                                               style={{ marginHorizontal: -20, paddingLeft: 10, paddingRight: 5 }}/>
                                    <FormTextInput
                                        value={this.state.email}
                                        placeholder="Email"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        loading={false}
                                        focus={'email' == this.state.focus}
                                        error={this.state.emailError}
                                        errorMessage={this.state.emailErrorMessage}
                                        onSubmit={this.handleSubmitEmail.bind(this)}
                                        onBlur={this.clear.bind(this)}
                                        onChangeText={this.handleEmailChange.bind(this)}/>
                                    <FormPasswordInput
                                        value={this.state.password}
                                        placeholder="Password"
                                        focus={'password' == this.state.focus}
                                        error={this.state.passwordError}
                                        errorMessage={this.state.passwordErrorMessage}
                                        onSubmit={this.handleSubmitPassword.bind(this)}
                                        onBlur={this.clear.bind(this)}
                                        onChangeText={this.handlePasswordChange.bind(this)}/>
                                    <FormPasswordInput
                                        value={this.state.repeatPassword}
                                        placeholder="Repeat Password"
                                        focus={'repeatPassword' == this.state.focus}
                                        error={this.state.repeatPasswordError}
                                        errorMessage={this.state.repeatPasswordErrorMessage}
                                        onSubmit={this.handleSignUp.bind(this)}
                                        onBlur={this.clear.bind(this)}
                                        onChangeText={this.handleRepeatPasswordChange.bind(this)}/>
                                </View>
                            </View>
                        </View>
                        <Button
                            onPress={this.handleSignUp.bind(this)}
                            style={styles.buttonSubmit}
                            loading={this.props.isFetching}
                            loadingDisabled={this.props.isFetching}
                            textStyle={{color: '#fff'}}>
                            Registration
                        </Button>

                        <View onTouchStart={() => metricsAuthRegistrationClick('Facebook')} style={styles.buttonGroup}>
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

export default SignUp;
