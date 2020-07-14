import React from 'react';
import {
  View,
  Dimensions
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

const AndroidShadow = React.createClass({
  render() {
    const primaryColors = [
      '#0f3a64',
      '#0f3b65',
      '#0f3c67',
      '#103e6a',
      '#103f6c',
      '#10416f',
      '#114272',
      '#114474'
    ];
    /*const greyColors = [
            '#0f3a64',
            '#0f3b65',
            '#0f3c67',
            '#103e6a',
            '#103f6c',
            '#10416f',
            '#114272',
            '#114474'
        ];*/
    let shadow = [];

    for (let i = 0; i < this.props.height; i++) {
      shadow.push(<View key={i} style={{width: SCREEN_WIDTH, height: 1, backgroundColor: primaryColors[i]}}/>);
    }

    return (
      <View>
        {shadow}
      </View>
    );
  }
});

export default AndroidShadow;
