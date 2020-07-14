import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Dimensions,
  Platform,
  Text
} from 'react-native';
import * as Colors from '../constants/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
const SCREEN_WIDTH = Dimensions.get('window').width;
const Touchable = Platform.OS === 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableOpacity;

import {metricsCartIconClick, metricsMenuIconClick} from '../utils/metrics';

class ActionBar extends Component {

  render() {
    const cartTotalStyle = this.props.total > 0 ? styles.notEmptyCart : styles.emptyCart;

    return (
      <View style={styles.actionBarContainer}>
        <Touchable
          hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
          onPress={() => {
            metricsMenuIconClick();
            this.props.openDrawer ? this.props.openDrawer() : null;
          }}>
          <View style={styles.headerButton}>
            <Icon name="bars" size={20} color="#fff"/>
          </View>
        </Touchable>
        { this.props.navigator.getCurrentRoutes().length !== 1 && !this.props.disableArrow ?
          <Touchable
            hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
            onPress={() => {
              if (this.props.navigator) {
                this.props.navigator.pop();
              }

              if (this.props.onBackPress) {
                this.props.onBackPress();
              }
            }}>
            <View style={styles.headerButton}>
              <Icon name="arrow-left" size={20} color="#fff"/>
            </View>
          </Touchable>
          : null }
        <View style={styles.titleWrapper}>
          <Text style={styles.title}
            ellipsizeMode={'tail'} numberOfLines={1}>{this.props.title}</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          {this.props.children}
          {
            this.props.total != null ?
              <Touchable onPress={() => {
                metricsCartIconClick();
                const routes = this.props.navigator.getCurrentRoutes();
                let previousRoute = null;
                if (routes.length >= 2) {
                  previousRoute = routes[routes.length - 2].id;
                }
                if (previousRoute === 'CartPage') {
                  this.props.navigator.pop();
                } else {
                  this.props.navigator.push({
                    id: 'CartPage'
                  });
                }
              }}>
                <View style={styles.headerButton}>
                  <Icon name="shopping-cart" size={22} color="#fff"/>
                  <View style={[styles.badgeBubble, cartTotalStyle]}>
                    <Text style={styles.badgeText}>{this.props.total || 0}</Text>
                  </View>
                </View>
              </Touchable>
              : null
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  actionBarContainer: {
    backgroundColor: Colors.PRIMARY,
    height: 50,
    width: SCREEN_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerButton: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
  },
  titleWrapper: {
    justifyContent: 'center',
    flexDirection: 'column',
    flexGrow: 1,
    width: 10,
    backgroundColor: 'transparent',
    paddingLeft: 10,
    paddingRight: 10,
  },
  title: {
    color: '#fff',
    fontSize: 14,
  },
  badgeBubble: {
    position: 'absolute',
    top: 7,
    right: 5,
    borderRadius: 2,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10
  },
  notEmptyCart: {
    backgroundColor: Colors.CART_NOT_EMPTY
  },
  emptyCart: {
    backgroundColor: Colors.CART_EMPTY
  }
});


export default ActionBar;
