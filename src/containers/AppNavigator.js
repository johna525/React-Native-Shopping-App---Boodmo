import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as userActions from '../actions/User';
import {updateProperties} from '../actions/Betaout';
import * as navigatorActions from '../actions/Navigator';
import {
  View,
  StatusBar,
  BackHandler,
} from 'react-native';
import {Navigator} from 'react-native-deprecated-custom-components';
import Drawer from 'react-native-drawer';
import SplashPage from './Splash/Splash.Page';
import SearchPage from './Search/Search.Page';
import ResultPage from './Results/Results.Page';
import FilterPage from './Filter/Filter.Page';
import WebBrowserPage from './WebBrowser/WebBrowser.Page';
import ProductPage from './Product/Product.Page';
import GalleryPage from './Gallery/Gallery.Page';
import CompatibilityPage from './Parts/Compatibility.Page';
import ReplacementsPage from './Parts/Replacements.Page';
import CartPage from './Cart/Cart.Page';
import CheckoutPage from './Checkout/Checkout.Page';
import SuccessOrderPage from './Checkout/SuccessOrder.Page';
import AuthPage from './User/Auth.Page';
import OrdersPage from './Orders/Orders.Page';
import OrderInfoPage from './Orders/OrderInfo.Page';
import OrderTrackingPage from './Orders/OrderTracking.Page';
import ControlPanel from './ControlPanel';
import * as _ from 'lodash';
import {metricsScreenHandler} from '../utils/metrics';


class AppNavigator extends Component {

  constructor(props) {
    super(props);
    this.currentRoute = null;
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.navigationPath) {
      this._navigator.push({id: nextProps.navigationPath});
      nextProps.navigationReset();
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress.bind(this));
  }

  handleBackPress() {
    if (this._navigator) {
      const routes = this._navigator.getCurrentRoutes();
      let currentRoute = routes[routes.length - 1].id;
      if (currentRoute !== 'default') {
        this._navigator.pop();
      }
      return true;
    }
  }

  goToPage(nextPage, props = {}) {
    if (this._navigator) {
      const routes = this._navigator.getCurrentRoutes();
      let currentRoute = routes[routes.length - 1].id;
      let previousRoute = null;
      if (routes.length >= 2) {
        previousRoute = routes[routes.length - 2].id;
      }
      let options = _.merge({id: nextPage}, props);
      if ((currentRoute === 'AuthPage' && nextPage === 'AuthPage') ||
                (currentRoute === 'WebBrowser' && nextPage === 'WebBrowser')) {
        this._navigator.replace(options);
      } else if (previousRoute === nextPage) {
        this._navigator.pop();
      } else if (currentRoute !== nextPage) {
        this._navigator.immediatelyResetRouteStack([options]);
      }
      this._drawer.close();
    }
  }

  resetToPage(page) {
    if (this._navigator) {
      this._navigator.immediatelyResetRouteStack([{
        id: page
      }]);
      this._drawer.close();
    }
  }

  onLogout() {
    const routes = this._navigator.getCurrentRoutes();
    let currentRoute = routes[routes.length - 1].id;
    if (_.includes(['OrdersPage', 'OrderInfoPage'], currentRoute)) {
      this.resetToPage('default');
    }
    this._drawer.close();
  }

  render() {
    let navigator = (this.props.platformOS === 'ios') ?
      <View style={{
        height: this.props.screenHeight,
      }}>
        <StatusBar
          barStyle="light-content"/>
        <Navigator
          ref={(ref) => this._navigator = ref}
          initialRoute={{id: this.props.navigationPath ? this.props.navigationPath : 'default'}}
          renderScene={(route, nav) => this.renderScene(route, nav, this.openDrawer.bind(this))}
          configureScene={(route) => {
            if (route && route.sceneConfig) {
              return route.sceneConfig;
            }
            return {
              ...Navigator.SceneConfigs.PushFromRight,
              gestures: {}
            };
          }}/>
      </View>
      :
      <Navigator
        ref={(ref) => this._navigator = ref}
        initialRoute={{id: 'SplashPage'}}
        renderScene={(route, nav) => this.renderScene(route, nav, this.openDrawer.bind(this))}
        configureScene={(route) => {
          if (route && route.sceneConfig) {
            return route.sceneConfig;
          }
          return {
            ...Navigator.SceneConfigs.PushFromRight,
            gestures: {}
          };
        }}/>;
    const drawerStyles = {
      drawer: {shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
      main: {paddingLeft: 3},
      mainOverlay: {opacity: 0, backgroundColor: '#000'}
    };
    const controlPanel = <ControlPanel onLogout={this.onLogout.bind(this)}
      goToPage={this.goToPage.bind(this)}
      resetToPage={this.resetToPage.bind(this)}/>;
    return (
      <Drawer
        ref={(ref) => this._drawer = ref}
        type="overlay"
        content={controlPanel}
        openDrawerOffset={0.2}
        closedDrawerOffset={-3}
        styles={drawerStyles}
        captureGestures={true}
        acceptPan={true}
        tapToClose={true}
        negotiatePan={true}
        panOpenMask={0.02}
        tweenHandler={(ratio) => ({mainOverlay: {opacity: (ratio) / 2}})}>
        {navigator}
      </Drawer>
    );
  };

  openDrawer() {
    this._drawer.open();
    metricsScreenHandler('Menu');
  }

  renderScene(route, nav, openDrawer) {
    metricsScreenHandler(route.id);
    if (route.id !== this.currentRoute) {
      setTimeout(() => {
        const {firstname, lastname, car_name, car_link, car_ori_link, car_is_finished} = this.props;

        if (this.props.access_token) {
          updateProperties({
            firstname: firstname || null,
            lastname: lastname || null,
            car_name: car_name || null,
            car_link: car_link || null,
            car_ori_link: car_ori_link || null,
            car_is_finished: car_is_finished && car_is_finished.toString() || null
          });
        }

        this.props.actions.setRoute(route.id);
      });
      this.currentRoute = route.id;
    }
    switch (route.id) {
    case 'SplashPage':
      return <SplashPage navigationPath={this.props.navigationPath} navigator={nav} route={route}/>;
    case 'WebBrowser':
      return <WebBrowserPage navigator={nav} route={route} openDrawer={() => openDrawer()}/>;
    case 'ResultPage':
      return <ResultPage navigator={nav} route={route} openDrawer={() => openDrawer()}/>;
    case 'FilterPage':
      return <FilterPage navigator={nav} route={route} openDrawer={() => openDrawer()}/>;
    case 'ProductPage':
      return <ProductPage navigator={nav} route={route} openDrawer={() => openDrawer()}/>;
    case 'GalleryPage':
      return <GalleryPage navigator={nav} route={route} openDrawer={() => openDrawer()}/>;
    case 'CompatibilityPage':
      return <CompatibilityPage navigator={nav} route={route} openDrawer={() => openDrawer()}/>;
    case 'ReplacementsPage':
      return <ReplacementsPage navigator={nav} route={route} openDrawer={() => openDrawer()}/>;
    case 'CartPage':
      return <CartPage navigator={nav} route={route} openDrawer={() => openDrawer()}/>;
    case 'CheckoutPage':
      return <CheckoutPage navigator={nav} route={route} openDrawer={() => openDrawer()}/>;
    case 'SuccessOrderPage':
      return <SuccessOrderPage navigator={nav} route={route} openDrawer={() => openDrawer()}/>;
    case 'AuthPage':
      return <AuthPage navigator={nav} route={route} openDrawer={() => openDrawer()}/>;
    case 'OrdersPage':
      return <OrdersPage navigator={nav} route={route} openDrawer={() => openDrawer()}/>;
    case 'OrderInfoPage':
      return <OrderInfoPage navigator={nav} route={route} openDrawer={() => openDrawer()}/>;
    case 'OrderTrackingPage':
      return <OrderTrackingPage navigator={nav} route={route} openDrawer={() => openDrawer()}/>;
    default:
      return (
        <SearchPage navigator={nav} route={route} openDrawer={() => openDrawer()}/>
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    screenHeight: state.device.screenHeight,
    platformOS: state.device.platformOS,
    access_token: state.user.access_token,
    customer_id: state.user.user_id,
    email: state.user.email,
    phone: state.user.phone,
    firstname: state.user.first_name,
    lastname: state.user.last_name,
    car_name: state.user.car_name,
    car_link: state.user.car_link,
    car_ori_link: state.user.ori_link,
    car_is_finished: state.user.is_finished ? parseInt(state.user.is_finished) : null
  };
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({...userActions, ...navigatorActions}, dispatch)};
}


export default connect(mapStateToProps, mapDispatchToProps)(AppNavigator);
