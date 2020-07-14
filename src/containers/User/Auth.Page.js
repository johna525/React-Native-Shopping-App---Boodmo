import React from 'react';
import {
    View,
    Text,
    Image,
    Platform,
    TouchableNativeFeedback,
    TouchableOpacity,
    InteractionManager
} from 'react-native';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
var Touchable = Platform.OS == 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableOpacity;
import AndroidShadow from '../../components/AndroidShadow';
import LoadingIndicator from '../../components/LoadingIndicator';
import Icon from 'react-native-vector-icons/FontAwesome';

import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as userActions from '../../actions/User';
import * as Log from "../../actions/Log";
import * as Events from "../../constants/Events";

var styles = require('./styles');
import * as Colors from "../../constants/Colors";

import { metricsMenuIconClick } from '../../utils/metrics';

const dismissKeyboard = require('dismissKeyboard')
const TimerMixin = require('react-timer-mixin');

class AuthPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tab: null
        };
    }

    componentWillMount() {
        let tab = this.props.route.tab == 'signUp' ? 1 : 0;
        this.setState({
            tab: tab
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.tab == null) {
            this.setState({
                tab: nextProps.route.tab == 'signUp' ? 1 : 0
            });
        }
        var routes = this.props.navigator.getCurrentRoutes();
        let currentRoute = routes[routes.length - 1].id;
        if (nextProps.signedIn && currentRoute == 'AuthPage') {
            nextProps.navigator.resetTo({
                id: 'OrdersPage'
            });
        }
    }

    handleSignIn(email, password) {
        Log.logEvent(Events.EVENT_SIGN_IN);
        this.props.actions.OAuth(email, password);
    }

    handleRecoverPassword(email) {
        Log.logEvent(Events.EVENT_FORGOT_PASSWORD);
        this.props.actions.sendPasswordRecovery(email);
    }

    handleSignUp(email, password, passwordVerify) {
        Log.logEvent(Events.EVENT_REGISTER);
        this.props.actions.signUp(email, password, passwordVerify);
    }

    handleChangeTab(page) {
        dismissKeyboard();
        this.setState({
            tab: page.i
        });
        this.clearErrors();
    }

    clearErrors() {
        this.props.actions.clearErrors();
    }


    render() {
        return (
            <View style={{flexGrow: 1}}>
                {this.props.platformOS === 'ios' ? <View style={styles.iosStatusBar}/> : null}
                <View style={styles.container}>
                    <View style={styles.imageWrapper}>
                        <View style={styles.drawerMenuButtonWrapper}>
                            <Touchable
                                hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
                                onPress={() => {
                                    metricsMenuIconClick();
                                    this.props.openDrawer()}}>
                                <View style={styles.headerButton}>
                                    <Icon name="bars" size={20} color="#fff"/>
                                </View>
                            </Touchable>
                        </View>
                        <Image
                            style={{
                                width: 330 / 2,
                                height: 123 / 2,
                                marginVertical: 10
                            }}
                            source={require('./../../assets/logo.png')}
                        />
                        {
                            this.props.platformOS === 'android' ?
                                <View style={{marginBottom: -11}}>
                                    <AndroidShadow height={6}/>
                                </View>
                                : null
                        }
                    </View>
                    <ScrollableTabView
                        ref={(tabView) => { this.tabView = tabView; }}
                        renderTabBar={()=><DefaultTabBar style={{borderWidth: 0}}/>}
                        style={styles.wrapScrollTab}
                        tabBarUnderlineStyle={{backgroundColor: Colors.TAB_UNDERLINE}}
                        tabBarActiveTextColor="#FFFFFF"
                        tabBarBackgroundColor={Colors.PRIMARY}
                        tabBarInactiveTextColor={Colors.TAB_BUTTON_TEXT}
                        tabBarTextStyle={{fontWeight: 'bold'}}
                        initialPage={this.state.tab}
                        scrollWithoutAnimation={this.props.platformOS === 'ios'}
                        contentProps={{ keyboardShouldPersistTaps: 'always', keyboardDismissMode: 'on-drag' }}
                        onChangeTab={this.handleChangeTab.bind(this)}>
                        <SignIn
                            tabSize={1}
                            tabLabel='SIGN IN'
                            navigator={this.props.navigator}
                            authError={this.props.authError}
                            isFetching={this.props.isFetching}
                            clearErrors={this.clearErrors.bind(this)}
                            sentRecoveryMessage={this.props.sentRecoveryMessage}
                            onSignIn={this.handleSignIn.bind(this)}
                            fbSignedIn={this.props.fbSignedIn}
                            signedIn={this.props.signedIn}
                            signInFacebook={this.props.actions.signInFacebook}
                            onRecoverPassword={this.handleRecoverPassword.bind(this)}/>
                        <SignUp
                            tabSize={1}
                            tabLabel='SIGN UP'
                            navigator={this.props.navigator}
                            registerError={this.props.registerError}
                            isFetching={this.props.isFetching}
                            clearErrors={this.clearErrors.bind(this)}
                            fbSignedIn={this.props.fbSignedIn}
                            signedIn={this.props.signedIn}
                            signInFacebook={this.props.actions.signInFacebook}
                            registeredSuccessfully={this.props.registeredSuccessfully}
                            onSignUp={this.handleSignUp.bind(this)}/>
                    </ScrollableTabView>
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        connected: state.network.connected,
        platformOS: state.device.platformOS,
        signedIn: state.user.signedIn,
        signedOut: state.user.signedOut,
        isFetching: state.user.isFetching || state.user.recoveryIsFetching,
        userEmail: state.user.email,
        fbSignedIn: state.checkout.fbToken != null,
        authError: state.user.authError,
        registerError: state.user.registerError,
        sentRecoveryMessage: state.user.sentRecoveryMessage,
        registeredSuccessfully: state.user.registeredSuccessfully,
    }
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({...userActions}, dispatch)}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(AuthPage);
