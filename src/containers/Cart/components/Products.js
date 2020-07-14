import React from 'react';
import {
  Text,
  View,
  Image,
  ListView,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import * as Config from '../../../constants/Config';
import * as styles from '../styles';
import * as Colors from '../../../constants/Colors';
const Touchable = Platform.OS === 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableOpacity;
import Icon from 'react-native-vector-icons/FontAwesome';
// import {KeyboardAwareListView} from 'react-native-keyboard-aware-scroll-view';
import QuantityInput from '../../../components/QuantityInput';
import Total from './Total';
import ProceedButton from './ProceedButton';

import * as Events from '../../../constants/Events';
import * as Log from '../../../actions/Log';

require('../../../utils/Helper');

import {metricsCheckoutRemoveClick, metricsCheckoutChangeQtyClick, metricsCheckoutContinueClick} from '../../../utils/metrics';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as cartActions from '../../../actions/Cart';
import {openOriPartNumber} from '../../../actions/Parts';
import styled from 'styled-components/native/index';
import Icons from '../../../components/Icons';
import ButtonSecondary from '../../../components/ButtonSecondary';

class Products extends React.Component {

  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
    this.state = {
      ds,
      dataSource: ds.cloneWithRows([]),
    };
  }

  componentDidMount() {
    this.setState({
      dataSource: this.state.ds.cloneWithRows(this.props.products)
    });
  }

  componentWillReceiveProps(props) {
    this.setState({
      dataSource: this.state.ds.cloneWithRows(props.products)
    });
    if (this.props.currentCurrency.value !== props.currentCurrency.value) {
      this.onRefresh();
    }
  }

  onRefresh() {
    this.props.actions.getCartProducts();
  }

  renderHeader() {
    return (
      <View>
        <View style={styles.imageWrapper}>
          <Image
            source={require('boodmo/src/assets/secure_label.png')}
          />
          <Image
            style={{marginBottom: 15}}
            source={require('boodmo/src/assets/cart_return_10.png')}
          />
        </View>
        {
          this.props.products.length ?
            <Total
              total={this.props.total}
              amount={this.props.amount}
              currency={this.props.products.length ? this.props.currentCurrency.value : null}
              onPress={() => this.proceedToCheckout()}/>
            : null
        }
      </View>
    );
  }

  renderFooter() {
    return (
      <View style={styles.emptyCartContainer}>
        {
          this.props.count ?
            <View style={styles.footerSubTotal}>
              <Text style={styles.footerSubTotalText}>
                SUBTOTAL ({this.props.total > 1 ? this.props.total + ' items' : this.props.total + ' item'}):
                {' ' + this.props.currentCurrency.value.outputCurrency()} {this.props.amount.formatPrice(this.props.currentCurrency.value)}
              </Text>
            </View>
            : null
        }
        <View style={{
          width: 270,
          alignSelf: 'center',
          marginTop: 20,
        }}>
          {
            this.props.count > 2 ?
              <View style={styles.footerSubmit}>
                <ProceedButton onPress={() => this.proceedToCheckout()}/>
              </View>
              : null
          }
          <ButtonSecondary
            style={{flex: 1}}
            onPress={() => {
              this.props.actions.openOriPartNumber(true);
              metricsCheckoutContinueClick();
              Log.logEvent(Events.EVENT_CART_BACK);
              let routes = this.props.navigator.getCurrentRoutes();
              if (routes.length >= 3) {
                if (routes.length > 3 && routes[routes.length - 4].id === 'WebBrowser' && routes[routes.length - 4].key === 'SearchByVin') {
                  this.props.navigator.popToRoute(routes[routes.length - 4]);
                } else if (routes[routes.length - 3].id === 'ResultPage' && routes[routes.length - 3].key === 'SearchByPN') {
                  this.props.navigator.resetTo({
                    id: 'default'
                  });
                } else if (routes[routes.length - 3].id === 'ResultPage' && routes[routes.length - 3].key === 'SearchByCar') {
                  this.props.navigator.popToRoute(routes[routes.length - 3]);
                } else if (routes.length > 3 && routes[routes.length - 4].id === 'WebBrowser' && routes[routes.length - 4].key === 'SearchByCarOriginal') {
                  this.props.navigator.popToRoute(routes[routes.length - 4]);
                } else {
                  this.props.navigator.pop();
                }
              } else if (routes.length === 1) {
                this.props.navigator.resetTo({
                  id: 'default'
                });
              } else {
                this.props.navigator.pop();
              }
            }}
          >
            Continue shopping
          </ButtonSecondary>
        </View>
      </View>
    );
  }

  openProduct(partId) {
    this.props.navigator.push({
      id: 'ProductPage',
      partId: partId
    });
  }

  deleteProduct(productID) {
    this.props.actions.deleteProductFromCart(productID);
  }

  submitQuantity(index, quantity) {
    this.props.actions.updateQuantity(index, quantity);
  }

  proceedToCheckout() {
    Log.logEvent(Events.EVENT_PROCEED_TO_CHECKOUT);
    const routes = this.props.navigator.getCurrentRoutes();
    let previousRoute = null;
    if (routes.length >= 2) {
      previousRoute = routes[routes.length - 2].id;
    }
    if (previousRoute !== 'CheckoutPage') {
      this.props.navigator.push({
        id: 'CheckoutPage'
      });
    } else {
      this.props.navigator.replacePreviousAndPop({
        id: 'CheckoutPage'
      });
    }
  }

  _renderRow(rowData, sectionID, rowID) {

    function getImageItem(rowData) {
      let imageSource = require('boodmo/src/assets/product_default.jpg');

      if (rowData.product.part.image) {
        imageSource = {uri: `${Config.IMAGE_FOLDER}${rowData.product.part.image}`};
      }

      return <View>
        <Image source={imageSource} style={styles.partImage} resizeMode={'contain'}/>
        {
          rowData.product.part.attributes.is_best_offer &&
          <StyledLabelBestOffer>
            <View style={{position: 'relative'}}>
              <Icons name="BestOffer" fill={Colors.BEST_OFFER_LABEL} viewBox="0 54 186 54" />
              <Text style={{
                position: 'absolute',
                color: '#fff',
                fontSize: Platform.OS === 'ios' ? 6 : 7,
                top: Platform.OS === 'ios' ? 5 : 4,
                paddingLeft: 4,
                backgroundColor: 'transparent',
                fontWeight: 'bold',
              }}>Best Offer</Text>
            </View>
          </StyledLabelBestOffer>
        }
        {
          rowData.product.part.brand_is_oem &&
          <StyledLabelOem>
            <Icons name="OemGenuine" viewBox="0 -8 284 284"/>
          </StyledLabelOem>
        }
      </View>;
    }

    function getTextItem(name, value, _style) {
      return (value ?
        <View style={[{
          justifyContent: 'flex-start',
        }, _style]}>
          <Text style={[styles.itemText, {
            fontWeight: '100',
            color: Colors.GREY,
          }]}>{name}: {value}</Text>
        </View>
        : null);
    }

    return (
      <View key={rowID}>
        <View style={[styles.part, {flexDirection: 'column'}]}>
          <View style={{flexDirection: 'row'}}>
            {getImageItem(rowData)}
            <View style={styles.partDescription}>
              <Touchable onPress={() => {
                this.openProduct(rowData.product.part.id);
              }}>
                <Text style={styles.partName}>{rowData.product.part.name}</Text>
              </Touchable>
              {
                rowData.product.price == null ? null : <Text style={styles.partPrice}>
                  {rowData.product.price.currency.outputCurrency()} {rowData.product.price.amount.formatPrice(rowData.product.price.currency)}
                </Text>
              }
              {getTextItem('Part Number', rowData.product.part.number)}
              {getTextItem('Brand', rowData.product.part.brand_name || null)}
              {getTextItem('Sold By', rowData.product.seller.name)}
            </View>
          </View>
          <QuantityInput
            value={rowData.product.requested_qty || 1}
            onSubmit={(quantity) => {
              if (quantity !== rowData.product.requested_qty) {
                let condition = quantity > rowData.product.requested_qty ? 'add' : 'remove';
                metricsCheckoutChangeQtyClick({
                  eventAction: condition,
                  ecommerce: {
                    currencyCode: this.props.currentCurrency && this.props.currentCurrency.name,
                    [condition]: {
                      actionField: {
                        list: 'shoppingCart'
                      },
                      products: [{
                        id: rowData.product && rowData.product.part && rowData.product.part.number,
                        name: rowData.product && rowData.product.part && rowData.product.part.name,
                        category: rowData.product && rowData.product.part && rowData.product.part.family_name,
                        dimension16: rowData.product && rowData.product.part && rowData.product.part.family_id.toString(),
                        brand: rowData.product && rowData.product.part && rowData.product.part.brand_name,
                        variant: rowData.product && rowData.product.part && rowData.product.part.brand_is_oem,
                        price: rowData.product && rowData.product.price && rowData.product.price.amount,
                        metric1: rowData.product && rowData.product.price && rowData.product.price.amount,
                        quantity: quantity
                      }]
                    }
                  }
                });
              }
              this.submitQuantity(rowID, quantity || 1);
            }}/>
          <Touchable
            onPress={() => {
              metricsCheckoutRemoveClick({
                ecommerce: {
                  currencyCode: this.props.currentCurrency && this.props.currentCurrency.name,
                  remove: {
                    actionField: {
                      list: 'shoppingCart'
                    },
                    products: [{
                      id: rowData.product && rowData.product.part && rowData.product.part.number,
                      name: rowData.product && rowData.product.part && rowData.product.part.name,
                      category: rowData.product && rowData.product.part && rowData.product.part.family_name,
                      dimension16: rowData.product && rowData.product.part && rowData.product.part.family_id.toString(),
                      brand: rowData.product && rowData.product.part && rowData.product.part.brand_name,
                      variant: rowData.product && rowData.product.part && rowData.product.part.brand_is_oem,
                      price: rowData.product && rowData.product.price && rowData.product.price.amount,
                      metric1: rowData.product && rowData.product.price && rowData.product.price.amount,
                      quantity: rowData.product && rowData.product.requested_qty
                    }]
                  }
                }
              });
              this.deleteProduct(rowID);
              Log.logEvent(Events.EVENT_CART_REMOVE);
            }}
            style={styles.deleteButtonWrapper}>
            <View style={styles.deleteButton}>
              <Icon name="trash" size={22} color={Colors.BUTTON_DELETE}/>
              <Text>Remove item</Text>
            </View>
          </Touchable>
        </View>
      </View>
    );
  }

  _renderSeparator(sectionID, rowID) {
    return (
      <View style={[styles.separator, styles.separatorItem]} key={rowID}/>
    );
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderHeader={this.renderHeader.bind(this)}
        renderFooter={this.renderFooter.bind(this)}
        renderRow={this._renderRow.bind(this)}
        renderSeparator={this._renderSeparator}
        refreshControl={
          <RefreshControl
            refreshing={this.props.isFetching}
            onRefresh={this.onRefresh.bind(this)}
          />
        }
        enableEmptySections={true}
        style={{backgroundColor: '#fff', height: '100%'}}
      />
    );
  }
}

const StyledLabelBestOffer = styled.View`
    position: absolute;
    top: 10;
    left: 0;
    z-index: 100;
`;
const StyledLabelOem = styled.View`
    position: absolute;
    top: 0;
    right: 0;
    z-index: 100;
`;

function mapStateToProps(state) {
  return {
    products: state.cart.products,
    isFetching: state.cart.isFetching,
    count: state.cart.count,
    total: state.cart.total,
    totalRes: state.parts.total,
    amount: state.cart.amount,
    currentCurrency: state.user.currentCurrency,
  };
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({...cartActions, openOriPartNumber}, dispatch)};
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Products);
