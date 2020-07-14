import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Colors from '../constants/Colors';

const LabelValue = React.createClass({
  render() {
    return (
      <View style={[styles.wrapItemColumn, this.props.separated ? styles.separatedItem : null]}>
        <Text style={styles.wrapItemColumnLabel}>{this.props.label}</Text>
        <Text style={styles.wrapItemColumnText}>{this.props.value}</Text>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  wrapItemColumn: {
    flexDirection: 'row',
    alignItems:'center',
    marginTop: 1,
    marginBottom: 1,
    flex: 1,
  },
  separatedItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.SEPARATOR,
    marginBottom: 10,
    paddingBottom: 10,
  },
  wrapItemColumnLabel: {
    flex: 5,
    fontSize: 16,
    paddingRight: 10,
    color: '#000',
  },
  wrapItemColumnText: {
    flex: 3,
    fontSize: 16,
    paddingLeft: 10,
    color: '#70737b',
    textAlign: 'left'
  }
});

export default LabelValue;