import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  View,
  WebView,
  Dimensions,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import LoadingIndicator from '../../components/LoadingIndicator';
import ActionBar from '../../components/ActionBar';
import * as partsActions from '../../actions/Parts';
import * as filterActions from '../../actions/Filter';
import * as Log from '../../actions/Log';
import * as Colors from '../../constants/Colors';
import * as Events from '../../constants/Events';
import {getParameterByName} from '../../utils/Validator';

const urlParse = require('url-parse');
const Touchable = Platform.OS === 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableOpacity;
const DISABLED_WASH = 'rgba(255,255,255,0.7)';
const WEBVIEW_REF = 'webview';
const HEADER_HEIGHT = 50;
const SCREEN_WIDTH = Dimensions.get('window').width;
const keywordResExp1 = new RegExp('^http[s]*:\/\/boodmo.com\/search\/([^\/]+)\/([^\/]+)');
const keywordResExp3 = new RegExp('^http[s]*:\/\/boodmo.com\/search\/([^\/]+)');
const keywordResExp2 = new RegExp('^http[s]*:\/\/boodmo.com\/partnumber\/([^\/]+)');
const continueShoppingUrl = 'https://boodmo.com/';

class WebBrowser extends Component {
  constructor(props) {
    super(props);
    const url = urlParse(this.props.route.url, true);

    if (url.host === 'oriparts.com') {
      url.set('query', {
        ...url.query,
        utm_source: `app_${Platform.OS}`,
        utm_medium: 'iframe',
      });
    }

    this.state = {
      url: url.href,
      type: this.props.route.type || 'uri',
      status: '',
      backButtonEnabled: false,
      forwardButtonEnabled: false,
      loading: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.openPartNumber) {
      this.hideSpinner();
    }
  }

  showSpinner = () => {
    this.setState({
      loading: true
    });
  };

  hideSpinner = () => {
    this.setState({
      loading: false
    });
  };

  render() {
    return (
      <View style={[styles.container]}>
        {this.props.platformOS === 'ios' ? <View style={styles.iosStatusBar}/> : null}
        <ActionBar
          title={this.state.status}
          onBackPress={() => {
            Log.logEvent(Events.EVENT_CART_BACK);
          }}
          openDrawer={() => this.props.openDrawer()}
          navigator={this.props.navigator}>
          <View style={styles.actionsContainer}>
            <Touchable
              onPress={() => {
                this.goBack();
              }}
              disabled={!this.state.backButtonEnabled}>
              <View style={this.state.backButtonEnabled ? styles.navButton : styles.disabledButton}>
                <Text>
                  <Icon name="chevron-left" size={14} color="#fff"/>
                </Text>
              </View>
            </Touchable>
            <Touchable
              onPress={() => {
                this.goForward();
              }}
              disabled={!this.state.forwardButtonEnabled}>
              <View style={this.state.forwardButtonEnabled ? styles.navButton : styles.disabledButton}>
                <Text>
                  <Icon name="chevron-right" size={14} color="#fff"/>
                </Text>
              </View>
            </Touchable>
          </View>
        </ActionBar>
        <View style={{flexGrow: 1}}>
          <WebView
            ref={WEBVIEW_REF}
            style={styles.webView}
            source={{[this.props.platformOS === 'ios' ? this.state.type : 'uri']: this.state.url}}
            onNavigationStateChange={(navState) => {
              this.onNavigationStateChange(navState);
            }}
            onLoadStart={this.showSpinner}
            onLoadEnd={this.hideSpinner}
            scalesPageToFit={true}
            injectedJavaScript={this.props.route.redirectEnable && this.props.platformOS === 'ios' ? `document.location.href = '${this.state.url}';` : null}
          />
          {this.state.loading ? <CustomSpinner/> : null}
        </View>
      </View>
    );
  }

  goBack() {
    this.refs[WEBVIEW_REF].goBack();
  }

  goForward() {
    this.refs[WEBVIEW_REF].goForward();
  }

  reload() {
    this.refs[WEBVIEW_REF].reload();
  }


  handlePartNumber(keyword, brand = null) {
    let result = {};

    try {
      brand.split('&').forEach(function (part) {
        const item = part.split('=');
        result[item[0]] = decodeURIComponent(item[1]);
      });
    } catch (e) {

    }

    const brand_id = result['?filter[brand]'] ? result['?filter[brand]'] : brand;

    if (this.props.openPartNumber) {
      this.hideSpinner();
      this.refs[WEBVIEW_REF].stopLoading();
      this.props.actions.openOriPartNumber(false);
      this.props.navigator.push({
        id: 'ResultPage',
        keyword: decodeURI(keyword).replace(/ /g, ''),
        selectedBrand: {name: '', value: brand_id},
        after_ori: true
      });
    }
  }

    onNavigationStateChange = (navState) => {
      const url = decodeURI(navState.url);
      let title = navState.title;
      if (!!title) {
        if (~title.toLowerCase().indexOf('not found')) {
          Log.logCrash('Page not found', url);
        }
      }
      if (keywordResExp1.test(url)) {
        this.handlePartNumber(keywordResExp1.exec(url)[1], keywordResExp1.exec(url)[2]);
      } else if (keywordResExp3.test(url)) {
        this.handlePartNumber(keywordResExp3.exec(url)[1]);
      } else if (keywordResExp2.test(url)) {
        let brand = getParameterByName('filter[brand]', url) || null;
        this.handlePartNumber(keywordResExp2.exec(url)[1], brand);
      } else if (continueShoppingUrl == url) {
        if (this.props.navigator) {
          this.props.navigator.pop();
        }
        Log.logEvent(Events.EVENT_CART_BACK);
      } else {
        this.setState({
          backButtonEnabled: navState.canGoBack,
          forwardButtonEnabled: navState.canGoForward,
          status: title === '404 Not Found' ? '' : title,
          loading: navState.loading,
          scalesPageToFit: true,
        });
      }
    }
}

class CustomSpinner extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}>
        <LoadingIndicator
          animating={true}
          style={{
            transform: [{
              scale: 2,
            }]
          }}
          size="large"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.PRIMARY,
  },
  webView: {
    backgroundColor: '#fff',
  },
  actionsContainer: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  navButton: {
    height: HEADER_HEIGHT,
    width: HEADER_HEIGHT - 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'transparent',
  },
  disabledButton: {
    height: HEADER_HEIGHT,
    width: HEADER_HEIGHT - 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DISABLED_WASH,
    borderColor: 'transparent',
  },
  iosStatusBar: {
    backgroundColor: Colors.PRIMARY,
    height: 20,
    width: SCREEN_WIDTH,
    zIndex: 1
  },
});

function mapStateToProps(state) {
  return {
    openPartNumber: state.parts.openPartNumber,
    platformOS: state.device.platformOS,
  };
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({...partsActions, ...filterActions}, dispatch)};
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(WebBrowser);
