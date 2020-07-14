import React, {Component} from 'react';
import {
  View,
  Dimensions
} from 'react-native';
const SCREEN_WIDTH = Dimensions.get('window').width;

class WrapItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={[{
        backgroundColor: '#fff',
        marginTop: 10,
        marginBottom: 0,
        paddingHorizontal: 15,
        width: SCREEN_WIDTH,
      }, this.props.style]}>
        {this.props.children}
      </View>
    );
  }
}

export default WrapItem;
