import React from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableNativeFeedback,
  TouchableOpacity,
  Platform
} from 'react-native';
import styled from 'styled-components/native';

const SCREEN_WIDTH = Dimensions.get('window').width;

import * as Config from '../../../constants/Config';
import * as Colors from '../../../constants/Colors';

const Touchable = Platform.OS === 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableOpacity;

export default class PackageProducts extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ListWrapper>
        {
          this.props.data.map((item, index) => {
            return (
              <ProductContainer style={item.customer_status.toLowerCase() === 'cancelled' ? {
                backgroundColor: '#fff3f3'
              } : {}} key={index}>
                <ItemImage source={item.part_image ? {uri:  `${Config.IMAGE_FOLDER}${item.part_image}`} :
                  require('boodmo/src/assets/product_default.jpg') } />
                <ProductInfoWrapper>
                  <Touchable onPress={() => {
                    this.props.navigator.push({
                      id: 'ProductPage',
                      partId: item.part_id
                    });
                  }}>
                    <HighlightedText>{item.name}</HighlightedText>
                  </Touchable>
                  <StyledText>{item.brand}, {item.number},</StyledText>
                  <StyledText>{item.customer_status}</StyledText>
                </ProductInfoWrapper>
                <Separator />
              </ProductContainer>
            );
          })
        }
      </ListWrapper>
    );
  }

}

const ItemImage = styled.Image`
  display: flex;
  height: 60px;
  width: 60px;
`;

const ProductInfoWrapper = styled.View`
  display: flex;
  width: ${SCREEN_WIDTH / 2 - 65};
  padding-left: 5px;
  flex-direction: column;
`;

const ProductContainer = styled.View`
  display: flex;
  flex-direction: row;
  width: ${SCREEN_WIDTH / 2};
  padding: 5px;
`;

const HighlightedText = styled.Text`
  color: rgb(89, 170, 231);
  font-weight: 100;
  font-size: 12px;
`;

const StyledText = styled.Text`
  font-weight: 100;
  font-size: 12px;
`;

const Separator = styled.View`
  height: 1px;
  backgroundColor: ${Colors.SEPARATOR};
`;

const ListWrapper = styled.View`
  padding-top: 10px;
  padding-bottom: 20px;
`;
