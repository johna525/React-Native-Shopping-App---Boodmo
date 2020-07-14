import React, {Component} from 'react';
import {
  Animated,
  Easing,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  TouchableNativeFeedback,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styled from 'styled-components/native';
import Icons from '../../components/Icons';
import Gallery from 'react-native-gallery';
import Button from '../../components/Button';
import ActionBar from '../../components/ActionBar';
import LoadingIndicator from '../../components/LoadingIndicator';
import LabelValue from '../../components/LabelValue';
import MorePartsValue from './components/MorePartsValue';
import WrapItem from './components/WrapItem';
const Touchable = Platform.OS === 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableOpacity;

import styles from './styles';
import * as Log from '../../actions/Log';
import * as Events from '../../constants/Events';
import * as Config from '../../constants/Config';
import * as Messages from '../../constants/Messages';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as productActions from '../../actions/Product';
import * as cartActions from '../../actions/Cart';
import {openOriPartNumber} from '../../actions/Parts';
import {changeCurrentCurrency} from '../../actions/User';

import * as Colors from '../../constants/Colors';
import * as Sort from './../../utils/Sort';

import {metricsProductPageAddToCartClick, metricsProductPageApplicabilityClick, metricsSearchResProductClick} from '../../utils/metrics';

require('../../utils/Helper');

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollToY: 0,
      collapsedHeight: 0,
      metrics: true,
      deliveryPin: '',
      isValidPin: false,
      activeImage: 0,
      hideWarning: false,
      animatedWarningValue: new Animated.Value(1),
      animatedDiscountValue: new Animated.Value(0),
    };
    this.image = null;
  }

  componentDidMount() {
    if (this.props.deliveryInfo && this.props.deliveryInfo.pin) {
      this.props.actions.getPinInfo(this.props.deliveryInfo.pin);
    }
    this.props.actions.getPartInfo(this.props.route.partId, this.props.deliveryInfo.pin);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.deliveryInfo && nextProps.deliveryInfo.pin !== this.state.deliveryPin) {
      const pin = this.state.deliveryPin.length > 0 ? this.state.deliveryPin : nextProps.deliveryInfo.pin;

      this.setState({
        deliveryPin: pin,
        isValidPin: (nextProps.pinInfo && nextProps.pinInfo.pin.toString() === pin &&
          nextProps.pinInfo.city) || (nextProps.deliveryInfo && nextProps.deliveryInfo.pin === pin),
      });
    }
    if (this.props.currentCurrency.value !== nextProps.currentCurrency.value) {
      this.props.actions.getPartInfo(this.props.route.partId, this.state.deliveryPin);
    }
    if (nextProps.product && nextProps.product.partInfo && nextProps.product.partInfo.attributes) {
      this.setState({hideWarning: !!nextProps.product.partInfo.attributes.boodmo_photo});
    }
    if (nextProps.product && nextProps.product.mainSupplier && nextProps.product.mainSupplier.product && this.state.metrics) {
      let product = nextProps.product.mainSupplier.product;
      metricsSearchResProductClick({
        eventProductId: product.id.toString(),
        eventCategoryId: product.family_id.toString(),
        ecommerce: {
          currencyCode: product.price && product.price.currency || null,
          click: {
            actionField: {
              list: 'SearchResults'
            },
            products: [{
              id: product && product.part && product.part.number,
              name: product && product.part && product.part.name,
              category: product && product.part && product.part.family_name,
              dimension16: product && product.part && product.part.family_id && product.part.family_id.toString(),
              brand: product && product.part && product.part.brand_name,
              position: nextProps.route && nextProps.route.position,
              variant: product && product.part && product.part.brand_is_oem,
              price: product && product.price && product.price.amount && (parseFloat(product.price.amount) / 100).toString() || null,
              metric1: product && product.price && product.price.amount && (parseFloat(product.price.amount) / 100).toString() || null
            }]
          }
        }
      });
      this.setState({metrics: false});
    }
  }

  _pressAftermarketParts = () => {
    Log.logEvent(Events.EVENT_PARTS_AFTERMARKET);
    this.props.navigator.push({
      id: 'ReplacementsPage',
      items: this.props.product.aftermarketParts.items,
      title: 'Aftermarket replacement parts'
    });
  };

  _pressOemParts = () => {
    Log.logEvent(Events.EVENT_PARTS_OEM);
    this.props.navigator.push({
      id: 'ReplacementsPage',
      items: this.props.product.oemParts.items,
      title: 'OEM replacement parts'
    });
  };

  _pressCompatibility = () => {
    Log.logEvent(Events.EVENT_PARTS_COMPATIBILITY);
    this.props.navigator.push({
      id: 'CompatibilityPage',
      items: this.props.product.compatibility.items,
      title: 'Applicability'
    });
  };

  _addToCart = (supplier) => {
    Log.logEvent(Events.EVENT_CART_ADD);
    let productId = supplier.product.id;
    this.props.actions.addDraftProductToCart({
      product: {
        ...supplier.product,
        imageUrl: this.image
      },
      delivery: {}
    }, this.image);
    this.props.actions.addProductToCart(productId);
    let routes = this.props.navigator.getCurrentRoutes();
    let previousRoute = null;
    if (routes.length >= 2) {
      previousRoute = routes[routes.length - 2].id;
    }
    if (previousRoute !== 'CartPage') {
      this.props.navigator.push({
        id: 'CartPage'
      });
    } else {
      this.props.navigator.replacePreviousAndPop({
        id: 'CartPage'
      });
    }
  };

  _hideRepresentationWarning = () => {
    Animated.timing(this.state.animatedWarningValue, {
      toValue: 0,
      duration: 300,
      easing: Easing.quad,
    }).start();
  };

  _setActiveImage = (index) => {
    setTimeout(() => {
      this.setState({activeImage: index});
      if (!this.state.hideWarning && index > 0) {
        this._hideRepresentationWarning();
      }
    }, 600);
  };

  _animateDiscount = () => {
    Animated.timing(this.state.animatedDiscountValue, {
      toValue: 1,
      delay: 10,
      duration: 200,
      easing: Easing.quad,
    }).start();
  };

  _getSuppliersForSold = () => {
    let sortedForSold = this.props.product.suppliers ? this.props.product.suppliers.sort((a, b) => {
      return a.product.price.amount - b.product.price.amount;
    }) : [];
    let fastSuppliers = [...sortedForSold];
    fastSuppliers.shift();
    let fastest = fastSuppliers.length > 0 ? fastSuppliers.reduce(Sort.faster) : null;

    if (fastest) {
      sortedForSold.splice(sortedForSold.indexOf(fastest), 1);
      sortedForSold.splice(1, 0, fastest);
    }

    return sortedForSold;
  };

  renderDiscount = () => {
    const discount = this.props.product.mainSupplier.product.safe_percent || 0;
    let discountElement = null;

    if (discount > 0) {
      this._animateDiscount();
      discountElement = <Animated.View
        style={{
          marginTop: 7,
          marginLeft: 5,
          backgroundColor: Colors.DISCOUNT,
          borderRadius: 3,
          transform: [{scale: this.state.animatedDiscountValue}],
          opacity: this.state.animatedDiscountValue,
        }}
      >
        <StyledDiscount>-{discount}% OFF</StyledDiscount>
      </Animated.View>;
    }

    return discountElement;
  };

  renderProductMrp = () => {
    const product = this.props.product.mainSupplier.product;
    const price = parseInt(product.price.amount, 10);
    let mrp = 0;

    if (product.mrp && !!product.mrp.amount) {
      if (parseInt(product.mrp.amount, 10) >= price) {
        mrp = parseInt(product.mrp.amount, 10);
      }
    } else {
      mrp = price;
    }

    return mrp >= 0 && (
      <Text style={{
        fontSize: 20,
        marginBottom: 10
      }}>
        MRP: <Text style={{fontWeight: '500'}}>
          {product.mrp.currency.outputCurrency() + ' ' + mrp.formatPrice()}
        </Text>
      </Text>
    );
  };

  displaySuppliers = (data) => {
    return (
      data.map((supplier, key) =>
        <Touchable key={key}
          onPress={() => {
            this._addToCart(supplier);
          }}>
          <View
            style={{
              marginBottom: 10
            }}>
            <View
              style={[styles.wrapItemColumn, {alignItems: 'center'}]}>
              <Text
                style={styles.wrapItemLinkText}>{supplier.product.seller ? supplier.product.seller.name : null}</Text>
              <Icon name="shopping-cart"
                style={styles.wrapItemLinkIcon}/>
            </View>
            {
              supplier.product.price ?
                <LabelValue label={'Price:'}
                  value={supplier.product.price.currency.outputCurrency() + ' ' + supplier.product.price.amount.formatPrice()}/>
                : null
            }
            {
              supplier.delivery ?
                <LabelValue label={'Delivery:'}
                  value={`${this.props.pinInfo && this.props.pinInfo.pin && this.props.pinInfo.city ? '' : 'dispatch '}within ${supplier.delivery.days} days`}/>
                : null
            }
            {
              supplier.delivery ?
                <LabelValue
                  label={'Delivery price:'}
                  value={supplier.delivery.price.amount == 0 ? 'Free Delivery' : `+ ${supplier.delivery.price.currency.outputCurrency() } ${supplier.delivery.price ? supplier.delivery.price.amount.formatPrice() : null}`}/>
                : null
            }
          </View>
        </Touchable>
      )
    );
  };

  render() {
    const hiddenAttributes = [
      'main_image',
      'description',
      'media_gallery',
      'is_in_oriparts',
      'oriparts_id',
      'boodmo_photo',
      'is_best_offer'
    ];

    if (this.props.product.partInfo && this.props.product.partInfo.attributes['main_image']) {
      this.image = `${this.props.product.partInfo.attributes['main_image']}`;
    } else if (this.props.product.partInfo && this.props.product.partInfo.family && this.props.product.partInfo.family['image']) {
      this.image = `${this.props.product.partInfo.family['image']}`;
    } else {
      this.image = null;
    }

    let imageUrl = this.image ? `${Config.IMAGE_FOLDER}${this.image}` : null;
    let images = this.props.product.partInfo && this.props.product.partInfo.attributes['media_gallery'] ? this.props.product.partInfo.attributes['media_gallery'] : [];

    if (!Array.isArray(images)) {
      images = [];
    }

    const gallery = this.image ? [this.image].concat(images) : null;
    const imageUrls = images.map((item) => {
      return `${Config.IMAGE_FOLDER}${item}`;
    });
    const featuresAndSpecs = [];
    const openGallery = () => {
      imageUrl && this.props.navigator.push({
        id: 'GalleryPage',
        images: gallery,
        partNumber: this.props.product.partInfo.number,
        index: this.state.activeImage,
      });
    };

    if (this.props.product.partInfo && this.props.product.partInfo.attributes) {
      Object.keys(this.props.product.partInfo.attributes)
        .filter((v) => !hiddenAttributes.includes(v))
        .forEach((v) => {
          if (this.props.product.partInfo.attributes[v] != null && this.props.product.partInfo.attributes[v] !== '' && this.props.product.partInfo.attributes[v] !== ' ') {
            if (['TecDoc ID', 'TecDoc Status', 'Group'].indexOf(v) === -1) {
              featuresAndSpecs.push({
                label: v,
                value: this.props.product.partInfo.attributes[v],
              });
            }
          }
        });
    }

    let _scrollView;
    let sortedForSold = this.props.product.suppliers ? this.props.product.suppliers.sort((a, b) => {
      return a.product.price.amount - b.product.price.amount;
    }) : [];
    let fastSuppliers = [...sortedForSold];
    fastSuppliers.shift();
    let fastest = fastSuppliers.length > 0 ? [fastSuppliers.reduce(Sort.faster)] : [];

    let sortedForReplacements = this.props.product.aftermarketParts && this.props.product.aftermarketParts.items ? this.props.product.aftermarketParts.items.sort((a, b) => {
      let first = a.price ? parseFloat(a.price.replace(',', '')) : null;
      let second = b.price ? parseFloat(b.price.replace(',', '')) : null;
      if (first === null) {return 1;}
      if (second === null) {return -1;}
      return first - second;
    }) : [];

    const hasSupplierProduct = this.props.product.mainSupplier && this.props.product.mainSupplier.product;

    return (
      <View style={styles.container}>
        {this.props.platformOS === 'ios' ? <View style={styles.iosStatusBar}/> : null}
        <ActionBar
          title={this.props.product.partInfo ? `${this.props.product.partInfo.brand ? this.props.product.partInfo.brand.name : ''} / ${this.props.product.partInfo.number}` : null}
          navigator={this.props.navigator}
          total={this.props.total}
          openDrawer={() => this.props.openDrawer()}>
        </ActionBar>
        <View style={styles.wrapper}>
          <Modal
            animationType={'fade'}
            transparent={true}
            visible={this.props.product.addToCartIsFetching}
            onRequestClose={() => {
            }}
          >
            <View style={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#00000055',
            }}>
              <LoadingIndicator
                style={{
                  transform: [{
                    scale: 2,
                  }]
                }}
                size="large"
              />
            </View>
          </Modal>
          {
            this.props.product.isFetching ?
              <LoadingIndicator
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 8,
                  bottom: 20,
                  left: 0,
                  right: 0,
                  height: 100,
                }}
                size="large"
              />
              :
              <View>
                {
                  this.props.product.error ?
                    <Button
                      onPress={() => {
                        this.props.actions.getPartInfo(this.props.route.partId, this.state.deliveryPin);
                      }}
                      underlayColor={Colors.BUTTON_BLUE_ACTIVE}
                      style={{
                        width: 200,
                        backgroundColor: Colors.BUTTON_BLUE,
                        borderColor: Colors.BUTTON_BLUE,
                      }}
                      textStyle={{
                        color: '#FFF'
                      }}>
                      Try again
                    </Button>
                    :
                    <ScrollView
                      ref={(scrollView) => {
                        _scrollView = scrollView;
                      }}
                      style={{
                        height: this.props.screenHeight - this.props.iosBarHeader - this.props.headerHeight - (this.props.platformOS === 'android' ? 20 : 0),
                      }}>
                      <View>
                        <View style={{
                          width: this.props.screenWidth,
                          justifyContent: 'center',
                          flexDirection: 'row',
                          borderColor: '#ebebeb',
                          borderWidth: 1,
                          backgroundColor: '#fff',
                        }}>
                          {
                            this.props.product.partInfo.brand.oem &&
                              <StyledLabelOem>
                                <Touchable onPress={openGallery}>
                                  <Icons name="OemGenuine" width={70} height={70} />
                                </Touchable>
                              </StyledLabelOem>
                          }
                          {
                            this.props.product.partInfo.attributes.is_best_offer &&
                            <StyledLabelBestOffer>
                              <Touchable onPress={openGallery}>
                                <View style={{position: 'relative'}}>
                                  <Icons name="BestOffer" fill={Colors.BEST_OFFER_LABEL} viewBox="0 0 186 54" width={124} height={48} />
                                  <Text style={{
                                    position: 'absolute',
                                    color: '#fff',
                                    fontSize: 17,
                                    top: Platform.OS === 'android' ? 11 : 13,
                                    paddingLeft: 8,
                                    backgroundColor: 'transparent',
                                    fontWeight: 'bold',
                                  }}>Best Offer</Text>
                                </View>
                              </Touchable>
                            </StyledLabelBestOffer>
                          }
                          {
                            imageUrl && !this.state.hideWarning ?
                              <Animated.View
                                style={[
                                  styles.representationWarning,
                                  {
                                    transform: [{scale: this.state.animatedWarningValue}],
                                    opacity: this.state.animatedWarningValue,
                                  }
                                ]}
                              >
                                <Touchable onPress={openGallery}>
                                  <Text
                                    style={{
                                      padding: 10,
                                      fontSize: 12,
                                      fontWeight: 'bold',
                                      color: '#e58e84',
                                      textAlign: 'center',
                                    }}
                                  >
                                    {'Image shown for representation purpose only'.toUpperCase()}
                                  </Text>
                                </Touchable>
                              </Animated.View>
                              : null
                          }
                          {
                            imageUrl ?
                              <View>
                                <Gallery
                                  ref={gallery => this.gallery = gallery}
                                  style={{
                                    width: this.props.screenWidth,
                                    height: 200,
                                    margin: 5,
                                  }}
                                  initialPage={this.state.activeImage}
                                  onPageSelected={(imageIndex) => {
                                    this._setActiveImage(imageIndex);
                                  }}
                                  images={[
                                    imageUrl
                                  ].concat(imageUrls)}
                                  onSingleTapConfirmed={openGallery}
                                />
                                {
                                  imageUrls.length > 0 &&
                                    <View style={{
                                      width: this.props.screenWidth,
                                      flexDirection: 'row',
                                      justifyContent: 'center',
                                      marginTop: 5,
                                      marginBottom: 10,
                                    }}>
                                      {[imageUrl].concat(imageUrls).map((image, i) =>
                                        <Touchable
                                          key={i}
                                          onPress={() => {
                                            this._setActiveImage(i);
                                            this.gallery.getViewPagerInstance().scrollToPage(i);
                                          }}
                                        >
                                          <View style={{
                                            width: 6,
                                            height: 6,
                                            marginLeft: 5,
                                            marginRight: 5,
                                            borderRadius: 50,
                                            backgroundColor: this.state.activeImage === i ? Colors.BUTTON_BLUE_ACTIVE : Colors.SEARCH_PLACEHOLDER,
                                          }} />
                                        </Touchable>
                                      )}
                                    </View>
                                }
                              </View>
                              :
                              null
                          }
                          {
                            this.props.product.mainSupplier ?
                              this.props.product.mainSupplier.discount ?
                                <View style={{
                                  position: 'absolute',
                                  right: 0,
                                  top: 10,
                                  backgroundColor: '#f43d2f',
                                  paddingTop: 5,
                                  paddingBottom: 5,
                                  paddingLeft: 10,
                                  paddingRight: 10,
                                }}>
                                  <Text style={{
                                    color: '#fff',
                                    fontSize: 15,
                                  }}>-{this.props.product.mainSupplier.discount}</Text>
                                </View>
                                :
                                null
                              : null
                          }
                        </View>
                        <View style={{
                          width: this.props.screenWidth,
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column',
                          backgroundColor: '#fff',
                          paddingTop: 20,
                          paddingBottom: 20,
                        }}>
                          {
                            this.props.product.partInfo && this.props.product.partInfo['name'] ?
                              <Text style={{
                                fontSize: 34,
                                color: '#000',
                                marginLeft: 20,
                                marginRight: 20,
                                alignSelf: 'flex-start'
                              }}
                              ellipsizeMode={'tail'}>{this.props.product.partInfo['name'] || ''}</Text>
                              : null
                          }

                          {
                            this.props.product.suppliersIsFetching ?
                              <LoadingIndicator
                                style={{
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  padding: 8,
                                  bottom: 20,
                                  left: 0,
                                  right: 0,
                                  height: 100,
                                }}
                                size="large"
                              />
                              :
                              <View>
                                {
                                  this.props.product.suppliersError ?
                                    <Button
                                      onPress={() => {
                                        this.props.actions.getSuppliers(this.props.route.partId);
                                      }}
                                      underlayColor={Colors.BUTTON_BLUE_ACTIVE}
                                      style={{
                                        width: 200,
                                        backgroundColor: Colors.BUTTON_BLUE,
                                        borderColor: Colors.BUTTON_BLUE,
                                      }}
                                      textStyle={{
                                        color: '#FFFFFF'
                                      }}>
                                      Try again
                                    </Button>
                                    :
                                    <View>
                                      <View
                                        style={{
                                          width: this.props.screenWidth,
                                          paddingRight: 20,
                                          paddingLeft: 20
                                        }}
                                      >
                                        <View style={styles.aboutItemWrapper}>
                                          {
                                            this.props.product.partInfo.number ?
                                              <Text style={{marginRight: 10, height: 20}}><Text style={{fontWeight: '700'}}>Part Number: </Text>{this.props.product.partInfo.number} </Text> : null
                                          }
                                          {
                                            this.props.product.partInfo.brand ?
                                              <Text style={{marginRight: 10, height: 20}}>
                                                <Text style={{fontWeight: '700'}}>Brand: </Text>
                                                <Text onPress={() => {
                                                  this.props.navigator.replacePreviousAndPop({
                                                    id: 'ResultPage',
                                                    selectedBrand: {
                                                      name: this.props.product.partInfo.brand.name ? this.props.product.partInfo.brand.name : null,
                                                      value: this.props.product.partInfo.brand.id ? this.props.product.partInfo.brand.id : null
                                                    }
                                                  });
                                                }}>
                                                  <Text style={{color: '#428bca'}}>{this.props.product.partInfo.brand.name ? this.props.product.partInfo.brand.name : null} </Text>
                                                </Text>
                                              </Text> : null
                                          }
                                          {
                                            this.props.product.partInfo.family && this.props.product.partInfo.family.name.toLowerCase() !== 'unknown' ?
                                              <Text style={{marginRight: 10, height: 20}}>
                                                <Text style={{fontWeight: '700'}}>Origin: </Text>{this.props.product.partInfo.origin}
                                              </Text> : null
                                          }
                                          {
                                            this.props.product.partInfo.family && this.props.product.partInfo.family.name.toLowerCase() !== 'unknown' ?
                                              <Text style={{flex: 1, height: 20}} ellipsizeMode={'tail'}>
                                                <Text style={{fontWeight: '700'}}>Class: </Text>{this.props.product.partInfo.family.name}
                                              </Text> : null
                                          }
                                        </View>
                                        <View style={styles.aboutItemWrapper}>
                                          {
                                            this.props.product.partInfo.attributes['is_in_oriparts'] ?
                                              <Touchable onPress={() => {
                                                this.props.actions.openOriPartNumber(true);
                                                this.props.navigator.push({
                                                  id: 'WebBrowser',
                                                  url: Config.ORI_URL + '/?search=' + this.props.product.partInfo.number
                                                });
                                              }}>
                                                <Text style={styles.wrapDrawingLink}>Show on drawing</Text>
                                              </Touchable> : null
                                          }
                                        </View>
                                        { hasSupplierProduct ?
                                          <View>
                                            <View>
                                              {
                                                this.props.product.mainSupplier.product.price ?
                                                  <StyledFlexRow>
                                                    <Text style={{
                                                      fontSize: 30,
                                                      color: '#3e6089',
                                                      fontWeight: '700',
                                                      marginTop: 5
                                                    }}>
                                                      Price: <Text style={{fontWeight: '500'}}>
                                                        {this.props.product.mainSupplier.product.price.currency.outputCurrency()} {this.props.product.mainSupplier.product.price.amount.formatPrice()}
                                                      </Text>
                                                    </Text>
                                                    {this.renderDiscount()}
                                                  </StyledFlexRow>
                                                  : null
                                              }
                                              <StyledFlexRow>
                                                {this.renderProductMrp()}
                                              </StyledFlexRow>
                                              <StyledFlexRow>
                                                <Image
                                                  style={{width: 32, height: 32}}
                                                  source={require('../../assets/delivery_truck_with_circular_clock.png')}
                                                />
                                                {
                                                  this.props.product.mainSupplier.delivery ?
                                                    <Text style={{
                                                      marginLeft: 10,
                                                      fontStyle: 'italic',
                                                      fontWeight: '700'
                                                    }}>
                                                      {this.props.product.mainSupplier.delivery.price && this.props.product.mainSupplier.delivery.price.amount == '0' ? 'Free Delivery' :
                                                        ('+' + this.props.product.mainSupplier.delivery.price.currency ? this.props.product.mainSupplier.delivery.price.currency.outputCurrency() : null) + (this.props.product.mainSupplier.delivery.price ? this.props.product.mainSupplier.delivery.price.amount.formatPrice() : null)}
                                                      <Text style={{
                                                        fontWeight: '400'
                                                      }}> (
                                                        {this.props.pinInfo && this.props.pinInfo.pin && this.props.pinInfo.city ? '' : 'dispatch '}within <Text style={{
                                                          fontWeight: '700',
                                                        }}>{this.props.product.mainSupplier.delivery.days} days</Text>)
                                                      </Text>
                                                    </Text>
                                                    : null
                                                }
                                              </StyledFlexRow>
                                              { this.props.assured_return_period ?
                                                <StyledFlexRow>
                                                  <Image
                                                    style={{width: 32, height: 32}}
                                                    source={require('../../assets/assured_return.png')}
                                                  />
                                                  <Text style={{
                                                    marginLeft: 10,
                                                    fontStyle: 'italic',
                                                    fontWeight: '700'
                                                  }}>{`${this.props.assured_return_period} days assured return`}</Text>
                                                </StyledFlexRow> : null
                                              }
                                            </View>
                                            <Button
                                              onPress={() => {
                                              // i am really sorry for this :(
                                                metricsProductPageAddToCartClick({
                                                  ecommerce: {
                                                    currencyCode: this.props.currentCurrency && this.props.currentCurrency.name,
                                                    add: {
                                                      actionField: {
                                                        list: 'ProductPage'
                                                      },
                                                      products: [{
                                                        id: this.props.product && this.props.product.partInfo && this.props.product.partInfo.id.toString() || null,
                                                        name: this.props.product && this.props.product.partInfo && this.props.product.partInfo.name || null,
                                                        category: this.props.product && this.props.product.partInfo && this.props.product.partInfo.family && this.props.product.partInfo.family.name || null,
                                                        dimension16: this.props.product && this.props.product.partInfo && this.props.product.partInfo.family && this.props.product.partInfo.family.id.toString() || null,
                                                        brand: this.props.product && this.props.product.partInfo && this.props.product.partInfo.brand && this.props.product.partInfo.brand.name || null,
                                                        variant: this.props.product && this.props.product.partInfo && this.props.product.partInfo.brand && this.props.product.partInfo.brand.oem,
                                                        price: this.props.product.mainSupplier.product.price.amount && this.props.product.mainSupplier.product.price.amount.toString() || null,
                                                        metric1: this.props.product.mainSupplier.product.price.amount && this.props.product.mainSupplier.product.price.amount.toString() || null,
                                                        quantity: this.props.product.mainSupplier.product.requested_qty || 0
                                                      }]
                                                    }
                                                  }
                                                });
                                                this._addToCart(this.props.product.mainSupplier);
                                              }}
                                              style={{
                                                marginTop: 10,
                                                backgroundColor: '#1bb839',
                                              }}
                                              textStyle={{
                                                color: '#fff',
                                              }}>
                                            ADD TO CART
                                            </Button>
                                            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 15}}>
                                              <Text style={{marginRight: 10, fontSize: 14, fontWeight: '700'}}>Availability at</Text>
                                              <TextInput
                                                style={{
                                                  display: 'flex',
                                                  justifyContent: 'center',
                                                  width: 115,
                                                  height: 30,
                                                  marginRight: 10,
                                                  paddingBottom: Platform.OS === 'android' ? 7 : null,
                                                  paddingLeft: 5,
                                                  lineHeight: 10,
                                                  borderColor: '#dce8ea',
                                                  borderWidth: 1,
                                                  borderRadius: 4,
                                                  fontSize: 12,
                                                }}
                                                maxLength={6}
                                                keyboardType="numeric"
                                                value={this.state.deliveryPin}
                                                underlineColorAndroid="transparent"
                                                placeholder="Enter your Pincode"
                                                onChangeText={(text) => {
                                                  this.setState({deliveryPin: text.replace(/[^0-9]/g, '').toString()});
                                                }}
                                              />
                                              <View style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                borderWidth: 2,
                                                borderRadius: 3,
                                                borderColor: this.state.deliveryPin.length >= 6 ? '#1b568e' : '#e6e7ea',
                                                height: 30,
                                                width: 70
                                              }}>
                                                <Touchable
                                                  onPress={() => {
                                                    if (!(this.state.deliveryPin.length >= 6)) {return;}
                                                    this.props.actions.getPinInfo(this.state.deliveryPin);
                                                    this.props.actions.getPartInfo(this.props.route.partId, this.state.deliveryPin);
                                                  }}
                                                >
                                                  <Text style={{
                                                    color: this.state.deliveryPin.length >= 6 ? '#1b568e' : '#e6e7ea',
                                                    alignSelf: 'center',
                                                    fontSize: 14,
                                                    display: 'flex',
                                                    fontWeight: '700'
                                                  }}>CHECK</Text>
                                                </Touchable>
                                              </View>
                                            </View>
                                          </View> : null
                                        }

                                        {/* City */}

                                        {
                                          // hasSupplierProduct && this.props.deliveryInfo && this.props.deliveryInfo.pin === this.state.deliveryPin && this.props.deliveryInfo.city.length > 0 && !this.props.pinInfo &&
                                          // <Text style={{marginTop: 5, marginLeft: 100}}>{this.props.deliveryInfo.city}</Text>
                                        }
                                        {
                                          hasSupplierProduct && this.props.pinInfo && this.props.pinInfo.pin.toString() === this.state.deliveryPin &&
                                          <Text style={{marginTop: 5, marginLeft: 100}}>
                                            {this.props.pinInfo.city ? this.props.pinInfo.city : Messages.validation.pin.unknown}
                                          </Text>
                                        }
                                        { hasSupplierProduct &&
                                          <View>
                                            <Text style={{
                                              fontWeight: '500',
                                              fontSize: 14,
                                              marginTop: 20
                                            }}>
                                              SOLD BY: {this.props.product.mainSupplier.product.seller && this.props.product.mainSupplier.product.seller.name}
                                            </Text>
                                          </View>
                                        }

                                        <View>
                                          {
                                            this.props.product.suppliers && this.props.product.suppliers.length > 1 ?
                                              <Touchable onPress={() => {
                                                _scrollView.scrollTo({y: this.state.soldByPositionY});
                                              }}>
                                                <Text style={styles.link}>
                                                  view offers from {this.props.product.suppliers && this.props.product.suppliers.length} sellers
                                                </Text>
                                              </Touchable> : null
                                          }
                                          {
                                            this.props.product.compatibility.count !== 0 ?
                                              <Touchable onPress={this._pressCompatibility}>
                                                <Text style={styles.link}>
                                                  view compatibility
                                                </Text>
                                              </Touchable> : null
                                          }
                                          {
                                            this.props.product.aftermarketParts.count !== 0 ?
                                              <Touchable onPress={this._pressAftermarketParts}>
                                                <Text style={styles.link}>
                                                  view replacements from {sortedForReplacements[0].price}
                                                </Text>
                                              </Touchable> : null
                                          }
                                        </View>
                                      </View>
                                    </View>
                                }
                              </View>
                          }
                        </View>
                      </View>
                      {featuresAndSpecs.length ?
                        <WrapItem
                          toggle={false}
                          title={'FEATURES AND SPECS'}>
                          {featuresAndSpecs.map((v) => <LabelValue separated={true}
                            label={v.label || null}
                            value={v.value || null}
                            key={v.label || null}/>)}
                        </WrapItem>
                        : null
                      }
                      {
                        this.props.product.partInfo && this.props.product.partInfo.attributes['description'] ?
                          <WrapItem
                            title={'DESCRIPTION'}
                            toggle={false}>
                            <View>
                              <Text>
                                {this.props.product.partInfo.attributes['description']}
                              </Text>
                            </View>
                          </WrapItem>
                          :
                          null
                      }
                      { (
                        this.props.product.suppliers && this.props.product.suppliers.length === 0 &&
                        this.props.product.oemParts.count === 0 &&
                        this.props.product.compatibility.count === 0
                      ) ?
                        null
                        :
                        <WrapItem
                          toggle={false}
                          title={false}>
                          <MorePartsValue
                            label="Aftermarket replacement parts"
                            partsType="replacements"
                            loading={this.props.product.replacementsIsFetching}
                            length={this.props.product.aftermarketParts.count}
                            items={sortedForReplacements}
                            action={this._pressAftermarketParts}
                            error={this.props.product.replacementsError}
                            onRefreshClick={() => {
                              this.props.actions.getReplacements(this.props.route.partId);
                            }}
                          />
                          {this.props.product.oemParts.count > 0 ?
                            <View style={{
                              backgroundColor: Colors.SEPARATOR,
                              height: 1,
                              marginTop: 15,
                              marginBottom: 5,
                            }}/>
                            : null
                          }
                          <MorePartsValue
                            label="OEM replacement parts"
                            partsType="replacements"
                            loading={this.props.product.replacementsIsFetching}
                            length={this.props.product.oemParts.count}
                            items={this.props.product.oemParts.items}
                            action={this._pressOemParts}
                            error={false}
                            onRefreshClick={() => {
                            }}
                          />
                          {this.props.product.compatibility.count > 0 && (this.props.product.aftermarketParts.count > 0 || this.props.product.oemParts.count > 0) ?
                            <View style={{
                              backgroundColor: Colors.SEPARATOR,
                              height: 1,
                              marginTop: 15,
                              marginBottom: 5,
                            }}/>
                            : null
                          }
                          <View
                            onTouchStart={() => {
                              metricsProductPageApplicabilityClick(
                                this.props.product && this.props.product.partInfo && this.props.product.partInfo.number,
                                this.props.product && this.props.product.partInfo && this.props.product.partInfo.family && this.props.product.partInfo.family.id.toString()
                              );
                            }}
                          >
                            <MorePartsValue
                              label="Applicability"
                              partsType="compatibility"
                              loading={this.props.product.compatibilityIsFetching}
                              length={this.props.product.compatibility.count}
                              items={this.props.product.compatibility.items}
                              action={this._pressCompatibility}
                              error={this.props.product.compatibilityError}
                              onRefreshClick={() => {
                                this.props.actions.getCompatibility(this.props.route.partId);
                              }}
                            />
                          </View>

                        </WrapItem>
                      }
                      {
                        this.props.product.suppliersIsFetching ?
                          <LoadingIndicator
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: 8,
                              bottom: 20,
                              left: 0,
                              right: 0,
                              height: 100,
                            }}
                            size="large"
                          />
                          :
                          <View
                            ref={item => this.soldBy = item}
                            onLayout={(event) => {
                              this.setState({
                                scrollToY: event.nativeEvent.layout.y - 110,
                                soldByPositionY: event.nativeEvent.layout.y,
                                collapsedHeight: event.nativeEvent.layout.height
                              });
                            }}
                          >
                            { this.props.product.suppliers && this.props.product.suppliers.length > 0 ?
                              <WrapItem
                                total={this.props.product.suppliers.length}
                                toggle={true}
                                fastest={this.displaySuppliers(fastest)}
                                toggled={(collapsed) => {
                                  if (!collapsed) {
                                    _scrollView.scrollTo({y: this.state.scrollToY});
                                  } else {
                                    _scrollView.scrollTo({y: this.state.scrollToY - this.state.collapsedHeight});
                                  }
                                }}
                                title={'SOLD BY'}>
                                {this.displaySuppliers(this._getSuppliersForSold())}
                              </WrapItem>
                              : null}
                          </View>
                      }
                    </ScrollView>
                }
              </View>
          }
        </View>
      </View>
    );
  }
}

const StyledFlexRow = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
`;

const StyledDiscount = styled.Text`
  padding: 6px;
  color: #fff;
  font-size: 11px;
  font-weight: bold;
`;

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
    connected: state.network.connected,
    platformOS: state.device.platformOS,
    screenWidth: state.device.screenWidth,
    screenHeight: state.device.screenHeight,
    iosBarHeader: state.device.iosBarHeader,
    headerHeight: state.device.headerHeight,
    product: state.product,
    deliveryInfo: state.checkout.deliveryInfo,
    pinInfo: state.product.pinInfo,
    count: state.cart.count,
    total: state.cart.total,
    currentCurrency: state.user.currentCurrency,
    assured_return_period: state.product.assured_return_period
  };
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({...productActions, ...cartActions, changeCurrentCurrency, openOriPartNumber}, dispatch)};
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Product);
