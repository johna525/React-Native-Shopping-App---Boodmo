import React, {Component} from 'react';
import {
  Dimensions,
  TouchableWithoutFeedback,
  Platform
} from 'react-native';
import styled from 'styled-components/native';

export class SupportButton extends Component {
  render() {
    return (
      <StyledWrapper>
        <TouchableWithoutFeedback onPress={this.props.fireFreshdeskModal}>
          <StyledText>Support</StyledText>
        </TouchableWithoutFeedback>
      </StyledWrapper>
    );
  }
}

const StyledWrapper = styled.View`
  position: absolute;
  right: 0px;
  top: ${Dimensions.get('window').height / 2.5};
  transform: translate(0px, 30px) rotate(-90deg);
  background-color: rgb(255, 0, 0);
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
  padding: 2px 12px ${Platform.OS === 'ios' ? 6 : 10}px 12px;
`;

const StyledText = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: #FFF;
`;
