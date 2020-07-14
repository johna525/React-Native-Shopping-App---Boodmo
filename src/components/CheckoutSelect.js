import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  TouchableNativeFeedback,
  PixelRatio,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Picker from 'react-native-wheel-picker';
import * as _ from 'lodash';

import Button from './Button';
import * as Colors from '../constants/Colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const PickerItem = Picker.Item;
const Touchable = Platform.OS === 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableOpacity;

class CheckoutSelect extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  setModalVisible(visible) {
    this.setState({
      modalVisible: visible
    });

    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit();
    }
  }

  getSelectedValue = () => {
    let value = this.props.data[0].id;

    if (this.props.value) {
      value = this.props.value.id ? this.props.value.id : _.find(this.props.data, 'value', this.props.value).id;
    }

    return value;
  };

  render() {
    let fontSize = SCREEN_WIDTH * PixelRatio.get() < 540 ? 16 : 18;

    return (
      <View style={styles.wrapper}>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={this.setModalVisible.bind(this, false)}>
          <View style={styles.overlay}>
            <View style={styles.modalBlock}>
              <View>
                <Picker
                  style={{width: SCREEN_WIDTH - 80, height: 216, marginBottom: 10}}
                  selectedValue={this.getSelectedValue()}
                  itemStyle={{color: '#000', fontSize}}
                  onValueChange={(itemValue) => {
                    this.props.onValueChange(this.props.data.find((item) => item.id === itemValue));
                  }}>
                  {this.props.data.map((item, key) => (
                    <PickerItem label={item.name} value={item.id}
                      key={key}/>
                  ))}
                </Picker>
              </View>
              <View style={styles.modalContainer}>
                <Button
                  onPress={this.setModalVisible.bind(this, false)}
                  style={styles.modalButton}
                  underlayColor={Colors.BUTTON_BLUE_ACTIVE}
                  textStyle={styles.modalButtonText}>
                  OK
                </Button>
              </View>
            </View>
          </View>
        </Modal>
        <Touchable
          disabled={this.props.disabled}
          onPress={this.setModalVisible.bind(this, true)}>
          <View style={[
            styles.selectInput,
            this.props.error ? styles.hasError : null,
            this.props.disabled ? styles.disabled : null
          ]}>
            <Text
              style={[styles.text, {color: this.props.value ? '#000000' : Colors.PLACEHOLDER}]}
              ellipsizeMode='tail'
              numberOfLines={1}
            >
              {this.props.value ? this.props.value.name : this.props.placeholder}
            </Text>
            <Icon name='sort' style={styles.iconStyle}/>
          </View>
        </Touchable>
        {
          this.props.error ?
            <Text style={styles.textError}>{this.props.errorMessage}</Text>
            : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20
  },
  overlay: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  modalBlock: {
    backgroundColor: '#fff',
    padding: 20
  },
  modalButton: {
    marginRight: 5,
    borderWidth: 1,
    width: (SCREEN_WIDTH - 100),
    backgroundColor: Colors.BUTTON_BLUE,
    borderColor: Colors.BUTTON_BLUE,
  },
  modalButtonText: {
    fontSize: 14,
    margin: 0,
    color: '#ffffff'
  },
  selectInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderBottomWidth: 0.5,
    borderRadius: 3,
    borderColor: Colors.PRIMARY_LIGHT,
    height: 45,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    opacity: 1
  },
  disabled: {
    opacity: 0.3
  },
  hasError: {
    borderColor: Colors.NOT_VALID,
  },
  textError: {
    color: Colors.NOT_VALID,
  },
  text: {
    fontFamily: 'Arial',
    fontSize: 15,
    flex: 1,
    color: '#000000'
  },
  iconStyle: {
    color: Colors.PRIMARY_LIGHT,
    marginLeft: 10,
    fontSize: 15,
  }
});

export default CheckoutSelect;
