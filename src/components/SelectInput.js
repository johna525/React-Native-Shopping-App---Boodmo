import React, {PropTypes} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  TouchableNativeFeedback,
  Platform
} from 'react-native';
import Picker from 'react-native-wheel-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

import LoadingIndicator from './LoadingIndicator';
import Button from './Button';
import * as Colors from '../constants/Colors';
import * as Events from '../constants/Events';
import * as Log from '../actions/Log';

const SCREEN_WIDTH = Dimensions.get('window').width;
const PickerItem = Picker.Item;
const Touchable = Platform.OS === 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableOpacity;

const SelectInput = React.createClass({
  propTypes: {
    placeholder: PropTypes.string,
    data: PropTypes.array,
    disabled: PropTypes.bool,
  },
  getDefaultProps: function () {
    return {
      placeholder: '',
      data: [],
      disabled: false,
    };
  },
  getInitialState() {
    return {
      modalVisible: false,
      item: null,
      prevItem: null,
    };
  },
  setModalVisible(visible) {
    if (visible) {
      Log.logEvent(Events.EVENT_OPEN_SELECT_INPUT_MODAL);
      this.setState({
        prevItem: this.props.value != null ? this.props.value.value : this.props.data[0],
        item: this.props.value != null ? this.props.value.value : this.props.data[0],
      });
      this.props.onValueChange(this.props.value == null ? this.props.data[0] : this.props.value);
    } else {
      Log.logEvent(Events.EVENT_CLOSE_SELECT_INPUT_MODAL);
    }
    this.setState({
      modalVisible: visible
    });
  },
  componentWillReceiveProps(nextProps) {
    this.items = [];
    this.separatorIndex = null;
    this.gotSeparator = false;
    nextProps.data.map((item, key) => {
      if (item['is_featured'] === true) {
        this.gotSeparator = true;
        this.items.push(<PickerItem label={item.name} value={item.value}
          key={key}/>);
      } else {
        if (this.separatorIndex === null && this.gotSeparator) {
          this.separatorIndex = key;
          this.items.push(<PickerItem label="───────────" value={key} key={key}/>);
        }
        key = this.gotSeparator ? key + 1 : key;
        this.items.push(<PickerItem label={item.name} value={item.value}
          key={key}/>);
      }
    });
  },

  render() {
    let fontSize = this.props.pickerFontSize || 24;
    return (
      <View style={this.props.wrapStyle}>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(false);
            this.props.onValueChange(this.props.data.find((item) => item.value == this.state.prevItem));
            this.setState({
              item: this.state.prevItem
            });
          }}>
          <View style={[{
            flexGrow: 1,
            justifyContent: 'center',
            padding: 20,
          }, {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }]}>
            <View style={{
              backgroundColor: '#fff',
              padding: 20
            }}>
              <View>
                <Picker style={{width: SCREEN_WIDTH - 80, height: 200, marginBottom: 10}}
                  selectedValue={this.state.item}
                  itemStyle={{color: '#000', fontSize}}
                  onValueChange={(itemValue) => {
                    if (itemValue === this.separatorIndex && this.gotSeparator)  {
                      let isFeatured = this.props.data.find((item) => item.value == this.state.item) ?
                        this.props.data.find((item) => item.value == this.state.item)['is_featured']
                        : true ;
                      if (isFeatured) {
                        itemValue = this.props.data[this.separatorIndex].value;
                      } else {
                        itemValue = this.props.data[this.separatorIndex - 1].value;
                      }
                    }
                    this.props.onValueChange(this.props.data.find((item) => item.value == itemValue));
                    this.setState({
                      item: itemValue
                    });
                  }}>
                  {this.items}
                </Picker>
              </View>
              <View style={styles.modalContainer}>
                <Button
                  onPress={() => {
                    this.setState({item: null});
                    this.props.onClearClick(true);
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
                  Clear
                </Button>
                <Button
                  onPress={() => {
                    if (this.props.onSubmitClick) {
                      this.props.onSubmitClick(true);
                    }
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
          </View>
        </Modal>
        <Touchable
          onPress={() => {
            if (this.props.metricsFunc) {this.props.metricsFunc(this.props.metricsData, this.state.prevItem && this.state.prevItem.name || null);}
            this.setModalVisible(true);
          }}
          disabled={this.props.disabled}
          style={
            this.props.location === 'CAR' ||
                      this.props.location === 'VIN' ||
                      this.props.needBlack === true ||
                      this.props.removeOpacity === true
              ? {opacity: 1} : {opacity: 0.3}}
          hitSlop={this.props.hitSlop}>
          <View style={[this.props.viewStyle, {
            opacity: this.props.disabled ? 0.3 : 1,
          }]}>
            <Text style={[this.props.textStyle, {
              color:
                            (this.props.location === 'CAR' ||
                            this.props.location === 'VIN') ||
                            this.props.needBlack ? '#000' :
                              this.props.value ? this.props.activeColor || '#000000' : Colors.PLACEHOLDER,
            }]} ellipsizeMode={'tail'} numberOfLines={1}>
              {this.props.value ? this.props.value.name : this.props.placeholder}
            </Text>
            {
              this.props.loading ?
                <LoadingIndicator
                  style={this.props.loadingStyle ? this.props.loadingStyle : {marginRight: -7}}
                  size="small"/>
                :
                <View>
                  {
                    this.props.error ?
                      <Touchable onPress={this.props.onRefreshClick}>
                        <View>
                          <Icon name={'refresh'} style={this.props.iconStyle}/>
                        </View>
                      </Touchable>
                      :
                      <Icon name={this.props.iconName} style={this.props.iconStyle}/>
                  }
                </View>
            }
          </View>
        </Touchable>
      </View>
    );
  },
});

const styles = StyleSheet.create({
  modalContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  modalButton: {
    marginRight: 5,
    borderWidth: 1,
    width: (SCREEN_WIDTH - 100) / 2
  },
  modalButtonText: {
    fontSize: 14,
    margin: 0
  },
});

export default SelectInput;
