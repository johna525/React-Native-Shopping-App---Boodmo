import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableNativeFeedback,
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native';
import * as Colors from '../constants/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import Button from './Button';
import Picker from 'react-native-wheel-picker';

const SCREEN_WIDTH = Dimensions.get('window').width;
const PickerItem = Picker.Item;
const Touchable = Platform.OS === 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableOpacity;

class QuantitySelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      quantity: '1'
    };
  }

  componentWillMount() {
    this.setState({
      quantity: this.props.value
    });
  }

  componentWillReceiveProps(nextPros) {
    this.setState({
      quantity: nextPros.value
    });
  }

  changeQuantity(value) {
    this.setState({
      quantity: value
    });
  }

  onSubmit() {
    if (this.props.onSubmit) {
      this.props.onSubmit(this.state.quantity);
    }
    this.setModalVisible(false);
  }

  setModalVisible(visible) {
    this.setState({
      modalVisible: visible
    });
  }

  render() {
    let fontSize = 24;
    let rows = [];
    let i;

    for (i = 1; i < 10; i++) {
      rows.push(<PickerItem label={i.toString()} value={i} key={i - 1}/>);
    }

    rows.push(<PickerItem label={`${i}+`} value={i} key={i - 1}/>);

    return (
      <View>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={this.setModalVisible.bind(this,false)}>
          <View style={styles.overlay}>
            <View style={styles.modalBlock}>
              <View>
                <Picker style={{width: SCREEN_WIDTH - 80, height: 216, marginBottom: 10}}
                  selectedValue={this.state.quantity}
                  itemStyle={{color: '#000', fontSize}}
                  onValueChange={(quantity) => this.changeQuantity(quantity)}>
                  {rows}
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
          onPress={this.setModalVisible.bind(this, true)}>
          <View style={styles.selectInput}>
            <Text style={styles.text} ellipsizeMode='tail' numberOfLines={1}>
              {this.state.quantity.toString()}
            </Text>
            <Icon name='caret-down' style={styles.iconStyle}/>
          </View>
        </Touchable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    paddingHorizontal: 5,
    backgroundColor: '#fff',
    flexGrow: 1,
    marginHorizontal: 10,
    width: 80,
    height: 32,
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

export default QuantitySelect;