import React, {Component} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    Platform,
    ScrollView
} from 'react-native';
import * as Config from "../../../constants/Config";
import * as Url from "../../../utils/Url";
var styles = require('../styles');
import * as Colors from '../../../constants/Colors';
import SelectInput from '../../../components/SelectInput';
import Button from '../../../components/Button';
import Icon from 'react-native-vector-icons/FontAwesome';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as sweetAlertActions from '../../../actions/SweetAlert';
import * as vehiclesActions from '../../../actions/Vehicles';

import messages from '../../../constants/Messages';
import * as Log from '../../../actions/Log';
import * as Events from '../../../constants/Events';

const dismissKeyboard = require('dismissKeyboard')
const SOURCE = Platform.OS == 'android' ? Config.ANDROID_SOURCE : Config.IOS_SOURCE;

function isValidVin(vin) {
    return /^[A-HJ-NPR-Z0-9]{17}$/.test(vin);
}

class ByVin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedCarMakerVin: null,
            vinNumber: null,
            vinNumberValid: true,
            placeholder: '3FAHP07118R118024'
        }
    }

    render() {
        return (
            <KeyboardAwareScrollView
                extraScrollHeight={Platform.OS == 'ios' ? 90 : 0}
                keyboardShouldPersistTaps="always">
                <TouchableWithoutFeedback
                    onPress={() => dismissKeyboard()}>
                    <View
                        style={styles.tabView}>
                        <Text style={styles.tabLabel}>
                            SEARCH SPARE PARTS BY VIN:
                        </Text>
                        <View style={styles.containerDotOuter}>
                            <View style={styles.containerDotInner}>
                                <SelectInput
                                    location={this.props.tabLabel}
                                    placeholder={'Brand'}
                                    data={this.props.vehicles.carMakers_vin}
                                    value={this.state.selectedCarMakerVin}
                                    loading={this.props.vehicles.carMakersIsFetching}
                                    error={this.props.vehicles.carMakersError}
                                    disabled={!this.props.vehicles.carMakers_vin.length || !this.props.connected}
                                    onValueChange={(selectedCarMakerVin) => {
                                        this.setState({
                                            selectedCarMakerVin
                                        })
                                    }}
                                    onSubmitClick={(search) => {
                                        this.setState({
                                            vinNumber: null
                                        })
                                    }}
                                    onClearClick={(clear) => {
                                        this.setState({
                                            selectedCarMakerVin: null
                                        })
                                        this.props.actions.clearCarMakerVin();
                                    }}
                                    onRefreshClick={() => {
                                        if (this.props.connected) {
                                            this.props.actions.getCarMakers()
                                        }
                                    }}
                                    viewStyle={styles.selectInput}
                                    textStyle={styles.selectInputTextStyle}
                                    iconStyle={styles.selectInputIconStyle}
                                    iconName={'sort'}
                                    wrapStyle={styles.selectWrapInput}/>
                                <View style={[styles.textInputWrapper, {
                                    opacity: !this.state.selectedCarMakerVin ? 0.3 : 1,
                                    borderColor: this.state.vinNumberValid ? Colors.PRIMARY_LIGHT : Colors.NOT_VALID,
                                }]}>
                                    <TextInput
                                        location={this.props.tabLabel}
                                        underlineColorAndroid="transparent"
                                        style={styles.textInput}
                                        onChangeText={(vinNumber) => {
                                            this.setState({
                                                vinNumber,
                                                vinNumberValid: isValidVin(vinNumber)
                                            })
                                        }}
                                        value={this.state.vinNumber}
                                        numberOfLines={1}
                                        onFocus={() => this.setState({ placeholder: '' })}
                                        onBlur={() => this.setState({ placeholder: '3FAHP07118R118024' })}
                                        placeholder={this.state.placeholder}
                                        placeholderTextColor={Colors.PLACEHOLDER}
                                        editable={!!this.state.selectedCarMakerVin}
                                        disabled={!this.state.selectedCarMakerVin}
                                        autoCapitalize={'characters'}
                                    />
                                    <Icon name="search" size={20} color={Colors.PLACEHOLDER} style={{
                                        marginLeft: 10,
                                    }}/>
                                </View>
                            </View>
                        </View>
                        <Button
                            disabled={!this.state.selectedCarMakerVin || !this.state.vinNumber || !this.state.vinNumberValid}
                            onPress={() => {
                                dismissKeyboard();
                                this.props.metricsMainSearch('Vin');
                                if (this.state.selectedCarMakerVin && this.state.vinNumber && this.state.vinNumberValid && this.props.connected) {
                                    let vin_url = this.state.selectedCarMakerVin.vin_url;
                                    vin_url = vin_url.replace('%%VIN%%', this.state.vinNumber);
                                    Log.logEvent(Events.EVENT_SEARCH_VIN);
                                    let url = Url.updateQueryStringParameter(vin_url, 'utm_source', SOURCE);
                                    this.props.navigator.push({
                                        id: 'WebBrowser',
                                        url: vin_url,
                                        type: 'baseUrl',
                                        redirectEnable: true,
                                        key: 'SearchByVin'
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
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>
        );
    }
}


function mapStateToProps(state) {
    return {
        connected: state.network.connected,
        vehicles: state.vehicles,
    }
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({...sweetAlertActions, ...vehiclesActions}, dispatch)}
}


export default connect(mapStateToProps, mapDispatchToProps)(ByVin);
