import React, {Component} from 'react';
import {
  Text,
  View,
  ScrollView
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Button from '../../components/Button';
import ActionBar from '../../components/ActionBar';
import WrapItem from './components/WrapItem';
import Item from './components/Item';
import styles from './styles';
import * as Config from '../../constants/Config';
import * as Colors from '../../constants/Colors';
import * as filterActions from '../../actions/Filter';
import {metricsFilterButtonsClick} from '../../utils/metrics';
import * as Betaout from '../../actions/Betaout';

class Filter extends Component {
  constructor(props) {
    super(props);
    this.sortingMethods = [
      {value: 'popular_desc', name: 'New and popular'},
      {value: 'asc', name: 'Price: Low to High'},
      {value: 'desc', name: 'Price: High to Low'}
    ];
    this.state = {
      sortedBy: Config.DEFAULT_SORTED_BY,
      keyword: null,
      selectedCarMaker: null,
      selectedYear: null,
      selectedModel: null,
      selectedModelLine: null,
      selectedModification: null,
      selectedBrand: null,
      selectedFamily: null,
      selectedCategory: null,
      selectedSubCategory: null,
      selectedSubSubCategory: null,
      priceRangeMin: null,
      priceRangeMax: null,
    };
  }

  componentDidMount() {
    this.setParameters();
    this.props.actions.receiveFilterCarMakers(this.props.vehicles.carMakers);
    this.props.actions.receiveFilterYears(this.props.vehicles.years);
    this.props.actions.receiveFilterModels(this.props.vehicles.models);
    this.props.actions.receiveFilterModifications(this.props.vehicles.modifications);

    if (!this.props.filter.carMakers.length) {
      this.props.actions.getFilterCarMakers();
    }
    if (this.props.route.selectedCarMaker) {
      this.props.actions.getFilterYears(this.props.route.selectedCarMaker);
      if (this.props.route.selectedYear && !this.props.route.selectedModel) {
        this.props.actions.getFilterModels(this.props.route.selectedCarMaker, this.props.route.selectedYear);
      }
    }

    if (this.props.route.selectedBrand) {
      if (this.props.route.selectedBrand['name'] === '' && this.props.route.selectedBrand['value']) {
        let brand = this.props.filter.brands.filter((brand) => {
          return brand['value'] === this.props.route.selectedBrand['value'];
        })[0];
        this.setState({
          selectedBrand: brand || null
        });
      }
    }
  }

  componentWillReceiveProps(props) {
    if (props.filter.selectedModelLine && !this.state.selectedModelLine) {
      this.setState({
        selectedModelLine: props.filter.selectedModelLine
      });
    }
  }

  setParameters() {
    this.setState({
      keyword: this.props.route.keyword,
      sortedBy: this.props.route.sortedBy,
      selectedCarMaker: this.props.route.selectedCarMaker,
      selectedYear: this.props.route.selectedYear,
      selectedModel: this.props.route.selectedModel,
      selectedModelLine: this.props.route.selectedModelLine,
      selectedModification: this.props.route.selectedModification,
      selectedBrand: this.props.route.selectedBrand,
      selectedFamily: this.props.route.selectedFamily,
      selectedCategory: this.props.route.selectedCategory,
      selectedSubCategory: this.props.route.selectedSubCategory,
      selectedSubSubCategory: this.props.route.selectedSubSubCategory,
      priceRangeMin: this.props.route.priceRangeMin,
      priceRangeMax: this.props.route.priceRangeMax,
    });
  }

  resetParameters() {
    this.props.actions.clearFilterModelLine();
    this.state = {
      sortedBy: Config.DEFAULT_SORTED_BY,
      selectedCarMaker: null,
      selectedYear: null,
      selectedModel: null,
      selectedModelLine: null,
      selectedModification: null,
      selectedBrand: null,
      selectedFamily: null,
      selectedCategory: null,
      selectedSubCategory: null,
      selectedSubSubCategory: null,
      priceRangeMin: null,
      priceRangeMax: null,
    };
  }

  applyFilters = () => {
    const {user} = this.props;

    metricsFilterButtonsClick(true);
    if (this.state.selectedModification && user.signedIn) {
      let modificationId = this.state.selectedModification.value;

      modificationId += this.state.selectedModification.parent_slug ? `-${this.state.selectedModification.parent_slug}-${this.state.selectedModification.slug}/` : '-/';

      Betaout.updateProperties({
        modificationnameview: `${this.state.selectedCarMaker.name} ${this.state.selectedModel.name} ${this.state.selectedModification.name.split('/')[0]}`,
        modificationfullurlview: this.state.selectedModification.url || '',
        modificationidview: modificationId,
        modificationpicview: this.state.selectedModification.imageUrl || '',
        modificationisfinview: user.car_is_finished && user.car_is_finished.toString() || '0',
      });
    }
    this.props.actions.setResetFilterForm({
      carMakers: this.state.carMakers,
      modelLines: this.state.modelLines,
      models: this.state.models,
    });
    this.props.navigator.replacePreviousAndPop({
      id: 'ResultPage',
      keyword: this.state.keyword,
      sortedBy: this.state.sortedBy,
      selectedCarMaker: this.state.selectedCarMaker,
      selectedYear: this.state.selectedYear,
      selectedModel: this.state.selectedModel,
      selectedModelLine: this.state.selectedModelLine,
      selectedModification: this.state.selectedModification,
      selectedBrand: this.state.selectedBrand,
      selectedFamily: this.state.selectedFamily,
      selectedCategory: this.state.selectedCategory,
      selectedSubCategory: this.state.selectedSubCategory,
      selectedSubSubCategory: this.state.selectedSubSubCategory,
      priceRangeMin: this.state.priceRangeMin,
      priceRangeMax: this.state.priceRangeMax
    });
  };

  render() {
    return (
      <View style={styles.container}>
        {this.props.platformOS === 'ios' ? <View style={styles.iosStatusBar}/> : null}
        <ActionBar
          title={'FILTER RESULTS'}
          navigator={this.props.navigator}
          onBackPress={() => {
            this.props.actions.clearFilterModelLine();
          }}
          openDrawer={() => this.props.openDrawer()}/>
        <View style={styles.wrapper}>
          <ScrollView style={{height: 10}}>
            <View>
              { this.props.filter.enableSorting ?
                <WrapItem>
                  <Item
                    removeOpacity={true}
                    type={'select'}
                    title={'SORT BY:'}
                    placeholder={'Select type'}
                    data={this.sortingMethods}
                    selectedValue={this.state.sortedBy}
                    onValueChange={(sortedBy) => {
                      this.setState({
                        sortedBy
                      });
                    }}
                    onClearClick={() => {
                      this.setState({
                        sortedBy: null
                      });
                    }}
                  />
                </WrapItem>
                : null
              }
              <WrapItem>
                <Text style={{
                  paddingVertical: 15
                }}>APPLICABILITY</Text>
                <View style={styles.separator} />
                <Item
                  removeOpacity={true}
                  type={'select'}
                  style={{marginTop: 10, marginBottom: 10}}
                  title={'CAR MAKER:'}
                  placeholder={'Select car maker'}
                  data={this.props.filter.carMakers}
                  loading={this.props.filter.carMakersIsFetching}
                  error={this.props.filter.carMakersError}
                  disabled={!this.props.filter.carMakers.length || !this.props.connected}
                  selectedValue={this.state.selectedCarMaker}
                  onValueChange={(selectedCarMaker) => {
                    this.setState({
                      selectedCarMaker
                    });
                  }}
                  onSubmitClick={(search) => {
                    this.props.actions.selectFilterCarMaker();
                    if (search && this.props.connected) {
                      this.props.actions.getFilterYears(this.state.selectedCarMaker);
                    }
                    this.setState({
                      selectedYear: null,
                      selectedModel: null,
                      selectedModification: null,
                    });
                  }}
                  onClearClick={() => {
                    this.props.actions.clearFilterCarMaker();
                    this.setState({
                      selectedCarMaker: null,
                      selectedYear: null,
                      selectedModel: null,
                      selectedModification: null,
                    });
                  }}
                />
                <View style={styles.separator} />
                <Item
                  removeOpacity={true}
                  type={'select'}
                  style={{marginTop: 10, marginBottom: 10}}
                  title={'YEAR:'}
                  placeholder={'Select year'}
                  data={this.props.filter.years}
                  error={false}
                  disabled={!this.props.filter.years.length || !this.state.selectedCarMaker || !this.props.connected}
                  selectedValue={this.state.selectedCarMaker ? this.state.selectedYear : null}
                  onValueChange={(selectedYear) => {
                    this.setState({
                      selectedYear
                    });
                  }}
                  onSubmitClick={() => {
                    this.props.actions.selectFilterYear();

                    if (this.props.connected) {
                      this.props.actions.getFilterModels(this.state.selectedCarMaker, this.state.selectedYear);
                    }

                    this.setState({
                      selectedModel: null,
                      selectedModification: null,
                    });
                  }}
                  onClearClick={() => {
                    this.props.actions.clearFilterYear();
                    this.setState({
                      selectedModel: null,
                      selectedModification: null,
                    });
                  }}
                />
                <View style={styles.separator} />
                <Item
                  removeOpacity={true}
                  type={'select'}
                  style={{marginTop: 10, marginBottom: 10}}
                  title={'MODEL:'}
                  placeholder={'Select model'}
                  data={this.props.filter.models}
                  loading={this.props.filter.modelsIsFetching}
                  error={this.props.filter.modelsError}
                  disabled={!this.props.filter.models.length || !this.state.selectedYear || !this.props.connected}
                  selectedValue={this.state.selectedModel}
                  onValueChange={(selectedModel) => {
                    this.setState({
                      selectedModel
                    });
                  }}
                  onSubmitClick={(search) => {
                    this.props.actions.selectFilterModel();
                    if (search && this.props.connected) {
                      this.props.actions.getFilterModifications(this.state.selectedModel, this.state.selectedYear);
                    }
                    this.setState({
                      selectedModification: null,
                    });
                  }}
                  onClearClick={() => {
                    this.props.actions.clearFilterModel();
                    this.setState({
                      selectedModel: null,
                      selectedModification: null,
                    });
                  }}
                />
                <View style={styles.separator} />
                <Item
                  removeOpacity={true}
                  type={'select'}
                  style={{marginTop: 10, marginBottom: 10}}
                  title={'MODIFICATION:'}
                  placeholder={'Select modification'}
                  data={this.props.filter.modifications}
                  loading={this.props.filter.modificationsIsFetching}
                  error={this.props.filter.modificationsError}
                  disabled={!this.props.filter.modifications.length || !this.state.selectedModel || !this.props.connected}
                  selectedValue={this.state.selectedModification}
                  onValueChange={(selectedModification) => {
                    this.setState({
                      selectedModification
                    });
                  }}
                  onSubmitClick={() => {
                    this.props.actions.selectFilterModification();
                  }}
                  onClearClick={() => {
                    this.props.actions.clearFilterModification();
                    this.setState({
                      selectedModification: null
                    });
                  }}
                />
              </WrapItem>
              <WrapItem>
                <Item
                  removeOpacity={true}
                  type={'select'}
                  title={'CATEGORY:'}
                  placeholder={'Select category'}
                  disabled={!this.props.filter.categories.length}
                  data={this.props.filter.categories}
                  selectedValue={this.state.selectedCategory}
                  onValueChange={(selectedCategory) => {
                    this.setState({
                      selectedCategory
                    });
                  }}
                  onSubmitClick={() => {
                    this.props.actions.selectFilterCategory();
                    this.props.actions.getFilterSubCategories(this.state.selectedCategory);
                    this.setState({
                      selectedSubCategory: null,
                      selectedSubSubCategory: null
                    });
                  }}
                  onClearClick={() => {
                    this.props.actions.clearFilterCategory();
                    this.setState({
                      selectedCategory: null,
                      selectedSubCategory: null,
                      selectedSubSubCategory: null
                    });
                  }}
                />
                {
                  this.state.selectedCategory && this.props.filter.subCategories.length > 0 ?
                    <View>
                      <View style={styles.separator} />
                      <Item
                        removeOpacity={true}
                        type={'select'}
                        title={''}
                        placeholder={'Select sub-category'}
                        disabled={!this.props.filter.subCategories.length}
                        data={this.props.filter.subCategories}
                        selectedValue={this.state.selectedSubCategory}
                        onValueChange={(selectedSubCategory) => {
                          this.setState({
                            selectedSubCategory
                          });
                        }}
                        onSubmitClick={() => {
                          this.props.actions.selectFilterSubCategory();
                          this.props.actions.getFilterSubSubCategories(this.state.selectedSubCategory);
                          this.setState({
                            selectedSubSubCategory: null
                          });
                        }}
                        onClearClick={() => {
                          this.props.actions.clearFilterSubCategory();
                          this.setState({
                            selectedSubCategory: null,
                            selectedSubSubCategory: null
                          });
                        }}
                      />
                    </View>
                    : null
                }
                {
                  this.state.selectedSubCategory && this.props.filter.subSubCategories.length > 0 ?
                    <View>
                      <View style={styles.separator} />
                      <Item
                        removeOpacity={true}
                        type={'select'}
                        title={''}
                        placeholder={'Select sub-sub-category'}
                        disabled={!this.props.filter.subSubCategories.length}
                        data={this.props.filter.subSubCategories}
                        selectedValue={this.state.selectedSubSubCategory}
                        onValueChange={(selectedSubSubCategory) => {
                          this.setState({
                            selectedSubSubCategory
                          });
                        }}
                        onSubmitClick={() => {
                        }}
                        onClearClick={() => {
                          this.setState({
                            selectedSubSubCategory: null
                          });
                        }}
                      />
                    </View>
                    : null
                }
              </WrapItem>
              <WrapItem>
                <Item
                  removeOpacity={true}
                  type={'select'}
                  title={'CLASS:'}
                  placeholder={'Select class'}
                  disabled={!this.props.filter.family.length}
                  data={this.props.filter.family}
                  selectedValue={this.state.selectedFamily}
                  onValueChange={(selectedFamily) => {
                    this.setState({
                      selectedFamily
                    });
                  }}
                  onSubmitClick={() => {
                  }}
                  onClearClick={() => {
                    this.setState({
                      selectedFamily: null
                    });
                  }}
                />
              </WrapItem>
              <WrapItem>
                <Item
                  removeOpacity={true}
                  type={'select'}
                  title={'BRAND:'}
                  placeholder={'Select brand'}
                  disabled={!this.props.filter.brands.length}
                  data={this.props.filter.brands}
                  selectedValue={this.state.selectedBrand}
                  onValueChange={(selectedBrand) => {
                    this.setState({
                      selectedBrand
                    });
                  }}
                  onSubmitClick={() => {
                  }}
                  onClearClick={() => {
                    this.setState({
                      selectedBrand: null
                    });
                  }}
                />
              </WrapItem>
              <WrapItem style={styles.lastWrapItem}>
                <Item
                  removeOpacity={true}
                  type={'range'}
                  title={'PRICE RANGE:'}
                  price_range_min={this.state.priceRangeMin}
                  price_range_max={this.state.priceRangeMax}
                  onMinChange={(priceRangeMin) => {
                    this.setState({
                      priceRangeMin
                    });
                  }}
                  onMaxChange={(priceRangeMax) => {
                    this.setState({
                      priceRangeMax
                    });
                  }}
                  placeholder={
                    (this.state.priceRangeMin == null && this.state.priceRangeMax == null)
                      ? 'All'
                      : `${this.state.priceRangeMin || ''} - ${this.state.priceRangeMax || ''}`
                  }/>
              </WrapItem>
            </View>
          </ScrollView>
          <View>
            <WrapItem style={styles.buttonsContainer}>
              <Button
                onPress={() => {
                  metricsFilterButtonsClick(false);
                  this.props.actions.resetFilter();
                  this.resetParameters();
                }}
                underlayColor={`${Colors.BUTTON_GREY}50`}
                style={[
                  styles.button,
                  {
                    backgroundColor: 'transparent',
                    borderColor: Colors.BUTTON_GREY
                  }
                ]}
                textStyle={[
                  styles.buttonText,
                  {
                    color: Colors.BUTTON_GREY
                  }
                ]}>
                  RESET
              </Button>
              <Button
                disabled={!this.state.selectedCarMaker && !this.state.keyword}
                onPress={this.applyFilters}
                style={[
                  styles.button,
                  {
                    backgroundColor: Colors.BUTTON_BLUE,
                    borderColor: Colors.BUTTON_BLUE
                  }
                ]}
                underlayColor={Colors.BUTTON_BLUE_ACTIVE}
                textStyle={[
                  styles.buttonText,
                  {
                    color: '#fff'
                  }
                ]}>
                  APPLY
              </Button>
            </WrapItem>
          </View>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    connected: state.network.connected,
    platformOS: state.device.platformOS,
    filter: state.filter,
    vehicles: state.vehicles,
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({...filterActions}, dispatch)};
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Filter);
