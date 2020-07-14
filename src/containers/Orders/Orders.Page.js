import React from 'react';
import {
  Text,
  View,
  Platform,
  ListView,
  TouchableNativeFeedback,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as _ from 'lodash';

import styles from './styles';
import ActionBar from '../../components/ActionBar';
import Payment from './components/Payment';
import * as ordersActions from '../../actions/Orders';
import * as Log from '../../actions/Log';
import * as Events from '../../constants/Events';
require('../../utils/Helper');

const moment = require('moment-timezone');
const Touchable = Platform.OS === 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableOpacity;

class OrdersPage extends React.Component {

  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
    this.state = {
      ds,
      dataSource: ds.cloneWithRows([]),
      refreshing: false,
      shouldRefresh: false
    };
  }

  onRefresh() {
    this.props.actions.getOrderList(true);
  }

  componentDidMount() {
    this.props.actions.getOrderList();
    this.setState({
      dataSource: this.state.ds.cloneWithRows(this.props.orders)
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.shouldRefresh) {
      this.onRefresh();
      this.setState({
        shouldRefresh: false
      });
    }
    this.setState({
      dataSource: this.state.ds.cloneWithRows(nextProps.orders)
    });
  }

  openOrder(orderId, number, paymentId = null) {
    if (paymentId) {
      Log.logEvent(Events.EVENT_MY_ORDERS_PAY_NOW_LIST);
    } else {
      Log.logEvent(Events.EVENT_MY_ORDERS_PAGE);
    }

    this.props.navigator.push({
      id: 'OrderTrackingPage',
      orderId,
      number,
      paymentId
    });
    this.setState({
      shouldRefresh: true
    });
  }

  _renderRow(order, sectionID, rowID, rowMap) {
    let grandTotal = order['grand_total'];
    let grandTotalValues = _.map(grandTotal, (total) => {
      return `${total.currency.outputCurrency()} ${total.amount.formatPrice(total.currency)}`;
    });

    return (
      <View key={rowID}>
        {
          _.map(order['payments'], (payment, key) => {
            if (payment['is_open'] === true) {
              return (
                <View style={styles.paymentWrapper} key={key}>
                  <Payment
                    currency={payment['total_money']['currency']}
                    amountToPay={payment['total_money']['amount']}
                    onPayNow={() => this.openOrder(order.id, order.number, payment['id'])}/>
                </View>
              );
            }
          })
        }
        <Touchable
          activeOpacity={0.5}
          onPress={() => {
            this.openOrder(order.id, order.number);
          }}>
          <View style={styles.orderListItem}>
            <View style={styles.orderListDescItem}>
              <Text style={styles.orderListLabel}><Text style={styles.bold}>Order</Text> #{order.number}
              </Text>
            </View>
            <View style={styles.orderListDescItem}>
              <Text style={[styles.orderListLabel, styles.bold]}>Placed on</Text>
              <Text
                style={styles.orderListValue}>{moment.utc(order['created_at']['date']).local().format('YYYY-MM-DD H:mm')}</Text>
            </View>
            <View style={styles.orderListDescItem}>
              <Text style={[styles.orderListLabel, styles.bold]}>Status</Text>
              <Text style={styles.orderListValue}>{order.customer_status}</Text>
            </View>
            <View style={styles.orderListDescItem}>
              <Text style={[styles.orderListLabel, styles.bold]}>Total</Text>
              <Text style={styles.orderListValue}>
                {
                  grandTotalValues.length === 1 ?
                    grandTotalValues.toString()
                    :
                    `${grandTotalValues.join('\n')}`
                }
              </Text>
            </View>
            <Text style={styles.link}>Track details</Text>
          </View>
        </Touchable>
      </View>
    );
  }

  static _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View style={styles.separator} key={rowID}/>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.props.platformOS === 'ios' ? <View style={styles.iosStatusBar}/> : null}
        <ActionBar
          navigator={this.props.navigator}
          openDrawer={() => this.props.openDrawer()}
          disableArrow={true}
          title="MY ORDERS"
          total={this.props.total}/>
        <View style={styles.wrapper}>
          {
            !this.props.orders.length && !this.props.isFetching ?
              <Text style={styles.orderEmpty}>You do not have any orders yet</Text>
              : null
          }
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderRow.bind(this)}
            renderSeparator={OrdersPage._renderSeparator}
            removeClippedSubviews={false}
            refreshControl={
              <RefreshControl
                refreshing={this.props.isFetching}
                onRefresh={this.onRefresh.bind(this)}
              />
            }
            enableEmptySections={true}
          />
        </View>
      </View>
    );
  }
}


function mapStateToProps(state) {
  return {
    connected: state.network.connected,
    platformOS: state.device.platformOS,
    total: state.cart.total,
    orders: state.orders.orders,
    isFetching: state.orders.isFetching,
  };
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({...ordersActions}, dispatch)};
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(OrdersPage);
