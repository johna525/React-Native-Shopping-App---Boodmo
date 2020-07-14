import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet
} from 'react-native';
import SelectInput from '../../../components/SelectInput';
import Range from '../../../components/Range';

import {metricsFilterOptionClick} from '../../../utils/metrics';

import * as Colors from '../../../constants/Colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

class Item extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={[{
        flexDirection: 'row',
        justifyContent: 'space-between',
        opacity: this.props.disabled ? 0.3 : 1,
      }, this.props.style, {marginTop: 0, marginBottom: 0}]}>
        <Text style={[styles.itemText, {
          fontWeight: 'bold',
          paddingVertical: 15,
          marginRight: 10,
        }]}>{this.props.title}</Text>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}>
          {
            (this.props.type == 'select') ?
              <SelectInput
                metricsData={this.props.title}
                metricsFunc={metricsFilterOptionClick}
                removeOpacity={this.props.removeOpacity}
                needBlack={this.props.needBlack}
                data={this.props.data}
                placeholder={this.props.placeholder}
                disabled={this.props.disabled}
                value={this.props.selectedValue}
                loading={this.props.loading}
                error={this.props.error ? this.props.error : null}
                onValueChange={this.props.onValueChange}
                onSubmitClick={this.props.onSubmitClick}
                onClearClick={this.props.onClearClick}
                viewStyle={styles.selectInput}
                textStyle={[styles.itemText, {width: 130, textAlign: 'right'}]}
                iconStyle={[styles.itemText, {fontSize: 25, marginLeft: 30}]}
                loadingStyle={{marginLeft: 14}}
                iconName={'caret-right'}
                activeColor={Colors.PRIMARY}
                disabledOpacity={1}
                hitSlop={{top: 5, left: SCREEN_WIDTH, bottom: 5, right: 0}}/>
              :
              <Range
                metricsData={this.props.title}
                metricsFunc={metricsFilterOptionClick}
                price_range_min={this.props.price_range_min}
                price_range_max={this.props.price_range_max}
                onMinChange={this.props.onMinChange}
                onMaxChange={this.props.onMaxChange}
                disabled={this.props.disabled}
                placeholder={this.props.placeholder}
                viewStyle={styles.selectInput}
                textStyle={styles.itemText}
                iconStyle={[styles.itemText, {fontSize: 25, marginLeft: 30}]}
                iconName={'caret-right'}
                activeColor={Colors.PRIMARY}
                disabledOpacity={1}
                hitSlop={{top: 5, left: SCREEN_WIDTH, bottom: 5, right: 0}}
              />
          }
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  itemText: {
    color: Colors.PRIMARY,
    fontSize: 16,
  },
  selectInput: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 50,
    flexGrow: 1,
  },
});

export default Item;
