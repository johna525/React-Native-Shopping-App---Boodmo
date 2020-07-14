import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import ActionBar from 'boodmo/src/components/ActionBar';
import ButtonSecondary from '../../components/ButtonSecondary';
import Products from './components/Products';
import styles from './styles';
import * as Log from '../../actions/Log';
import * as Events from '../../constants/Events';
import * as _ from 'lodash';
import {changeCurrentCurrency} from '../../actions/User';
import {openOriPartNumber} from '../../actions/Parts';

require('../../utils/Helper');

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as cartActions from '../../actions/Cart';

class Cart extends React.Component {

  componentDidMount() {
    /*if (!this.props.isFetching) {
      this.props.actions.getCartProducts();
    }*/
  }

  render() {
    return (
      <View style={styles.container}>
        {this.props.platformOS === 'ios' ? <View style={styles.iosStatusBar}/> : null}
        <ActionBar
          navigator={this.props.navigator}
          openDrawer={() => this.props.openDrawer()}
          title="SHOPPING CART"
          total={this.props.total}>
        </ActionBar>
        <View style={styles.wrapper}>
          {
            this.props.count ?
              <View>
                <Products navigator={this.props.navigator} />
              </View>
              :
              <View style={styles.emptyCartContainer}>
                <Text style={styles.emptyCartText}>Shopping cart is empty</Text>
                <View style={styles.separator}/>
                <ButtonSecondary
                  onPress={() => {
                    let routes = this.props.navigator.getCurrentRoutes();
                    let previousRoute = null;
                    if (routes.length >= 2) {
                      previousRoute = routes[routes.length - 2].id;
                    }
                    if (_.includes([
                      'ProductPage',
                      'default',
                      'ResultPage',
                      'FilterPage'
                    ], previousRoute)) {
                      this.props.navigator.pop();
                    } else {
                      this.props.navigator.resetTo({
                        id: 'default'
                      });
                    }
                    this.props.actions.openOriPartNumber(true);
                    Log.logEvent(Events.EVENT_CART_BACK);
                  }}
                >
                  Continue shopping
                </ButtonSecondary>
              </View>
          }
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    connected: state.network.connected,
    platformOS: state.device.platformOS,
    count: state.cart.count,
    total: state.cart.total,
    amount: state.cart.amount,
    currentCurrency: state.user.currentCurrency,
    isFetching: state.cart.isFetching,
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({...cartActions, changeCurrentCurrency, openOriPartNumber}, dispatch)};
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Cart);
