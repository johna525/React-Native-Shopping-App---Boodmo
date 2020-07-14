import React from 'react';
import {
    Text,
    View,
    Platform,
    TouchableNativeFeedback,
    TouchableOpacity,
} from 'react-native';
import ActionBar from '../ActionBar';
import Icon from 'react-native-vector-icons/FontAwesome';
var Touchable = Platform.OS == 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableOpacity;

import styles from "./styles";

class CartActionBar extends React.Component {
    render() {
        var cartCountStyle = this.props.count > 0 ? styles.notEmptyCart : styles.emptyCart;
        return (
            <ActionBar
                title={'SHOPPING CART'}
                navigator={this.props.navigator}>
                <Touchable onPress={() => {
                    var routes = this.props.navigator.getCurrentRoutes();
                    if (routes[routes.length - 1].id != 'CartPage') {
                        this.props.navigator.push({
                            id: 'CartPage'
                        });
                    }
                }}>
                    <View style={styles.headerButton}>
                        <Icon name="shopping-cart" size={22} color="#fff"/>
                        <View style={[styles.badgeBubble, cartCountStyle]}>
                            <Text style={styles.badgeText}>{this.props.count || 0}</Text>
                        </View>
                    </View>
                </Touchable>

            </ActionBar>
        );
    }
}

export default CartActionBar;
