import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  Text
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import styles from '../styles';
const Touchable = Platform.OS === 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableOpacity;

class WrapItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showed: false,
      activeSection: false,
      collapsed: true,
    };
    this._toggleExpanded = this._toggleExpanded.bind(this);
  }

  _toggleExpanded() {
    this.setState({collapsed: !this.state.collapsed});
    setTimeout(() => {
      this.props.toggled(this.state.collapsed);
    }, 100);

  }

  render() {
    return (
      <View
        style={[{
          backgroundColor: '#fff',
          paddingHorizontal: 15,
          marginTop: 10,
        }, !this.state.showed ? {paddingBottom: 0} : null]}>
        <View
          style={[styles.wrapItemColumn, {alignItems: 'center'}]}>
          {
            this.props.title ?
              <View style={styles.wrapItemTitle}>
                <Text style={[styles.wrapItemLinkText, {
                  color: '#aaaaaa',
                }]}>{this.props.title} {this.props.toggle ? `(${this.props.total})` : null}</Text>
              </View>
              : null
          }
        </View>
        {
          this.props.title ?
            <View style={{
              backgroundColor: '#f2f2f3',
              height: 1,
              marginBottom: 15,
            }} />
            : null
        }
        {
          this.props.toggle ?
            <View>
              {
                this.state.collapsed ?
                  <View>
                    {this.props.children ? this.props.children[0] : null}
                    {this.props.fastest ? this.props.fastest : null}
                  </View>
                  : null
              }
              <Collapsible collapsed={this.state.collapsed} align="center">
                <View>
                  {this.props.children}
                </View>
              </Collapsible>
              { (this.props.total - 2) > 0 ?
                <Touchable
                  onPress={() => {
                    this._toggleExpanded();
                  }}
                >
                  <View style={styles.collapsibleButton}>
                    <Text style={styles.wrapItemShowMore}>{ this.state.collapsed ? `Show more (${this.props.total - 2})` : 'Show less' }</Text>
                  </View>
                </Touchable> : null
              }
            </View>
            :
            <View style={{paddingBottom: 20}}>
              {this.props.children}
            </View>
        }

      </View>
    );
  }
}

export default WrapItem;
