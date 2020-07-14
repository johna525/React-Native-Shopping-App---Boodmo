import React from 'react';
import {
    View,
    ScrollView,
    RefreshControl,
    Text,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getField } from "../../utils/Helper"

import ActionBar from '../../components/ActionBar';

import styled from 'styled-components/native';

import * as Colors from '../../constants/Colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

import * as ordersActions from '../../actions/Orders';
import * as sweetAlertActions from '../../actions/SweetAlert';
import * as paymentActions from '../../actions/Payment';

import PackageProducts from './components/PackageProducts';
import PackageStatus from './components/PackageStatus';

class OrderTrackingPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          isFetching: false
        }
    }

    componentDidMount() {
        this.props.actions.getOrder(this.props.route.orderId);
        if (this.props.route.paymentId) {
            this.props.actions.getPaymentInfo(this.props.route.paymentId);
        }
    }

    componentWillReceiveProps(nextProps) {
      if (this.state.isFetching !== nextProps.isFetching) {
        this.setState({ isFetching: nextProps.isFetching });
      }
    }

    onRefresh = () => {
        this.props.actions.getOrder(this.props.route.orderId, true);
    }

    render() {
        let {
            navigator,
            actions,
            total,
            platformOS,
            selectedOrder,
            email,
            isFetching
        } = this.props;

        let customer = selectedOrder.customer || {};
        let addressInfo = customer.address || {};

        return (
            <StyledContainer>
              {this.props.platformOS === 'ios' ? <StyledStatusBar /> : null}
              <ActionBar
                  navigator={navigator}
                  openDrawer={() => this.props.openDrawer()}
                  onBackPress={this.onRefresh}
                  title={`Order #${this.props.route.number}`}
                  total={total} />
              <MainWrapper>
                <MainHeader>Tracking information</MainHeader>
                <ScrollView
                  refreshControl={
                      <RefreshControl
                          refreshing={this.state.isFetching}
                          onRefresh={this.onRefresh}
                      />
                  }
                >
                  {
                    selectedOrder ?
                    <View>
                      { selectedOrder.packages.map((pack, index) => {
                          return (
                            <ListsWrapper key={index}>
                              <View style={{ width: SCREEN_WIDTH / 2 - 15 }}>
                                <View style={{ marginBottom: 15 }}>
                                  { index === 0 ?
                                    <View>
                                      <ListHeader>Shipping to:</ListHeader>
                                      <UserInfoBlock>
                                        <SimpleText>{customer.full_name}</SimpleText>
                                        <SimpleText>{email}</SimpleText>
                                        <SimpleText>{`${addressInfo.state}, ${addressInfo.address}, ${addressInfo.pin}`}</SimpleText>
                                        <SimpleText>{customer.phone}</SimpleText>
                                      </UserInfoBlock>
                                      <TouchableWithoutFeedback onPress={() => {
                                        this.props.navigator.push({
                                            id: 'OrderInfoPage',
                                            orderId: this.props.route.orderId,
                                            number: this.props.route.number,
                                            paymentId: this.props.route.paymentId
                                        });
                                      }}>
                                        <StyledButton>
                                          <ButtonText>View/Edit Details</ButtonText>
                                        </StyledButton>
                                      </TouchableWithoutFeedback>
                                    </View> : null
                                  }
                                  <View>
                                    <SimpleText>Package: #{pack.full_number}</SimpleText>
                                    <StatusWrapper>
                                      <SimpleText>Status: </SimpleText>
                                      <StatusIcon cancelled={pack.customer_status.toLowerCase() === "cancelled"}>
                                        <StatusText>{pack.customer_status}</StatusText>
                                      </StatusIcon>
                                    </StatusWrapper>
                                    <SimpleText>Sold by: {pack.supplier && pack.supplier.name}</SimpleText>
                                    {pack.carrier ?
                                      <SimpleText>
                                        Shipment by {pack.carrier}, tracking No.: {pack.shipping_box && pack.shipping_box.track_number}
                                      </SimpleText> : null}
                                  </View>
                                </View>
                                <PackageStatus trackData={Object.values(pack.track_data || {})} />
                              </View>
                              <StyledList>
                                <ListHeader>Items in package:</ListHeader>
                                <PackageProducts
                                  navigator={this.props.navigator} data={pack.items.sort((a, b) => {
                                    return a.customer_status.toLowerCase() === "cancelled" ? true : false
                                })} />
                              </StyledList>
                            </ListsWrapper>
                        )})}
                     </View> : null
                  }
                </ScrollView>
              </MainWrapper>
            </StyledContainer>
        );
    }
}


function mapStateToProps(state) {
    return {
      isFetching: state.orders.orderIsFetching,
      total: state.cart.total,
      platformOS: state.device.platformOS,
      selectedOrder: state.orders.selectedOrder,
      email: state.user.email
    }
}

function mapDispatchToProps(dispatch) {
    return {actions: bindActionCreators({...ordersActions, ...sweetAlertActions, ...paymentActions}, dispatch)}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(OrderTrackingPage);

const StyledContainer = styled.View`
  flex-grow: 1;
  background-color: ${Colors.PAGE_BACKGROUND};
`;

const StyledStatusBar = styled.View`
  background-color: ${Colors.PRIMARY};
  height: 20px;
  width: ${SCREEN_WIDTH};
  z-index: 1;
`;

const MainWrapper = styled.View`
  padding-top: 10px;
  width: ${SCREEN_WIDTH};
  height: ${SCREEN_HEIGHT - 75};
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
`;

const MainHeader = styled.Text`
  display: flex;
  color: #000;
  font-size: 16px;
  margin-bottom: 15px;
  align-self: center;
`;

const ListsWrapper = styled.View`
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  margin-bottom: 10px;
  border-bottom-width: 1px;
  border-bottom-color: rgb(153, 227, 246);
`;

const StyledList = styled.View`
  width: ${SCREEN_WIDTH / 2};
`;

const ListHeader = styled.Text`
  display: flex;
  color: #000;
  font-size: 14px;
  font-weight: 100;
`;

const UserInfoBlock = styled.View`
  display: flex;
  margin: 10px 0px 0px 0px;
`;

const SimpleText = styled.Text`
  display: flex;
  color: #000;
  font-size: 12px;
  font-weight: 100;
`;

const StatusText = styled.Text`
  padding: 2px;
  color: #fff;
  font-weight: 800;
  font-size: 11px;
`;

const StatusIcon = styled.View`
  background-color: ${(props) => props.cancelled ? "#d9534f" : "#5cb85c"};
  border-radius: 4px;
  border-color: ${(props) => props.cancelled ? "#d9534f" : "#5cb85c"};
  border-width: 1px;
`;

const StatusWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

const StyledButton = styled.View`
  border-radius: 4;
  border-color: #000;
  background-color: rgb(239, 243, 245);
  border-width: 1px;
  justify-content: center;
  align-items: center;
  width: ${SCREEN_WIDTH / 2 - 80};
  margin: 10px 0px 10px 0px;
  padding: 4px;
`;

const ButtonText = styled.Text`
  color: #000;
  font-size: 10px;
  font-weight: 100;
`;
