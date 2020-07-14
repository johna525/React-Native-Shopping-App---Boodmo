import React, {Component} from 'react';
import {
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  View,
  ListView,
  Image,
  Platform
} from 'react-native';
import LoadingIndicator from '../../components/LoadingIndicator';
import ActionBar from '../../components/ActionBar';
import Icon from 'react-native-vector-icons/FontAwesome';
import Button from '../../components/Button';
import styles from './styles';
import {changeCurrentCurrency} from '../../actions/User';
import styled from 'styled-components/native';

const Touchable = Platform.OS === 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableOpacity;
require('../../utils/Helper');

import {metricsSearchResFilterClick} from '../../utils/metrics';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as partsActions from '../../actions/Parts';
import * as productActions from '../../actions/Product';
import * as Log from '../../actions/Log';
import * as Events from '../../constants/Events';
import * as Config from '../../constants/Config';
import * as Messages from '../../constants/Messages';

import * as Colors from '../../constants/Colors';
import Icons from '../../components/Icons';

class Results extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.id !== r2.id
    });
    this.state = {
      ds,
      dataSource: ds.cloneWithRows([])
    };
    this.redirected = false;
    this.currentPage = 1;
  }

  componentDidMount() {
    this.getParts();
    this.props.actions.clearProductInfo();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentCurrency.value !== nextProps.currentCurrency.value) {
      this.getParts(1);
    }
    this.setState({
      dataSource: this.state.ds.cloneWithRows(nextProps.items)
    });
    if (nextProps.total === 1 && !this.redirected) {
      this._pressRow(nextProps.items[0].id);
      this.redirected = true;
    }
    this.headerTitle = [];
    if (this.props.route.keyword) {
      this.headerTitle.push(this.props.route.keyword);
    }
    [
      this.props.route.selectedCarMaker,
      this.props.route.selectedModel,
    ].forEach((v) => {
      if (v) {
        this.headerTitle.push(v.name);
      }
    });
    this.headerTitle = this.headerTitle.join(' / ');
    if (nextProps.fetched && nextProps.total === 0) {
      Log.logEvent(Events.EVENT_SEARCH_NOTHING_FOUND);
    }
  }


    getParts = (page = this.currentPage) => {
      let category = null;

      if (this.props.route.selectedSubSubCategory) {
        category = this.props.route.selectedSubSubCategory.value;
      } else if (this.props.route.selectedSubCategory) {
        category = this.props.route.selectedSubCategory.value;
      } else if (this.props.route.selectedCategory) {
        category = this.props.route.selectedCategory.value;
      }

      this.props.actions.getParts({
        keyword: this.props.route.keyword,
        after_ori: !!this.props.route.after_ori,
        sorted_by: this.props.route.sortedBy ? this.props.route.sortedBy.value : Config.DEFAULT_SORTED_BY.value,
        car_maker_id: this.props.route.selectedCarMaker ? this.props.route.selectedCarMaker.value : null,
        model_id: this.props.route.selectedModel ? this.props.route.selectedModel.value : null,
        year_value: this.props.route.selectedYear ? this.props.route.selectedYear.value : null,
        modification_id: this.props.route.selectedModification ? this.props.route.selectedModification.value : null,
        model_line_id: this.props.route.selectedModelLine ? this.props.route.selectedModelLine.value : null,
        brand_id: this.props.route.selectedBrand ? this.props.route.selectedBrand.value : null,
        family_id: this.props.route.selectedFamily ? this.props.route.selectedFamily.value : null,
        category_id: category ? category : null,
        price_range_min: this.props.route.priceRangeMin,
        price_range_max: this.props.route.priceRangeMax,
        page
      });
    };

    _pressRow(partId, rowID = '1') {
      this.props.navigator.push({
        id: 'ProductPage',
        partId: partId,
        position: rowID
      });
    }

    _renderRow(rowData, sectionID, rowID, highlightRow) {
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
      let price = rowData.price ? rowData.price.amount : null;
      return (
        <Touchable activeOpacity={0.5}
          onPress={() => {
            highlightRow(sectionID, rowID);
            this._pressRow(rowData.id, rowID);
          }}>
          <View style={[styles.part, {
            flexDirection: 'row',
          }]}>
            <View style={{position: 'relative'}}>
              {
                rowData.brand.oem &&
                <StyledLabelOem>
                  <Icons name="OemGenuine" viewBox="0 -8 284 284"/>
                </StyledLabelOem>
              }
              {
                rowData.attributes.is_best_offer &&
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
              {getImageItem(rowData.image)}
            </View>
            <View style={styles.partDescription}>
              {
                rowData.name ?
                  <Text style={styles.partName}>{rowData.name}</Text>
                  : null
              }
              {rowData.price ?
                <Text
                  style={styles.partPrice}>{rowData.price && rowData.price.currency ? rowData.price.currency.outputCurrency() : null} {price ? price.formatPrice(false) : null}</Text>
                : null
              }
              {getTextItem('Part Number', rowData.number)}
              {getTextItem('Brand', rowData.brand ? (rowData.brand.name || null) : null)}
              {rowData.family ? (rowData.family.name.toLowerCase() !== 'unknown' ? getTextItem('Class', rowData.family.name) : null) : null}
            </View>
          </View>
        </Touchable>
      );
    }

    _renderFooter() {
      let footerHeight = this.props.platformOS === 'ios' ? 100 : 70;
      return (
        <View style={{
          height: this.props.items.length === this.props.total && this.props.total > 0 ? 50 : footerHeight,
          marginHorizontal: 10,
        }}>
          {
            this.props.isFetching && this.props.total !== '' ?
              <LoadingIndicator
                style={styles.footerLoadingIndicator}
                size="large"
              />
              : null
          }
          {
            !this.props.connected ?
              <Text style={{textAlign: 'center'}}>
                {Messages.offline}
              </Text>
              :
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                {
                  this.props.error ?
                    <Button
                      onPress={() => {
                        this.getParts();
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
                    : null
                }
              </View>

          }
        </View>
      );
    }

    handleEndReach = () => {
      if (this.props.connected) {
        if (this.props.items.length < this.props.total && this.props.fetched) {
          this.currentPage += 1;
          this.getParts();
        }
      }
    };

    render() {
      return (
        <View style={styles.container}>
          {this.props.platformOS === 'ios' ? <View style={styles.iosStatusBar}/> : null}
          <ActionBar
            title={this.headerTitle}
            navigator={this.props.navigator}
            total={this.props.cartTotal}
            onBackPress={() => {
              this.props.actions.openOriPartNumber(true);
            }}
            openDrawer={() => this.props.openDrawer()}>
          </ActionBar>
          {
            this.props.isFetching && this.props.total === '' ?
              <LoadingIndicator
                style={styles.footerLoadingIndicator}
                size="large"
              />
              : null
          }
          {
            this.props.total > 0 ?
              <View style={styles.actionsContainer}>
                <View style={styles.resultsText}>
                  <Text>{(this.props.total) ? `${this.props.total} RESULTS FOUND` : null}</Text>
                </View>
                <Touchable
                  hitSlop={{top: 0, left: 10, bottom: 10, right: 10}}
                  onPress={() => {
                    metricsSearchResFilterClick();
                    Log.logEvent(Events.EVENT_FILTER);
                    this.props.navigator.push({
                      id: 'FilterPage',
                      keyword: this.props.route.keyword,
                      sortedBy: this.props.route.sortedBy ? this.props.route.sortedBy : Config.DEFAULT_SORTED_BY,
                      selectedCarMaker: this.props.route.selectedCarMaker ? this.props.route.selectedCarMaker : null,
                      selectedModel: this.props.route.selectedModel ? this.props.route.selectedModel : null,
                      selectedYear: this.props.route.selectedYear ? this.props.route.selectedYear : null,
                      selectedModelLine: this.props.route.selectedModelLine ? this.props.route.selectedModelLine : null,
                      selectedModification: this.props.route.selectedModification ? this.props.route.selectedModification : null,
                      selectedBrand: this.props.route.selectedBrand ? this.props.route.selectedBrand : null,
                      selectedFamily: this.props.route.selectedFamily ? this.props.route.selectedFamily : null,
                      selectedCategory: this.props.route.selectedCategory ? this.props.route.selectedCategory : null,
                      selectedSubCategory: this.props.route.selectedSubCategory ? this.props.route.selectedSubCategory : null,
                      selectedSubSubCategory: this.props.route.selectedSubSubCategory ? this.props.route.selectedSubSubCategory : null,
                      priceRangeMin: this.props.route.priceRangeMin ? this.props.route.priceRangeMin : null,
                      priceRangeMax: this.props.route.priceRangeMax ? this.props.route.priceRangeMax : null,
                    });
                  }}>
                  <View style={styles.filterWrapper}>
                    <Text style={styles.filterText}>FILTER</Text>
                    <Icon style={styles.filterIcon} name="filter" size={20}/>
                  </View>
                </Touchable>
              </View>
              : null
          }
          <View
            style={[styles.wrapper, {
              height: this.props.screenHeight
                        - this.props.headerHeight
                        - this.props.iosBarHeader
                        - (this.props.isFetching && this.props.connected ? 50 : 0)
            }]}>
            {
              this.props.fetched && this.props.total === 0 ?
                <View style={{alignItems: 'center'}}>
                  <Text style={[styles.infoText, {fontSize: 20}]}>Sorry, nothing is found.</Text>
                  <Text style={styles.infoText}>
                    We will check your request and add information on our website as soon as possible.
                  </Text>
                  <Text style={styles.infoText}>
                    Meanwhile, try to find required product by car applicability
                  </Text>
                </View>
                :
                <ListView
                  dataSource={this.state.dataSource}
                  renderRow={this._renderRow.bind(this)}
                  renderSeparator={null}
                  enableEmptySections={true}
                  renderFooter={this._renderFooter.bind(this)}
                  removeClippedSubviews={false}
                  onEndReached={() => {
                    this.handleEndReach();
                  }}
                  onEndReachedThreshold={100}
                />
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
    screenWidth: state.device.screenWidth,
    screenHeight: state.device.screenHeight,
    iosBarHeader: state.device.iosBarHeader,
    headerHeight: state.device.headerHeight,
    isFetching: state.parts.isFetching,
    fetched: state.parts.fetched,
    total: state.parts.total,
    error: state.parts.error,
    items: state.parts.items,
    cartTotal: state.cart.total,
    currentCurrency: state.user.currentCurrency,
  };
}

const StyledLabelOem = styled.View`
    position: absolute;
    top: 0;
    right: 0;
    z-index: 100;
`;
const StyledLabelBestOffer = styled.View`
    position: absolute;
    top: 10;
    left: 0;
    z-index: 100;
`;

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({...partsActions, ...productActions, changeCurrentCurrency}, dispatch)};
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Results);
