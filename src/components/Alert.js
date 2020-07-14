import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import * as Colors from '../constants/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';

class Alert extends React.Component {
  render() {
    return (
      <View style={[
        styles.alert,
        this.props.type ? styles[this.props.type] : styles.warning
      ]}>
        {
          this.props.icon ?
            <Icon
              style={styles.alertIcon}
              size={20}
              color={this.props.iconColor || '#000'}
              name={this.props.icon}/>
            : null
        }
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  alert: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
    borderRadius: 3
  },
  warning: {
    backgroundColor: Colors.ALERT_WARNING
  },
  default: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#aaa'
  },
  alertIcon: {
    marginRight: 10
  }
});

export default Alert;
