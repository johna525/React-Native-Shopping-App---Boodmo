import React from 'react';
import {
  Text,
  View,
  Image,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  ListView,
  WebView
} from 'react-native';
import * as Config from '../../../../constants/Config';
import * as styles from '../../styles';
import * as Colors from '../../../../constants/Colors';

const Touchable = Platform.OS === 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableOpacity;
import * as _ from 'lodash';

require('../../../../utils/Helper');
const moment = require('moment');

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

  openProduct(partId) {
    this.props.navigator.push({
      id: 'ProductPage',
      partId: partId
    });
  }

  _renderRow(checkoutPackage, sectionID, rowID) {
    const self = this;

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
          <Text style={[styles.itemText, {
            fontWeight: '100',
            color: Colors.GREY,
          }]}>{name}: {value}</Text>
        </View>
        : null);
    }

    function getProductTotalItem(label, value) {
      return (
        value ?
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.bold}>{label}</Text>
            <Text>{value}</Text>
          </View>
          : null
      );
    }

    function getProduct(product) {
      return (<View style={[styles.part, styles.reviewProduct]}>
        <View style={{flexDirection: 'row'}}>
          {getImageItem(product.part['image'] || null)}
          <View style={styles.partDescription}>
            {
              product.part['name'] ?
                <Touchable onPress={() => {
                  self.openProduct(product['part_id']);
                }}>
                  <Text style={styles.partName}>{product.part['name']}</Text>
                </Touchable>
                : null
            }

            {getTextItem('Part Number', product.part['number'])}
            {getTextItem('Brand', product.part['brand_name'])}
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
        {getProductTotalItem('Qty', product['qty'])}
        {getProductTotalItem('Total', `${product.total.currency.outputCurrency()} ${product.total.amount.formatPrice(product.total.currency)}`)}
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

    let items = _.values(checkoutPackage.items);

    return (
      <View key={rowID} style={styles.successOrderPackage}>
        {
          checkoutPackage.number ?
            <Text style={styles.packageHeaderText}>Order Package #{checkoutPackage.number}</Text>
            : null
        }
        {
          checkoutPackage.seller ?
            <Text style={styles.packageHeaderText}>Sold by: {checkoutPackage.seller.name}</Text>
            : null
        }
        <Text style={styles.packageHeaderText}>
          Estimated delivery date:&nbsp;
          {checkoutPackage['shipping_eta'] ? moment(checkoutPackage['shipping_eta']['date']).format('DD-MM-YYYY') : null}
        </Text>
        {items.length ? renderProducts(items) : null}
        {
          checkoutPackage.grand_total ?
            <View style={styles.packageFooter}>
              <Text
                style={styles.packageFooterText}>Package total:&nbsp;
                {checkoutPackage.grand_total.currency.outputCurrency()} {checkoutPackage.grand_total.amount.formatPrice(checkoutPackage.grand_total.currency)}
              </Text>
            </View>
            : null
        }
        <WebView
          source={{html: '<html><head><script type="text/javascript" src="https://apis.google.com/js/platform.js?onload=renderOptIn" async defer></head></html>'}}
          javaScriptEnabled={true}
          onError={(error) => console.log(error)}
          injectedJavaScript={`
                    window.renderOptIn = function() {
                      window.gapi.load('surveyoptin', function() {
                        window.gapi.surveyoptin.render({
                          "merchant_id": 115159641,
                          "order_id": ${this.props.order && this.props.order.order_id || null},
                          "email": ${this.props.userEmail},
                          "delivery_country": ${this.props.deliveryCountry},
                          "estimated_delivery_date": ${checkoutPackage['shipping_eta'] ? moment(checkoutPackage['shipping_eta']['date']).format('YYYY-MM-DD') : null}
                        });
                      });
                    }
                  `}
        />
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
        removeClippedSubviews={false}
        style={styles.successOrderWrapper}
      />
    );
  }
}

export default Products;
