import React, {Component} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    ScrollView,
    Platform
} from 'react-native';
import {checkPartNumber} from "../../../utils/Validator";
var styles = require('../styles');
import * as Colors from '../../../constants/Colors';
import Button from '../../../components/Button';
import Icon from 'react-native-vector-icons/FontAwesome';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as vehiclesActions from '../../../actions/Vehicles';
import * as sweetAlertActions from '../../../actions/SweetAlert';
import * as filterActions from '../../../actions/Filter';

import messages from '../../../constants/Messages';
import * as Log from '../../../actions/Log';
import * as Events from '../../../constants/Events';

const dismissKeyboard = require('dismissKeyboard')

class ByCar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            partNumber: null,
            placeholder: 'Enter Part number or Brand name'
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
                            SEARCH SPARE PARTS BY PART NUMBER:
                        </Text>
                        <View style={styles.containerDotOuter}>
                            <View style={styles.containerDotInner}>
                                <View style={styles.textInputWrapper}>
                                    <TextInput
                                        underlineColorAndroid="transparent"
                                        style={styles.textInput}
                                        onChangeText={(partNumber) => {
                                            if (checkPartNumber(partNumber) || partNumber == '') {
                                                this.setState({
                                                    partNumber
                                                });
                                            }
                                        }}
                                        onFocus={() => this.setState({ placeholder: '' })}
                                        onBlur={() => this.setState({ placeholder: 'Enter Part number or Brand name' })}
                                        value={this.state.partNumber}
                                        numberOfLines={1}
                                        placeholder={this.state.placeholder}
                                        placeholderTextColor={Colors.PLACEHOLDER}
                                    />
                                    <Icon name="search" size={20} color={Colors.PLACEHOLDER} style={{
                                        marginLeft: 10,
                                    }}/>
                                </View>
                            </View>
                        </View>
                        <Button
                            disabled={!this.state.partNumber}
                            onPress={() => {
                                dismissKeyboard();
                                this.props.metricsMainSearch('Part Number');
                                if (this.state.partNumber && this.props.connected) {
                                    Log.logEvent(Events.EVENT_SEARCH_PART_NUMBER);
                                    this.props.navigator.push({
                                        id: 'ResultPage',
                                        keyword: this.state.partNumber,
                                        key: 'SearchByPN'
                                    });
                                    this.props.actions.setEnableSorting(false);
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
        vehicles: state.vehicles
    }
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({...sweetAlertActions, ...vehiclesActions, ...filterActions}, dispatch)}
}


export default connect(mapStateToProps, mapDispatchToProps)(ByCar);
