import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableHighlight,
  View,
  Platform
} from 'react-native';
import * as Colors from '../constants/Colors';
import LoadingIndicator from './LoadingIndicator';

const Button = React.createClass({
  getInitialState() {
    return {
      active: false,
    };
  },

  getDefaultProps: function () {
    return {
      activeTextColor: '#fff',
      textColor: '#000',
      underlayColor: Colors.BUTTON_BLUE_ACTIVE,
      disabled: false,
    };
  },

  _onHighlight() {
    this.setState({active: true});
  },

  _onUnhighlight() {
    this.setState({active: false});
  },

  render() {
    const {
      children,
      disabled,
      loading,
      loadingDisabled,
      style,
      underlayColor,
      activeTextColor,
      textColor,
      textStyle,
      onPress
    } = this.props;
    const colorStyle = {
      color: this.state.active ? activeTextColor : textColor,
    };
    let activeStyle = this.state.active || loading ? {
      backgroundColor: underlayColor
    } : null;

    return (
      <View>
        { Platform.OS === 'android' && Platform.Version >= 21 ?
          <TouchableNativeFeedback
            onHideUnderlay={this._onUnhighlight}
            onPress={onPress}
            onShowUnderlay={this._onHighlight}
            underlayColor={underlayColor}
            disabled={disabled || loading || loadingDisabled}>
            <View style={[
              styles.button, style,
              activeStyle,
              {opacity: disabled ? 0.3 : 1}]}>
              {
                loading ?
                  <LoadingIndicator
                    style={{marginRight: 5}}
                    black
                    size="small"/>
                  : null
              }
              <Text
                style={[styles.buttonText, colorStyle, textStyle]}>{children}</Text>
            </View>
          </TouchableNativeFeedback>
          :
          <TouchableHighlight
            onHideUnderlay={this._onUnhighlight}
            onPress={onPress}
            onShowUnderlay={this._onHighlight}
            style={[styles.button, style, activeStyle, {opacity: disabled ? 0.3 : 1}]}
            underlayColor={underlayColor}
            disabled={disabled || loading || loadingDisabled}>
            <View style={styles.buttonInner}>
              {
                loading ?
                  <LoadingIndicator
                    style={{marginRight: 5}}
                    black
                    size="small"/>
                  : null
              }
              <Text
                style={[styles.buttonText, colorStyle, textStyle]}>{children}</Text>
            </View>
          </TouchableHighlight>
        }
      </View>

    );
  }
});

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 18,
    margin: 5,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#eeeeee',
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 3,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonInner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Button;
