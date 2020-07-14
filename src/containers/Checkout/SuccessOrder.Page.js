import React from 'react';
import {
  View
} from 'react-native';
import Button from '../../components/Button';
import LoadingIndicator from '../../components/LoadingIndicator';
import ActionBar from '../../components/ActionBar';
import HeaderNShipping from './components/SuccessOrder/HeaderNShipping';
import Products from './components/SuccessOrder/Products';
import Total from './components/SuccessOrder/Total';

require('../../utils/Helper');

import styles from './styles';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getCreatedOrder} from '../../actions/Checkout';

class SuccessOrderPage extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.actions.getCreatedOrder(this.props.createdOrder['order_id']);
  }


  render() {
    let {order, total, userEmail, isFetching, platformOS, navigator, openDrawer, createdOrder} = this.props;
    return (
      <View style={styles.container}>
        {platformOS === 'ios' ? <View style={styles.iosStatusBar}/> : null}
        <ActionBar
          navigator={navigator}
          openDrawer={() => openDrawer()}
          title={order ? `Order #${order.number}` : null}
          total={total}/>
        <View style={styles.wrapper}>
          {
            isFetching ?
              <LoadingIndicator
                style={styles.loadingIndicator}
                size="large"
              />
              : null
          }
          {
            order ?
              <Products
                packages={order.packages}
                navigator={navigator}
                userEmail={userEmail}
                deliveryCountry={order.address && order.address.country || null}
                order={createdOrder}
                header={
                  <HeaderNShipping
                    number={order.number}
                    address={order.address}
                    total={order.grand_total}
                    order={createdOrder}
                    goToCheckout={() => navigator.resetTo({
                      id: 'CheckoutPage'
                    })}/>
                }
                footer={
                  <View style={styles.successOrderFooter}>
                    <Total
                      itemsCount={order.items_count}
                      subTotal={order.sub_total}
                      deliveryCharge={order.delivery_total}
                      grandTotal={order.grand_total}
                      originalTotal={order.grand_total_list}
                      currency={order.currency}/>
                    <Button
                      disabled={false}
                      onPress={() => {
                        navigator.resetTo({
                          id: 'default'
                        });
                      }}
                      style={styles.buttonSubmit}
                      textStyle={styles.buttonSubmitText}>
                                            CONTINUE SHOPPING
                    </Button>
                  </View>
                }/>
              : null
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
    total: state.cart.total,
    createdOrder: state.checkout.createdOrder,
    order: state.checkout.successOrder,
    userEmail: state.user.email,
    estimatedDeliveryDate: state.checkout.estimatedDeliveryDate
  };
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({getCreatedOrder}, dispatch)};
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(SuccessOrderPage);
