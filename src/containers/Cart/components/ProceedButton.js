import React from 'react';
import {View} from 'react-native';
import Button from '../../../components/Button';
import styles from '../styles';
import {metricsCheckoutProceedClick} from '../../../utils/metrics';

class ProceedButton extends React.Component {
  render() {
    return (
      <View>
        <Button
          style={styles.buttonSubmit}
          textStyle={{color: '#fff'}}
          onPress={() => {
            metricsCheckoutProceedClick();
            this.props.onPress();
          }}
        >
          PROCEED TO CHECKOUT
        </Button>
      </View>
    );
  }
}


export default ProceedButton;
