import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableNativeFeedback,
    View,
    Platform,
    Image,
    Dimensions,
} from 'react-native';
var Touchable = Platform.OS == 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableHighlight;
import Icon from 'react-native-vector-icons/FontAwesome';
import FacebookLoginButton from '../components/FacebookLoginButton';
import * as Colors from '../constants/Colors';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as userActions from '../actions/User';
import * as Log from '../actions/Log';
import * as Events from '../constants/Events';
import LoadingIndicator from '../components/LoadingIndicator';
const SCREEN_WIDTH = Dimensions.get('window').width;

import { metricsCartIconClick } from '../utils/metrics';

import SupportButton from '../components/Freshdesk/SupportButton';

class ControlPanel extends React.Component {

    logout() {
        this.props.actions.logout();
        this.props.onLogout();
    }

    render() {
      const { buildNumber, codePushVersion } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.imageWrapper}>
                    <Image
                        style={{
                            width: 330 / 2,
                            height: 123 / 2,
                            marginVertical: 10
                        }}
                        source={require('./../assets/logo.png')}
                    />
                    {
                        this.props.fbSignedIn || this.props.signedIn ?
                            <Text
                                style={styles.userName}>{this.props.email}</Text>
                            : null
                    }
                    {
                        this.props.isFetching ?
                            <LoadingIndicator
                                style={{marginTop: 10}}
                                white
                                size="large"/>
                            : null
                    }
                </View>
                <ScrollView style={styles.menuContainer} bounces={false}>
                    <Link
                        icon="search"
                        label="Search"
                        onClick={() => this.props.goToPage('default')}
                    />
                    {
                        this.props.signedIn ?
                            <View>
                                <Link
                                    icon="history"
                                    label="My orders"
                                    onClick={() => {
                                        this.props.goToPage('OrdersPage');
                                        Log.logEvent(Events.EVENT_MY_ORDERS);
                                    }}
                                />
                            </View>
                            :
                            <LinkAuth
                                onSignUp={() => {
                                    this.props.goToPage('AuthPage', {tab: 'signUp'});
                                }}
                                onLogIn={() => {
                                    this.props.goToPage('AuthPage', {tab: 'logIn'});
                                }}
                            />
                    }
                    <View
                        style={[styles.facebookButtonWrapper, this.props.signedIn || this.props.isFetching ? styles.hidden : null]}>
                        <FacebookLoginButton
                            fbSignedIn={this.props.fbSignedIn}
                            signedIn={this.props.signedIn}
                            signInFacebook={
                                (userId, token) => {
                                    this.props.actions.signInFacebook(userId, token);
                                }
                            }/>
                    </View>
                    <Link
                        icon="shopping-cart"
                        label="Cart"
                        badge={this.props.total}
                        onClick={() => {
                          metricsCartIconClick();
                          this.props.goToPage('CartPage')
                        }}
                    />
                    {
                        this.props.signedIn ?
                            <Link
                                icon="sign-out"
                                label="Logout"
                                onClick={this.logout.bind(this)}
                            />
                            :
                            null
                    }
                    <SupportButton
                      getTicketTypes={this.props.actions.getTicketTypes}
                      sendFeedback={this.props.actions.sendFreshdeskFeedback}
                      recover={this.props.actions.recoverFeedbackSendActions}
                      sendLoading={this.props.freshdeskFeedbackLoading}
                      sendLoaded={this.props.freshdeskFeedbackLoaded}
                      ticketTypes={this.props.freshdeskTicketTypes}
                      freshdeskErr={this.props.freshdeskErr}
                      userEmail={this.props.userEmail}
                      connected={this.props.connected}
                      freshdeskModalVisible={this.props.freshdeskModalVisible}
                      fireFreshdeskModal={this.props.actions.fireFreshdeskModal}
                    />
                </ScrollView>
                <View style={styles.verInfoContainer}>
                  <Text>build {buildNumber}{codePushVersion ? `, (${codePushVersion})` : null}</Text>
                </View>
            </View>
        );
    }
}

class Link extends React.Component {

    render() {
        return (
            <Touchable onPress={this.props.onClick} underlayColor={Colors.DRAWER_LINK_BACKGROUND}>
                <View style={styles.link}>
                    <View style={styles.linkInner}>
                        <Icon style={styles.linkIcon} name={this.props.icon} size={22}
                              color={Colors.DRAWER_LINK_COLOR}/>
                        <Text style={styles.linkLabel}>{this.props.label}</Text>
                    </View>
                    {
                        this.props.badge ?
                            <View style={styles.badgeBubble}>
                                <Text style={styles.badgeText}>{this.props.badge}</Text>
                            </View>
                            : null
                    }
                </View>
            </Touchable>
        );
    }
}

class LinkAuth extends React.Component {

    render() {
        return (
            <View style={styles.authButtonWrapper}>
                <Touchable onPress={this.props.onSignUp} style={styles.linkAuth}
                           underlayColor={Colors.DRAWER_LINK_BACKGROUND}>
                    <View style={styles.link}>
                        <View style={styles.linkInner}>
                            <Icon style={styles.linkIcon} name="user-plus" size={22}
                                  color={Colors.DRAWER_LINK_COLOR}/>
                            <Text style={styles.linkLabel}>Sign up</Text>
                        </View>
                    </View>
                </Touchable>
                <View style={styles.separator}></View>
                <Touchable onPress={this.props.onLogIn} style={styles.linkAuth}
                           underlayColor={Colors.DRAWER_LINK_BACKGROUND}>
                    <View style={styles.link}>
                        <View style={styles.linkInner}>
                            <Icon style={styles.linkIcon} name="sign-in" size={22}
                                  color={Colors.DRAWER_LINK_COLOR}/>
                            <Text style={styles.linkLabel}>Log in</Text>
                        </View>
                    </View>
                </Touchable>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    imageWrapper: {
        alignItems: 'center',
        backgroundColor: Colors.PRIMARY,
        width: SCREEN_WIDTH * 0.8,
        paddingVertical: 20
    },
    container: {
        flex: 1
    },
    menuContainer: {
        backgroundColor: '#fff',
        paddingVertical: 10
    },
    verInfoContainer: {
      width: '100%',
      backgroundColor: '#fff',
      alignItems: 'center',
      paddingBottom: 5
    },
    link: {
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    linkInner: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    linkIcon: {
        width: 50
    },
    linkLabel: {
        color: Colors.DRAWER_LINK_COLOR
    },
    badgeBubble: {
        backgroundColor: Colors.CART_NOT_EMPTY,
        borderRadius: 3,
        paddingHorizontal: 5,
        paddingVertical: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500'
    },
    notEmptyCart: {
        backgroundColor: Colors.CART_NOT_EMPTY
    },
    userName: {
        color: '#fff',
        marginTop: 10,
        marginBottom: -10
    },
    authButtonWrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flex: 1,
        flexGrow: 1
    },
    linkAuth: {
        flex: 1,
    },
    separator: {
        width: 1,
        height: 40,
        backgroundColor: Colors.BORDER_DOT
    },
    facebookButtonWrapper: {
        paddingVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hidden: {
        width: 0,
        height: 0,
        overflow: 'hidden',
        paddingVertical: 0
    },
    currencyWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: 40,
        paddingHorizontal: 20,
    },
    label: {
        marginBottom: 2
    }
});

function mapStateToProps(state) {
    return {
        total: state.cart.total,
        signedIn: state.user.signedIn,
        email: state.user.email,
        fbSignedIn: state.checkout.fbToken != null,
        isFetching: state.user.isFetching,
        freshdeskFeedbackLoading: state.user.freshdeskFeedbackLoading,
        freshdeskFeedbackLoaded: state.user.freshdeskFeedbackLoaded,
        freshdeskTicketTypes: state.user.freshdeskTicketTypes,
        freshdeskErr: state.user.freshdeskErr,
        userEmail: state.user.email,
        connected: state.network.connected,
        currentCurrency: state.user.currentCurrency,
        buildNumber: state.device.buildNumber,
        codePushVersion: state.device.codePushVersion,
        freshdeskModalVisible: state.user.freshdeskModalVisible
    };
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({...userActions}, dispatch)};
}


export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
