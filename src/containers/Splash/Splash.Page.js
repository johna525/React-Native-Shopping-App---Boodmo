import React, {Component} from 'react';
import {
    View,
    Image,
} from 'react-native';

import * as Colors from '../../constants/Colors';

class SplashPage extends Component {

    componentWillMount() {
        var navigator = this.props.navigator;
        setTimeout(() => {
            navigator.replace({
                id: this.props.navigationPath ? this.props.navigationPath : 'default'
            });
        }, 2000);
    }

    render() {
        return (
            <View
              style={{
                flexGrow: 1,
                backgroundColor: Colors.PRIMARY,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{
                  width: 330 / 2,
                  height: 123 / 2,
                }}
                source={require('./../../assets/logo.png')}>
              </Image>
            </View>
        );
    }
}


export default SplashPage;
