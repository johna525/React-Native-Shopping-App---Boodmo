import React, {Component, PropTypes} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TouchableNativeFeedback,
    Platform,
    Dimensions
} from 'react-native';
import Button from './Button';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Colors from '../constants/Colors';
var Touchable = Platform.OS == 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableOpacity;
const SCREEN_WIDTH = Dimensions.get('window').width;

const dismissKeyboard = require('dismissKeyboard')

const Range = React.createClass({
    getDefaultProps: function () {
        return {
            placeholder: null,
            price_range_min: null,
            price_range_max: null,
            disabled: false,
        };
    },
    getInitialState() {
        return {
            modalVisible: false,
            price_range_min: null,
            price_range_max: null,
            prev_price_range_min: null,
            prev_price_range_max: null,
        };
    },
    setModalVisible(visible) {
        this.setState({
            modalVisible: visible,
            prev_price_range_min: this.props.price_range_min ? this.props.price_range_min : null,
            prev_price_range_max: this.props.price_range_max ? this.props.price_range_max : null,
            price_range_min: this.props.price_range_min ? this.props.price_range_min : null,
            price_range_max: this.props.price_range_max ? this.props.price_range_max : null,
        });
    },

    render() {
        return (
            <View style={this.props.wrapStyle}>
                <View>
                    <Modal
                        animationType={'fade'}
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            this.setModalVisible(false);
                            this.props.onMinChange(this.state.prev_price_range_min)
                            this.setState({
                                price_range_min: this.state.prev_price_range_min
                            });
                            this.props.onMinChange(this.state.prev_price_range_min)
                            this.setState({
                                price_range_min: this.state.prev_price_range_min
                            });
                        }}>
                        <View style={{
                            flexGrow: 1,
                            justifyContent: 'center',
                            padding: 20,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)'
                        }}>
                            <TouchableWithoutFeedback onPress={()=> dismissKeyboard()}>
                                <View style={{
                                    backgroundColor: '#fff',
                                    padding: 20
                                }}>
                                    <View style={styles.ranges}>
                                        <View style={styles.textInputWrapper}>
                                            <TextInput
                                                underlineColorAndroid="transparent"
                                                style={styles.textInput}
                                                onChangeText={(price_range_min) => {
                                                    this.props.onMinChange(price_range_min)
                                                    this.setState({
                                                        price_range_min: price_range_min
                                                    });
                                                }}
                                                value={this.state.price_range_min}
                                                placeholder={'MIN'}
                                                placeholderTextColor={Colors.PLACEHOLDER}
                                                disabled={this.props.disabled}
                                                keyboardType="numeric"
                                            />
                                        </View>
                                        <View style={styles.divider}>
                                            <Text style={styles.dividerText}>-</Text>
                                        </View>
                                        <View style={styles.textInputWrapper}>
                                            <TextInput
                                                underlineColorAndroid="transparent"
                                                style={styles.textInput}
                                                onChangeText={(price_range_max) => {
                                                    this.props.onMaxChange(price_range_max)
                                                    this.setState({
                                                        price_range_max: price_range_max
                                                    });
                                                }}
                                                value={this.state.price_range_max}
                                                placeholder={'MAX'}
                                                placeholderTextColor={Colors.PLACEHOLDER}
                                                disabled={this.props.disabled}
                                                keyboardType="numeric"
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.modalContainer}>
                                        <Button
                                            onPress={() => {
                                                this.setState({
                                                    price_range_min: null,
                                                    price_range_max: null
                                                })
                                                this.props.onMinChange(null)
                                                this.props.onMaxChange(null)
                                                this.setModalVisible(false);
                                            }}
                                            underlayColor={`${Colors.BUTTON_GREY}50`}
                                            style={[
                                                styles.modalButton,
                                                {
                                                    backgroundColor: 'transparent',
                                                    borderColor: Colors.BUTTON_GREY
                                                }
                                            ]}
                                            textStyle={[
                                                styles.modalButtonText,
                                                {
                                                    color: Colors.BUTTON_GREY
                                                }
                                            ]}>
                                            All
                                        </Button>
                                        <Button
                                            onPress={() => {
                                                this.setModalVisible(false);
                                            }}
                                            style={[
                                                styles.modalButton,
                                                {
                                                    backgroundColor: Colors.BUTTON_BLUE,
                                                    borderColor: Colors.BUTTON_BLUE,
                                                    marginRight: 0
                                                }
                                            ]}
                                            underlayColor={Colors.BUTTON_BLUE_ACTIVE}
                                            textStyle={[
                                                styles.modalButtonText,
                                                {
                                                    color: '#ffffff'
                                                }
                                            ]}>
                                            OK
                                        </Button>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </Modal>
                    <Touchable
                        onPress={() => {
                          // console.log(this.state, this.props);
                          if (this.props.metricsFunc) {
                            this.props.metricsFunc(
                              this.props.metricsData,
                              {
                                price_range_min: this.state.price_range_min,
                                price_range_max: this.state.price_range_max
                              }
                            );
                          }
                          this.setModalVisible(true)
                        }}
                        disabled={this.props.disabled}
                        style={{opacity: this.props.disabled ? this.props.disabledOpacity || 0.3 : 1}}
                        hitSlop={this.props.hitSlop}>
                        <View style={this.props.viewStyle}>
                            <Text style={[this.props.textStyle, {
                                color: this.props.activeColor,
                            }]}>
                                {(this.props.price_range_min == null && this.props.price_range_max == null) ? 'All' : this.props.placeholder}
                            </Text>
                            <Icon name={this.props.iconName} style={this.props.iconStyle}/>
                        </View>
                    </Touchable>
                </View>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    divider: {
        marginHorizontal: 10,
        alignItems: 'center',
    },
    dividerText: {
        color: Colors.PRIMARY_LIGHT,
        fontSize: 40
    },
    modalContainer: {
        flexGrow: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    modalButton: {
        marginRight: 5,
        borderWidth: 1,
        padding: 0,
        width: (SCREEN_WIDTH - 110) / 2
    },
    modalButtonText: {
        fontSize: 14,
        margin: 0,
    },
    ranges: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15
    },
    textInputWrapper: {
        alignItems: 'center',
        paddingLeft: 5,
        paddingRight: 5,
        marginTop: 5,
        flexGrow: 1,
        borderColor: Colors.PRIMARY_LIGHT,
        borderWidth: 1,
        borderRadius: 3,
        flexDirection: 'row',
    },
    textInput: {
        height: 40,
        flexGrow: 1,
        fontSize: 15
    },
});

export default Range;
