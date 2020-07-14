import React, {Component} from 'react';
import {
    View,
    Image,
    Platform,
    TouchableNativeFeedback,
    TouchableOpacity,
} from 'react-native';
import ScrollableTabView, {SizableTabBar} from 'react-native-scrollable-tab-view';
import AndroidShadow from '../../components/AndroidShadow';
import Icon from 'react-native-vector-icons/FontAwesome';
const Touchable = Platform.OS === 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableOpacity;

import ByCar from './components/ByCar';
import ByVin from './components/ByVin';
import ByPartNumber from './components/ByPartNumber';

import {metricsMainSearch, metricsMainSectionsSelect, metricsMenuIconClick} from '../../utils/metrics';

const styles = require('./styles');
import * as Colors from '../../constants/Colors';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as vehiclesActions from '../../actions/Vehicles';
import * as networkActions from '../../actions/Network';
require('../../utils/Helper');

const dismissKeyboard = require('dismissKeyboard');


class Search extends Component {

    componentDidMount() {
        this.props.actions.getCarMakers();
    }

    render() {
        return (
            <View style={{flexGrow: 1}}>
                {this.props.platformOS === 'ios' ? <View style={styles.iosStatusBar}/> : null}
                <View style={styles.container}>
                    <View style={styles.imageWrapper}>
                        <View style={styles.drawerMenuButtonWrapper}>
                            <Touchable
                                hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
                                onPress={() => {
                                    metricsMenuIconClick();
                                    this.props.openDrawer();
                                }}>
                                    <View style={styles.headerButton}>
                                        <Icon name="bars" size={20} color="#fff"/>
                                    </View>
                            </Touchable>
                        </View>
                        <Image
                            style={{
                                width: 330 / 2,
                                height: 123 / 2,
                                marginVertical: 10
                            }}
                            source={require('./../../assets/logo.png')}
                        />
                        {
                            this.props.platformOS === 'android' ?
                                <View style={{marginBottom: -11}}>
                                    <AndroidShadow height={6}/>
                                </View>
                                : null
                        }
                    </View>
                    <ScrollableTabView
                        renderTabBar={()=><SizableTabBar style={{borderWidth: 0}}/>}
                        style={styles.wrapScrollTab}
                        tabBarUnderlineStyle={{backgroundColor: Colors.TAB_UNDERLINE}}
                        tabBarActiveTextColor="#FFFFFF"
                        tabBarBackgroundColor={Colors.PRIMARY}
                        tabBarInactiveTextColor={Colors.TAB_BUTTON_TEXT}
                        tabBarTextStyle={{fontWeight: 'bold'}}
                        contentProps={{keyboardShouldPersistTaps: 'always'}}
                        onChangeTab={(prevPage) => {
                            metricsMainSectionsSelect(prevPage.ref.props.content);
                            dismissKeyboard();
                        }}>
                        <ByCar metricsMainSearch={metricsMainSearch} content='Car' tabSize={2} tabLabel='CAR' navigator={this.props.navigator}/>
                        <ByVin metricsMainSearch={metricsMainSearch} content='Vin' tabSize={2} tabLabel='VIN' navigator={this.props.navigator}/>
                        <ByPartNumber metricsMainSearch={metricsMainSearch} content='Part Number' tabSize={3} tabLabel='PART NUMBER' navigator={this.props.navigator}/>
                    </ScrollableTabView>
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        connected: state.network.connected,
        platformOS: state.device.platformOS,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            ...vehiclesActions,
            ...networkActions
        }, dispatch)
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Search);
