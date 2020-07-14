import React from 'react';
import {
  StyleSheet,
  View,
  Image
} from 'react-native';

const LoadingIndicator = React.createClass({
  render() {
    let sizeStyle;
    switch (this.props.size) {
    case 'small':
      sizeStyle = styles.sizeSmall;
      break;
    case 'large':
      sizeStyle = styles.sizeLarge;
      break;
    case 'x-large':
      sizeStyle = styles.sizeXLarge;
      break;
    case 'xx-large':
      sizeStyle = styles.sizeXXLarge;
      break;
    }
    let image = null;
    if (this.props.white) {
      image = require('./../assets/loading_white.gif');
    } else {
      image = require('./../assets/loading.gif');
    }
    return (
      <View style={[styles.container, this.props.style]}>
        <Image style={sizeStyle} source={image}/>
      </View>
    );
  }
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeSmall: {
    width: 25,
    height: 25,
  },
  sizeLarge: {
    width: 36,
    height: 36,
  },
  sizeXLarge: {
    width: 48,
    height: 48,
  },
  sizeXXLarge: {
    width: 72,
    height: 72,
  },
});

export default LoadingIndicator;