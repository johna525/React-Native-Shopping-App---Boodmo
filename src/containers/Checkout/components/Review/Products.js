import React from 'react';
import {
  Text,
  View,
  Image,
  ListView,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';
import Alert from '../../../../components/Alert';
import * as Config from '../../../../constants/Config';
import * as styles from '../../styles';
import * as Colors from '../../../../constants/Colors';

const Touchable = Platform.OS === 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableOpacity;
import * as _ from 'lodash';

const moment = require('moment');
require('../../../../utils/Helper');

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
      dataSource: this.state.ds.cloneWithRows(this.props.reviewCart.packages)
    });
  }

  componentWillReceiveProps(props) {
    this.setState({
      dataSource: this.state.ds.cloneWithRows(props.reviewCart.packages)
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
      return (
        value ?
          <View style={[{justifyContent: 'flex-start'}, _style]}>
            <Text style={[styles.itemText, {
              fontWeight: '100',
              color: Colors.GREY,
            }]}>{name}: {value}</Text>
          </View>
          : null
      );
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
          {getImageItem(product.part.image || null)}
          <View style={styles.partDescription}>
            {
              product.part.name ?
                <Touchable onPress={() => {
                  self.openProduct(product.part.id);
                }}>
                  <Text style={styles.partName}>{product.part.name}</Text>
                </Touchable>
                : null
            }
            {getTextItem('Part Number', product.part.number)}
            {getTextItem('Brand', product.part.brand)}
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
        {getProductTotalItem('Quantity', product.qty)}
        {getProductTotalItem('Total', `${product.total.currency.outputCurrency()} ${product.total.amount.formatPrice(product.total.currency)}`)}
      </View>);
    }

    function renderProducts(items) {
      let products = _.values(items);
      return (
        products.length ?
          <View style={styles.packageBody}>
            {products.map((product, key) => (
              <View key={key}>
                {getProduct(product)}
              </View>
            ))}
          </View>
          : null
      );
    }

    let grandTotalValue = checkoutPackage.grand_total.currency !== checkoutPackage.currency ?
      checkoutPackage.grand_total_list[checkoutPackage.currency]
      : null;

    return (
      <View key={rowID}>
        <View style={styles.alertContainer}>
          <Alert
            type="warning"
            icon="truck">
            <Text style={styles.alertMessage}>
                            IMPORTANT:
            </Text>
            <Text style={[styles.alertMessage, styles.bold, styles.alertContent]}>
                            Expected date:&nbsp;
              {
                checkoutPackage['shipping_eta'] ?
                  moment(checkoutPackage['shipping_eta']['date']).format('DD-MM-YYYY')
                  : null
              }
            </Text>
          </Alert>
        </View>
        {
          checkoutPackage.number ?
            <Text style={[styles.bold, styles.packageHeaderText]}>Order Package&nbsp;
                            #{checkoutPackage.number}
            </Text>
            : null
        }
        {
          checkoutPackage.seller ?
            <Text style={styles.packageHeaderText}>Sold by: {checkoutPackage.seller.name}</Text>
            : null

        }
        {renderProducts(checkoutPackage.items)}
        <View style={styles.packageFooter}>
          <Text
            style={styles.packageFooterText}>
                        Package total:&nbsp;
            {checkoutPackage.grand_total.currency.outputCurrency()} {checkoutPackage.grand_total.amount.formatPrice(checkoutPackage.grand_total.currency)}
          </Text>
          {
            grandTotalValue &&
            <Text
              style={styles.packageFooterText}>
                            You will pay: {grandTotalValue.currency.outputCurrency()} {grandTotalValue.amount.formatPrice(grandTotalValue.currency)}
            </Text>
          }
        </View>
      </View>
    );
  }


  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this._renderRow.bind(this)}
        enableEmptySections={true}
        removeClippedSubviews={false}
        style={{backgroundColor: '#fff'}}
      />
    );
  }
}

export default Products;
