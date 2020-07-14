import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Text,
  Platform,
} from 'react-native';

const Touchable = Platform.OS === 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableOpacity;
import LoadingIndicator from '../../../components/LoadingIndicator';
import Icon from 'react-native-vector-icons/FontAwesome';
import Button from '../../../components/Button';
import {Col, Row} from 'react-native-easy-grid';
import styles from '../styles';
import * as Colors from '../../../constants/Colors';
import * as Sort from '../../../utils/Sort';

require('../../../utils/Helper');

class MorePartsValue extends Component {
  constructor(props) {
    super(props);
  }

  getTextForBrandsHeader(items) {
    if (items) {
      return items.reduce((result, nextItem) => {
        return result.indexOf(nextItem.brand) === -1 ? [...result, nextItem.brand] : result;
      }, []).join(', ');
    }

    return items;
  }

  render() {
    const innerStyle = {
      tableHeaderContainer: {
        backgroundColor: '#ffffff',
        padding: 0
      },
      tableHeader: {
        flexDirection: 'row',
      },
      tableHeaderText: {
        color: '#000',
        fontWeight: 'bold',
        flexGrow: 1,
        fontSize: 16,
        textAlign: 'center'
      },
      cell: {
        paddingHorizontal: 2,
        paddingVertical: 2,
        borderWidth: 0.5,
        flexGrow: 1,
        fontSize: 13,
        borderColor: Colors.SEPARATOR
      },
    };
    let cheapest = {};
    const {items} = this.props;

    if (this.props.length !== 0 && items.length !== 0) {
      cheapest = this.props.partsType === 'replacements' ? items.reduce(Sort.cheaper) : items[0];
    }
    return (
      (this.props.length !== 0) ?
        <Touchable onPress={this.props.action}>
          <View>
            <View style={[styles.wrapItemColumn, {
              alignItems: 'center',
              paddingVertical: 10,
              justifyContent: 'space-between'
            }]}>
              <Text style={styles.wrapItemLinkText}>{this.props.label}</Text>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.wrapItemLinkCount}>{this.props.length}</Text>
                <Icon name="caret-right" style={styles.wrapItemLinkIcon}/>
              </View>
            </View>
            <View>
              {items ?
                this.props.partsType === 'replacements' ?
                  <View>
                    <Row style={{paddingVertical: 0, marginVertical: 0}}>
                      <Col><Text style={[innerStyle.cell, innerStyle.tableHeaderText]}>Name</Text></Col>
                      <Col><Text style={[innerStyle.cell, innerStyle.tableHeaderText]}>Part Number</Text></Col>
                      <Col><Text style={[innerStyle.cell, innerStyle.tableHeaderText]}>Brand</Text></Col>
                      <Col><Text style={[innerStyle.cell, innerStyle.tableHeaderText]}>Price</Text></Col>
                    </Row>
                    <Row style={{paddingVertical: 0, marginVertical: 0}}>
                      <Col><Text style={innerStyle.cell}>{cheapest['name']}</Text></Col>
                      <Col><Text
                        style={innerStyle.cell}>{cheapest['partNumber']}</Text></Col>
                      <Col><Text style={innerStyle.cell}>{cheapest['brand']}</Text></Col>
                      <Col>
                        <Text
                          style={innerStyle.cell}>
                          {
                            (cheapest['price'] != null) ?
                              `${cheapest['currency'].outputUnicode()} ${cheapest['price']}`
                              :
                              'No information'
                          }
                        </Text>
                      </Col>
                    </Row>
                  </View>
                  :
                  <View>
                    <View style={innerStyle.tableHeaderContainer}>
                      <Row style={innerStyle.tableHeader}>
                        <Col><Text
                          style={[innerStyle.cell, innerStyle.tableHeaderText]}>{this.getTextForBrandsHeader(items)}</Text></Col>
                      </Row>
                    </View>
                    <Row style={{paddingVertical: 0, marginVertical: 0}}>
                      <Col><Text style={[innerStyle.cell, innerStyle.tableHeaderText]}>Model</Text></Col>
                      <Col><Text style={[innerStyle.cell, innerStyle.tableHeaderText]}>Year</Text></Col>
                      <Col><Text style={[innerStyle.cell, innerStyle.tableHeaderText]}>Engine</Text></Col>
                      <Col><Text style={[innerStyle.cell, innerStyle.tableHeaderText]}>Power
                                                (hp)</Text></Col>
                      <Col><Text style={[innerStyle.cell, innerStyle.tableHeaderText]}>Engine
                                                type</Text></Col>
                    </Row>
                    <Row style={{paddingVertical: 0, marginVertical: 0}}>
                      <Col><Text
                        style={innerStyle.cell}>{cheapest['model']}</Text></Col>
                      <Col><Text style={innerStyle.cell}>{cheapest['yearStart']}
                                                - {cheapest['yearEnd']}</Text></Col>
                      <Col><Text
                        style={innerStyle.cell}>{cheapest['engine']}</Text></Col>
                      <Col><Text style={innerStyle.cell}>{cheapest['power-hp']}</Text></Col>
                      <Col><Text
                        style={innerStyle.cell}>{cheapest['engine-type']}</Text></Col>
                    </Row>
                  </View>

                :
                null
              }
            </View>
          </View>

        </Touchable>
        :
        this.props.loading ?
          <LoadingIndicator
            size="small"
            style={{
              marginRight: 20
            }}
          />
          :
          this.props.error ?
            <Button
              onPress={() => {
                this.props.onRefreshClick;
              }}
              underlayColor={Colors.BUTTON_BLUE_ACTIVE}
              style={{
                width: 200,
                backgroundColor: Colors.BUTTON_BLUE,
                borderColor: Colors.BUTTON_BLUE,
              }}
              textStyle={{
                color: '#FFF'
              }}>
                            Try again
            </Button>
            :
            null
    );
  }
}

export default MorePartsValue;
