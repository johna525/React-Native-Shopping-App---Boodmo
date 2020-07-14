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
import * as Colors from '../constants/Colors';
const currencies = require('./../constants/currencies.json');
import Icon from 'react-native-vector-icons/FontAwesome';
const SCREEN_WIDTH = Dimensions.get('window').width;
import Button from './Button';
import Picker from 'react-native-wheel-picker';
const PickerItem = Picker.Item;
const Touchable = Platform.OS === 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableOpacity;

class CurrencySelect extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      item: null
    };
  }

  setModalVisible(visible) {
    if (visible) {
      this.setState({
        item: this.props.value != null ? this.props.value.value : currencies[0].value
      });
    }
    this.setState({
      modalVisible: visible
    });
  }

  onSubmit() {
    this.setModalVisible(false);
    if (typeof this.props.onSubmit == 'function') {
      this.props.onSubmit(currencies.find((item) => item.value == this.state.item));
    }
  }

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
                <Picker style={{width: SCREEN_WIDTH - 80, height: 216, marginBottom: 10}}
                  selectedValue={this.state.item}
                  itemStyle={{color: '#000', fontSize}}
                  onValueChange={(itemValue) => {
                    this.setState({
                      item: itemValue
                    });
                  }}>
                  {currencies.map((item, key) => (
                    <PickerItem label={`${item.unicode.outputUnicode()} ${item.name}`}
                      value={item.value}
                      key={key}/>
                  ))}
                </Picker>
              </View>
              <View style={styles.modalContainer}>
                <Button
                  onPress={this.onSubmit.bind(this)}
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
            this.props.disabled ? styles.disabled : null,
            this.props.actionBar ? styles.actionBarSelectInput : null
          ]}>
            <Text style={[styles.text,
              {color: this.props.value ? '#000000' : Colors.PLACEHOLDER},
              this.props.actionBar ? styles.actionBarText : null]}
            ellipsizeMode='tail'
            numberOfLines={1}>
              {this.props.value ? `${this.props.value.unicode.outputUnicode() } ${this.props.value.name}` : null}
            </Text>
            <Icon name='sort'
              style={[styles.iconStyle, this.props.actionBar ? styles.actionBarIcon : null]}/>
          </View>
        </Touchable>
      </View>
    );
  }
}

CurrencySelect.defaultProps = {
  disabled: false,
  actionBar: false
};

const styles = StyleSheet.create({
  wrapper: {},
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
    width: 110,
    height: 40,
    paddingLeft: 20,
    paddingRight: 20,
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
  },
  actionBarSelectInput: {
    height: 50
  },
  actionBarText: {
    color: '#fff'
  },
  actionBarIcon: {
    color: '#fff'
  }
});

export default CurrencySelect;
