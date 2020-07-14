import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  NetInfo,
  View,
  Platform,
  StatusBar,
  Dimensions,
  Linking,
  AppState,
  StyleSheet,
  Modal,
  PushNotificationIOS
} from 'react-native';
import VersionCheck from 'react-native-version-check';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import {FBLoginManager}  from 'react-native-facebook-login';
import FCM from 'react-native-fcm';
import codePush from 'react-native-code-push';

import AppNavigator from './AppNavigator';
import messages from '../constants/Messages';
import SweetAlert from '../components/SweetAlert';
import LoadingIndicator from '../components/LoadingIndicator';
import {SupportButton} from '../components/SupportButton';
import * as networkActions from '../actions/Network';
import * as sweetAlertActions from '../actions/SweetAlert';
import * as Log from '../actions/Log';
import * as deviceActions from '../actions/Device';
import * as cartActions from '../actions/Cart';
import * as userActions from '../actions/User';
import * as Colors from '../constants/Colors';
import {APP_ID, APP_NAME} from '../constants/Config';
import {checkVersion} from '../utils/checkVersion';

const Analytics = require('react-native-firebase-analytics');
const urlParse = require('url-parse');

class App extends Component {

  constructor() {
    super();
    this.state = {
      appState: AppState.currentState,
      needUpdate: false,
      navigationPath: null
    };
    this.message = null;
    this.header = 'New Version Available';
    this.storeUrl = null;
    this.hideAlert = this.hideAlert.bind(this);
  }

  componentWillMount() {
    Analytics.setEnabled(true);
    Log.logEvent('app_open', {'first_open': null});
    this.props.actions.setWidth(Dimensions.get('window').width);
    this.props.actions.setHeight(Dimensions.get('window').height);
    this.props.actions.setPlatformOS(Platform.OS);
    this.props.actions.setAppVersion(VersionCheck.getCurrentVersion());
    VersionCheck.setAppID(APP_ID);
    VersionCheck.setAppName(APP_NAME);
    codePush.sync().then(() => {
      codePush.getUpdateMetadata().then((update) => {
        if (update && update.label) {this.props.actions.setCodePushVer(update.label);}
      });
    });
    this.props.actions.setBuildNumber(VersionCheck.getCurrentVersion());
    if (this.props.platformOS === 'ios') {this.requestPermsIOS();}
  }

  componentDidMount() {
    Linking.getInitialURL().then((url) => {
      this.handleURL(url);
    }).catch(err => console.error('An error occurred', err));

    Linking.addEventListener('url', this._handleOpenURL);
    setTimeout(() => {
      NetInfo.isConnected.addEventListener(
        'change',
        this._handleConnectivityChange
      );
    }, 2000);

    VersionCheck.getStoreUrlAsync().then((url) => {
      this.storeUrl = url;
      this.checkUpdate();
    });
    this.props.actions.loadOfflineStore();
    if (this.props.platformOS === 'ios') {
      this.subscriber = RCTDeviceEventEmitter.addListener(
        FBLoginManager.Events['LoginFound'],
        (eventData) => {
          this.handleLogin(eventData);
        }
      );
      PushNotificationIOS.addEventListener('register', this._handleNotifRegister);
    } else if (this.props.platformOS === 'android') {
      this.requestPermissions();
      FCM.getFCMToken().then(token => {
        this.props.actions.setToken(token);
      });
    }
  }

    requestPermsIOS = () => {
      if (!this.props.notificationIOS) {PushNotificationIOS.requestPermissions();}
      this.props.actions.requestNotifPermIOS();
    };

    _handleOpenURL = ({url}) => {
      this.handleURL(url);
    };

    handleURL = (url) => {
      if (url) {
        const uri = urlParse(url, true);

        if (uri.protocol === 'boodmo:') {
          switch (uri.host) {
          case 'cart':
            this.setState({navigationPath: 'CartPage'});
            break;
          default:
            this.setState({navigationPath: null});
            Linking.openURL(url);
          }
        }

        if (uri.protocol === 'https:') {
          switch (uri.pathname) {
          case '/checkout/cart/':
            this.setState({navigationPath: 'CartPage'});
            break;
          default:
            this.setState({navigationPath: null});
            Linking.openURL(url);
          }
        }
      }
    };

    checkUpdate() {
      VersionCheck.needUpdate()
        .then(res => {
          let store = Platform.OS === 'ios' ? 'Apple' : 'Google Play';
          this.message = `There is a newer version available for download! Please update the app by visiting ${store} Store`;
          if (checkVersion(res)) {
            this.setState({
              needUpdate: true
            });
            this.props.actions.showAlert(
              this.header,
              this.message,
            );
          }
        });
    }

    handleLogin(e) {
      if (!this.props.fbSignedIn) {
        let userId = e.credentials.userId;
        let token = e.credentials.token;

        this.props.actions.signInFacebook(userId, token);
      }
    }

    componentWillUnmount() {
      Linking.removeEventListener('url', this._handleOpenURL);
      if (this.props.platformOS === 'ios') {
        PushNotificationIOS.removeEventListener('register', this._handleNotifRegister);
        if (this.subscriber) {this.subscriber.remove();}
      }
      NetInfo.isConnected.removeEventListener(
        'change',
        this._handleConnectivityChange
      );
    }

    requestPermissions() {
      FCM.requestPermissions({
        badge: true, sound: true, alert: true
      }).then(() => {}).catch(() => {});
    };

    _handleNotifRegister = (token) => {
      this.props.actions.setToken(token);
    };

    _handleConnectivityChange = (isConnected) => {
      if (isConnected) {
        this._networkOnline();
      } else {
        this._networkOffline();
      }
    };

    _networkOnline() {
      this.props.actions.online();
      this.props.actions.hideAlert();
    }

    _networkOffline() {
      this.props.actions.offline();
      this.props.actions.showAlert(
        'Error',
        messages.offline
      );
    }


    hideAlert() {
      if (this.state.needUpdate && this.storeUrl) {
        Linking.openURL(this.storeUrl);
        return;
      } else {
        this.props.actions.hideAlert();
      }
    }

    render() {
      return (
        <View style={{flexGrow: 1}}>
          { this.props.platformOS === 'android' ?
            <StatusBar
              backgroundColor={Colors.PRIMARY}
              barStyle="light-content"
            />
            : null
          }
          <AppNavigator
            navigationPath={this.state.navigationPath}
            navigationReset={() => this.setState({navigationPath: null})}
          />
          <SweetAlert
            header={this.state.needUpdate ? this.header : this.props.alertHeader}
            message={this.state.needUpdate ? this.message : this.props.alertMessage}
            alertState={this.props.alertState || this.state.needUpdate}
            hideAlert={this.hideAlert}
            buttonText={this.state.needUpdate ? 'Update' : 'OK'}
          />
          <Modal
            animationType={'fade'}
            transparent={true}
            visible={this.props.refreshTokenIsFetching}
            onRequestClose={() => {
            }}>
            <View style={styles.loadingModal}>
              <LoadingIndicator
                size="xx-large"/>
            </View>
          </Modal>
          <SupportButton fireFreshdeskModal={this.props.actions.fireFreshdeskModal} />
        </View>
      );
    }
}

const styles = StyleSheet.create({
  loadingModal: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
});

function mapStateToProps(state) {
  return {
    connected: state.network.connected,
    alertState: state.sweetalert.alertState,
    alertHeader: state.sweetalert.alertHeader,
    alertMessage: state.sweetalert.alertMessage,
    platformOS: state.device.platformOS,
    notificationIOS: state.device.notificationIOS,
    refreshTokenIsFetching: state.user.refreshTokenIsFetching,
    user_id: state.user.user_id,
    email: state.user.email
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...networkActions,
      ...sweetAlertActions,
      ...deviceActions,
      ...cartActions,
      ...userActions
    }, dispatch)
  };
}

let codePushOptions = {
  installMode: codePush.InstallMode.IMMEDIATE,
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME
};

export default codePush(codePushOptions)(connect(mapStateToProps, mapDispatchToProps)(App));
