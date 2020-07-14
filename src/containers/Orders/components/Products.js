import React from 'react';
import {
  Text,
  View,
  Image,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  ListView,
  RefreshControl
} from 'react-native';
import Button from '../../../components/Button';
import * as Config from '../../../constants/Config';
import * as styles from '../styles';
import * as Colors from '../../../constants/Colors';

const Touchable = Platform.OS === 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableOpacity;
import * as _ from 'lodash';
import {STATUSES} from '../../../constants/Orders';

const moment = require('moment');
require('../../../utils/Helper');

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
      dataSource: this.state.ds.cloneWithRows(this.props.packages)
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.packages) {
      this.setState({
        dataSource: this.state.ds.cloneWithRows(nextProps.packages)
      });
    }
  }


  openProduct(partId) {
    this.props.navigator.push({
      id: 'ProductPage',
      partId: partId
    });
  }


  _renderRow(checkoutPackage, sectionID, rowID, rowMap) {
    let self = this;

    function getImageItem(image) {
      if (image) {
        const imageUrl = `${Config.IMAGE_FOLDER}${image}`;
        return <Image source={{uri: imageUrl}} style={styles.partImage}
          resizeMode={'contain'}/>;
      } else {
        return <Image source={require('boodmo/src/assets/product_default.jpg')}
          style={styles.partImage}
          resizeMode={'contain'}/>;
      }
    }

    function getTextItem(name, value, _style) {
      return (value ?
        <View style={[{
          justifyContent: 'flex-start',
        }, _style]}>
          <Text style={styles.itemText}>{name}: {value}</Text>
        </View>
        : null);
    }

    function getProductTotalItem(label, value) {
      return (
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={[styles.productTotalItemText, styles.bold]}>{label}</Text>
          <Text style={styles.productTotalItemText}>{value}</Text>
        </View>
      );
    }

    function getProduct(product) {
      return (<View style={[styles.part, styles.reviewProduct]}>
        <View style={{flexDirection: 'row'}}>
          {getImageItem(product.part_image)}
          <View style={styles.partDescription}>
            <Touchable onPress={() => {
              self.openProduct(product.part_id);
            }}>
              <Text style={styles.partName}>{product.name}</Text>
            </Touchable>
            {getTextItem('Part Number', product.number)}
            {getTextItem('Brand', product.brand)}
          </View>
        </View>
        {getProductTotalItem('Price', `${product.price.currency.outputCurrency()} ${product.price.amount.formatPrice(product.price.currency)}`)}
        {
          getProductTotalItem(
            'Delivery charge',
            product.delivery_price.amount > 0 ?
              `${product.delivery_price.currency.outputCurrency()} ${product.delivery_price.amount.formatPrice(product.delivery_price.currency)}`
              : 'Free'
          )
        }
        {getProductTotalItem('Qty', product.qty)}
        {getProductTotalItem('Total', `${product.sub_total.currency.outputCurrency()} ${product.sub_total.amount.formatPrice(product.sub_total.currency)}`)}
        {getProductTotalItem('Status', product['customer_status'])}
        {
          !_.includes([
            'CANCELLED',
            'CANCEL_REQUESTED_SUPPLIER',
            'CANCEL_REQUESTED_USER',
            'SENT_TO_LOGISTICS',
            'REQUEST_SENT',
            'COMPLETE',
            'DELIVERED'
          ], product['customer_status'].toUpperCase()) ?
            <View style={styles.cancelWrapper}>
              <Button
                disabled={false}
                onPress={() => self.props.cancelProduct(product.id)}
                underlayColor={Colors.DRAWER_LINK_BACKGROUND}
                style={styles.buttonCancel}
                textStyle={styles.buttonCancelText}>
                                Cancel
              </Button>
            </View>
            : null
        }
      </View>);
    }

    function renderProducts(items) {
      let products = _.values(items);
      return (
        <View style={styles.packageBody}>
          {products.map((product, key) => (
            <View key={key}>
              {getProduct(product)}
            </View>
          ))}
        </View>
      );
    }

    let delivery = checkoutPackage.delivery_total.amount > 0 ?
      `${checkoutPackage.delivery_total.currency.outputCurrency()} ${checkoutPackage.delivery_total.amount.formatPrice(checkoutPackage.delivery_total.currency)}`
      : 'Free';
    let baseDelivery = checkoutPackage.delivery_total.currency !== checkoutPackage.base_delivery_total.currency ?
      `${checkoutPackage.base_delivery_total.currency.outputCurrency()} ${checkoutPackage.base_delivery_total.amount.formatPrice(checkoutPackage.base_delivery_total.currency)}`
      : null;

    let grandTotal = `${checkoutPackage.grand_total.currency.outputCurrency()} ${checkoutPackage.grand_total.amount.formatPrice(checkoutPackage.grand_total.currency)}`;
    let baseGrandTotal = checkoutPackage.grand_total.currency !== checkoutPackage.base_grand_total.currency ?
      `${checkoutPackage.base_grand_total.currency.outputCurrency()} ${checkoutPackage.base_grand_total.amount.formatPrice(checkoutPackage.base_grand_total.currency)}`
      : null;

    return (
      <View key={rowID} style={styles.successOrderPackage}>
        <Text style={[styles.packageHeaderText, styles.bold]}>Order Package #{checkoutPackage['number']}</Text>
        {
          checkoutPackage['supplier'] && checkoutPackage['supplier']['name'] ?
            <Text style={styles.packageHeaderText}>Sold by: {checkoutPackage['supplier']['name']}</Text>
            : null
        }
        {
          checkoutPackage['shipping_eta'] ?
            <Text style={styles.packageHeaderText}>Estimated delivery
                            date: {checkoutPackage['shipping_eta']}</Text>
            : null
        }
        {renderProducts(checkoutPackage.items)}
        {
          checkoutPackage['grand_total'] && checkoutPackage['status']['G'] !== 'CANCELLED' ?
            <View style={styles.packageFooter}>
              <Text
                style={styles.packageFooterText}>
                                Delivery charge:&nbsp;
                {delivery}
                {
                  baseDelivery &&
                                    ` (${baseDelivery})`
                }
              </Text>
              <Text
                style={[styles.packageFooterText, styles.bold]}>
                                Package total:&nbsp;
                {grandTotal}
                {
                  baseGrandTotal &&
                                    ` (${baseGrandTotal})`
                }
              </Text>
            </View>
            : null
        }

      </View>
    );
  }

  renderHeader() {
    return this.props.header;
  }

  renderFooter() {
    return this.props.footer;
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this._renderRow.bind(this)}
        renderHeader={this.renderHeader.bind(this)}
        renderFooter={this.renderFooter.bind(this)}
        enableEmptySections={true}
        refreshControl={
          <RefreshControl
            refreshing={this.props.isFetching}
            onRefresh={this.props.onRefresh.bind(this)}
          />
        }
        style={styles.successOrderWrapper}
      />
    );
  }
}

export default Products;
