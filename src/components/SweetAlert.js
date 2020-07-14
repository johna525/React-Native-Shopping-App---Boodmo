import React from 'react';
import {
  Text,
  View,
  Modal,
  Dimensions,
  StyleSheet
} from 'react-native';
import Button from './Button';
import * as Colors from '../constants/Colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

const SweetAlert = React.createClass({

  render() {
    return (
      <View>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.props.alertState}
          onRequestClose={() => {
            this.props.hideAlert.bind(this);
          }}
        >
          <View style={styles.modalBackgroundStyle}>
            <View style={styles.innerContainer}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalHeader}>{this.props.header}</Text>
              </View>
              <View style={styles.modalContentContainer}>
                <View style={styles.modalContent}>
                  <Text style={{textAlign: 'center'}}>
                    {this.props.message}
                  </Text>
                </View>
              </View>
              <View style={styles.modalContainer}>
                <Button
                  onPress={this.props.hideAlert.bind(this)}
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
                      color: '#ffffff'
                    }
                  ]}>
                  {this.props.buttonText || 'OK'}
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
});

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
    borderWidth: 1,
    width: SCREEN_WIDTH - 100,
  },
  modalButtonText: {
    fontSize: 16,
    margin: 0
  }
});

export default SweetAlert;