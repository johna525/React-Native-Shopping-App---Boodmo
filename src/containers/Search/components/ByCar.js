import React, {Component} from 'react';
import {
  View,
  ScrollView,
  Text,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as Config from '../../../constants/Config';
import SelectInput from '../../../components/SelectInput';
import Button from '../../../components/Button';
import * as sweetAlertActions from '../../../actions/SweetAlert';
import * as vehiclesActions from '../../../actions/Vehicles';
import * as filterActions from '../../../actions/Filter';
import * as Betaout from '../../../actions/Betaout';
import * as Log from '../../../actions/Log';
import * as Events from '../../../constants/Events';
import messages from '../../../constants/Messages';
import * as Url from '../../../utils/Url';

const styles = require('../styles');
const SOURCE = Platform.OS === 'android' ? Config.ANDROID_SOURCE : Config.IOS_SOURCE;

class ByCar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedCarMaker: null,
      selectedCarMakerVin: null,
      selectedYear: null,
      selectedModel: null,
      selectedModification: null,
      vinNumber: null,
      vinNumberValid: true,
      partNumber: null,
    };
  }


  render() {
    const {user} = this.props;
    const sendModificationBO = () => {
      if (!!this.state.selectedModification && user.signedIn) {
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
    };

    return (
      <ScrollView>
        <View>
          <View
            style={[styles.tabView]}>
            <Text style={styles.tabLabel}>
              SEARCH SPARE PARTS BY CAR:
            </Text>
            <View style={styles.containerDotOuter}>
              <View style={styles.containerDotInner}>
                <SelectInput
                  location={this.props.tabLabel}
                  placeholder={'Brand'}
                  data={this.props.vehicles.carMakers}
                  value={this.state.selectedCarMaker}
                  loading={this.props.vehicles.carMakersIsFetching}
                  error={this.props.vehicles.carMakersError}
                  disabled={!this.props.vehicles.carMakers.length || !this.props.connected}
                  onValueChange={(selectedCarMaker) => {
                    this.setState({
                      selectedCarMaker,
                    });
                  }}
                  onSubmitClick={(search) => {
                    this.props.actions.selectCarMaker();
                    if (search && this.props.connected) {
                      this.props.actions.getYears(this.state.selectedCarMaker);
                    }
                    this.setState({
                      selectedYear: null,
                      selectedModel: null,
                      selectedModification: null,
                    });
                  }}
                  onClearClick={() => {
                    this.setState({
                      selectedCarMaker: null,
                      selectedYear: null,
                      selectedModel: null,
                      selectedModification: null,
                    });
                    this.props.actions.clearCarMaker();
                  }}
                  onRefreshClick={() => {
                    if (this.props.connected) {
                      this.props.actions.getCarMakers();
                    }
                  }}
                  viewStyle={styles.selectInput}
                  textStyle={styles.selectInputTextStyle}
                  iconStyle={styles.selectInputIconStyle}
                  iconName={'sort'}
                  wrapStyle={styles.selectWrapInput}/>
                <SelectInput
                  location={this.props.tabLabel}
                  placeholder={'Year'}
                  data={this.props.vehicles.years}
                  error={false}
                  disabled={!this.props.vehicles.years.length || !this.state.selectedCarMaker || !this.props.connected}
                  value={this.state.selectedCarMaker ? this.state.selectedYear : null}
                  onValueChange={(selectedYear) => {
                    this.setState({
                      selectedYear
                    });
                  }}
                  onSubmitClick={(search) => {
                    this.props.actions.selectYear();
                    if (search && this.props.connected) {
                      this.props.actions.getModels(this.state.selectedCarMaker, this.state.selectedYear);
                    }
                    this.setState({
                      selectedModel: null,
                      selectedModification: null,
                    });
                  }}
                  onRefreshClick={() => {

                  }}
                  onClearClick={() => {
                    this.setState({
                      selectedYear: null,
                      selectedModel: null,
                      selectedModification: null,
                    });
                    this.props.actions.clearYear();
                  }}
                  viewStyle={styles.selectInput}
                  textStyle={{color: '#fff'}}
                  iconStyle={styles.selectInputIconStyle}
                  iconName={'sort'}
                  wrapStyle={styles.selectWrapInput}/>
                <SelectInput
                  location={this.props.tabLabel}
                  placeholder={'Model'}
                  data={this.props.vehicles.models}
                  loading={this.props.vehicles.modelsIsFetching}
                  error={this.props.vehicles.modelsError}
                  disabled={!this.props.vehicles.models.length || !this.state.selectedYear || !this.props.connected}
                  value={this.state.selectedYear ? this.state.selectedModel : null}
                  onValueChange={(selectedModel) => {
                    this.setState({
                      selectedModel
                    });
                  }}
                  onSubmitClick={(search) => {
                    this.props.actions.selectModel();
                    if (search && this.props.connected) {
                      this.props.actions.getModifications(this.state.selectedModel, this.state.selectedYear);
                    }
                    this.setState({
                      selectedModification: null,
                    });
                  }}
                  onClearClick={() => {
                    this.setState({
                      selectedModel: null
                    });
                    this.props.actions.clearModel();
                  }}
                  onRefreshClick={() => {
                    if (this.props.connected) {
                      this.props.actions.getModels(this.state.selectedCarMaker, this.state.selectedYear);
                    }
                  }}
                  viewStyle={styles.selectInput}
                  textStyle={styles.selectInputTextStyle}
                  iconStyle={styles.selectInputIconStyle}
                  iconName={'sort'}
                  wrapStyle={styles.selectWrapInput}/>
                <SelectInput
                  location={this.props.tabLabel}
                  placeholder={'Modification'}
                  data={this.props.vehicles.modifications}
                  loading={this.props.vehicles.modificationsIsFetching}
                  error={this.props.vehicles.modificationsError}
                  disabled={!this.props.vehicles.modifications.length || !this.state.selectedModel || !this.props.connected}
                  value={this.state.selectedModel ? this.state.selectedModification : null}
                  onValueChange={(selectedModification) => {
                    this.setState({
                      selectedModification
                    });
                  }}
                  onClearClick={() => {
                    this.setState({
                      selectedModification: null
                    });
                    this.props.actions.clearModification();
                  }}
                  onRefreshClick={() => {
                    if (this.props.connected) {
                      this.props.actions.getModifications(this.state.selectedModel, this.state.selectedYear);
                    }
                  }}
                  viewStyle={styles.selectInput}
                  textStyle={styles.selectInputTextStyle}
                  iconStyle={styles.selectInputIconStyle}
                  iconName={'sort'}
                  wrapStyle={styles.selectWrapInput}/>
              </View>
            </View>
            <Button
              disabled={(!this.state.selectedCarMaker) || (this.state.selectedYear && !this.state.selectedModel)}
              onPress={() => {
                this.props.metricsMainSearch('Car');
                sendModificationBO();

                if (this.state.selectedCarMaker && this.props.connected) {
                  Log.logEvent(Events.EVENT_SEARCH_CAR);
                  this.props.actions.setEnableSorting(true);
                  this.props.navigator.push({
                    id: 'ResultPage',
                    selectedCarMaker: this.state.selectedCarMaker,
                    selectedYear: this.state.selectedYear,
                    selectedModel: this.state.selectedModel,
                    selectedModification: this.state.selectedModification,
                    key: 'SearchByCar'
                  });
                } else {
                  this.props.actions.showAlert(
                    'Error',
                    messages.offline
                  );
                }
              }}
              style={styles.buttonSubmit}
              textStyle={{color: '#fff'}}>
              SEARCH PARTS
            </Button>

            {this.state.selectedModification && !!this.state.selectedModification.oem_url && (
              <Button
                disabled={(!this.state.selectedCarMaker) || (this.state.selectedYear && !this.state.selectedModel)}
                onPress={() => {
                  let url = Url.updateQueryStringParameter(this.state.selectedModification.oem_url, 'utm_source', SOURCE);

                  sendModificationBO();

                  this.props.navigator.push({
                    id: 'WebBrowser',
                    url: url,
                    key: 'SearchByCarOriginal'
                  });
                  this.setState({
                    selectedModification: null
                  });
                }}
                style={[styles.buttonSubmit, {marginTop: 10}]}
                textStyle={{color: '#fff'}}>
                SEARCH OEM CATALOG
              </Button>
            )}
          </View>
        </View>

      </ScrollView>
    );
  }
}


function mapStateToProps(state) {
  return {
    connected: state.network.connected,
    vehicles: state.vehicles,
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({...sweetAlertActions, ...vehiclesActions, ...filterActions}, dispatch)};
}


export default connect(mapStateToProps, mapDispatchToProps)(ByCar);
