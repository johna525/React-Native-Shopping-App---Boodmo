import React from 'react';
import {
  View,
  Text,
  Dimensions
} from 'react-native';
import styled from 'styled-components/native';

const moment = require('moment');
const SCREEN_WIDTH = Dimensions.get('window').width;

export default class PackageStatus extends React.Component {

  constructor(props) {
    super(props);
  }

  renderPoint = () => {
    return (
      <View>
      </View>
    );
  };

  render() {

    let {trackData} = this.props;
    return (
      <PackageStatusWrapper>
        { trackData.length > 0 ?
          trackData.map((point, index) => {
            let length = trackData.length;
            let lastPoint = trackData[length - 1];
            return (
              point.show ?
                <PointWrapper key={index}>
                  <GraphWrapper>
                    <Point active={point.status} style={{zIndex: 1}}>
                      <SmallPoint active={point.status} />
                    </Point>
                    {
                      length - 2 !== index && length - 1 !== index ?
                        <LinesWrapper>
                          <Line active={point.status} />
                          <Line active={trackData[index + 1] && trackData[index + 1].status || lastPoint.status} />
                        </LinesWrapper> : null
                    }
                  </GraphWrapper>
                  <Info>
                    <InfoText>{point.name}</InfoText>
                    <InfoText>{point.date ?
                      moment(`${point.date.date} +${point.date.timezone_type}`, 'YYYY-MM-DD').local().format('DD-MM-YYYY') : null
                    }</InfoText>
                  </Info>
                </PointWrapper> : null
            );
          }) : null
        }
      </PackageStatusWrapper>
    );
  }
}

const PackageStatusWrapper = styled.View`
  display: flex;
  padding-bottom: 15px;
`;

const Line = styled.View`
  display: flex;
  width: 10px;
  height: 38px;
  background-color: ${(props) => props.active ? 'rgb(153, 227, 246)' : 'rgb(239, 243, 245)'};
`;

const LinesWrapper = styled.View`
  display: flex;
  margin: -16px 0px -16px 0px;
  width: 10px;
`;

const Point = styled.View`
  display: flex;
  width: 32px;
  height: 32px;
  border-radius: 16;
  background-color: ${(props) => props.active ? 'rgb(153, 227, 246)' : 'rgb(239, 243, 245)'};
  justify-content: center;
  align-items: center;
`;

const SmallPoint = styled.View`
  display: flex;
  width: 14px;
  height: 14px;
  border-radius: 7;
  background-color: ${(props) => props.active ? 'rgb(22, 199, 246)' : 'rgb(239, 243, 245)'};
`;

const Info = styled.View`
  display: flex;
  padding: 0px 0px 0px 5px;
`;

const InfoText = styled.Text`
  width: ${SCREEN_WIDTH / 2 - 65};
  color: #000;
  font-weight: 100;
  font-size: 12px;
  flex-wrap: wrap;
  flex-direction: column;
`;

const GraphWrapper = styled.View`
  display: flex;
  width: 32px;
  justify-content: center;
  align-items: center;
`;

const PointWrapper = styled.View`
  display: flex;
  padding-left: 16px;
  flex-direction: row;
`;
