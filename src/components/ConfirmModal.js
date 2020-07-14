import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Dimensions
} from 'react-native';
import * as Colors from '../constants/Colors';
const SCREEN_WIDTH = Dimensions.get('window').width;
import Button from './Button';

class ConfirmModal extends React.Component {

  constructor(props) {
    super(props);
    this.onConfirm = null;
    this.state = {
      showAlert: false,
      header: '',
      message: '',
    };
  }

  showConfirm(options, callback) {
    let {header, message} = options;
    this.onConfirm = callback;
    this.setState({
      showAlert: true,
      header,
      message,
    });
  }

  hideAlert() {
    this.setState({
      showAlert: false
    });
  }

  confirmed() {
    this.hideAlert();
    this.onConfirm();
  }

  render() {
    return (
      <View>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.showAlert}
          onRequestClose={() => {
            this.setModalVisible(false);
          }}
        >
          <View style={styles.modalBackgroundStyle}>
            <View style={styles.innerContainer}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalHeader}>{this.state.header}</Text>
              </View>
              <View style={styles.modalContentContainer}>
                <View style={styles.modalContent}>
                  <Text style={{textAlign: 'center'}}>
                    {this.state.message}
                  </Text>
                </View>
              </View>
              <View style={styles.modalContainer}>
                <Button
                  onPress={this.confirmed.bind(this)}
                  style={[
                    styles.modalButton,
                    {
                      backgroundColor: Colors.BUTTON_BLUE,
                      borderColor: Colors.BUTTON_BLUE
                    }
                  ]}
                  underlayColor={Colors.BUTTON_BLUE_ACTIVE}
                  textStyle={[
                    styles.modalButtonText,
                    {
                      color: '#fff'
                    }
                  ]}>
                  OK
                </Button>
                <Button
                  onPress={this.hideAlert.bind(this)}
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
                  Cancel
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalBackgroundStyle: {
    flexGrow: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  innerContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginLeft: 20,
    marginRight: 20,
    alignItems: 'center',
    overflow: 'hidden',
  },
  modalContainer: {
    padding: 10,
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: '400',
    color: Colors.PRIMARY,
  },
  modalContentContainer: {
    width: SCREEN_WIDTH - 80,
    overflow: 'hidden'
  },
  modalContent: {
    paddingLeft: 30,
    paddingRight: 50,
    paddingVertical: 20,
    width: SCREEN_WIDTH,
    borderWidth: 2,
    marginLeft: -30,
    borderColor: Colors.BORDER_DOT,
    borderStyle: 'dotted',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  modalButton: {
    marginRight: 5,
    borderWidth: 1,
    width: (SCREEN_WIDTH - 100) / 2
  },
  modalButtonText: {
    fontSize: 16,
    margin: 0
  }
});
export default ConfirmModal;
