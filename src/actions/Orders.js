import * as types from '../constants/ActionTypes';
import * as _ from 'lodash';
import * as Config from '../constants/Config';
import * as Messages from '../constants/Messages';
import * as Log from './Log';
import {showAlert} from './SweetAlert';
import ApiUtils from '../utils/ApiUtils';
import {logout} from './User';

export function getOrderList(refresh = false) {
  return (dispatch, getState) => {
    dispatch(requestOrderList(refresh));
    let url = `${Config.MC_HOST}/me/orders`;
    let auth = `${getState().user.token_type} ${getState().user.access_token}`;
    ApiUtils.timeoutPromise(fetch(url, Config.GET(auth))
      .then(ApiUtils.checkStatus)
      .then(responseJson => {
        let orders = _.values(responseJson);
        dispatch(receiveOrderList(orders));
      })
      .catch((error) => {
        if (error.status == 401) {
          dispatch(logout());
        }
        dispatch(receiveErrorOrderList());
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`);
      })
      , 20000)
      .catch((error) => {
        if (error.status == 401) {
          dispatch(logout());
        }
        dispatch(receiveErrorOrderList());
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`);
      });
  };
}

function requestOrderList(refresh) {
  return {
    type: types.REQUEST_ORDERS,
    refresh
  };
}

function receiveErrorOrderList() {
  return {
    type: types.RECEIVE_ERROR_ORDERS,
  };
}

function receiveOrderList(orders) {
  return {
    type: types.RECEIVE_ORDERS,
    orders
  };
}

export function getOrder(orderId, refresh = false) {
  return (dispatch, getState) => {
    dispatch(requestSelectedOrder(refresh));
    let url = `${Config.MC_HOST}/me/order-detail?id=${orderId}`;
    let auth = `${getState().user.token_type} ${getState().user.access_token}`;
    ApiUtils.timeoutPromise(fetch(url, Config.GET(auth))
      .then(ApiUtils.checkStatus)
      .then(responseJson => {
        let order = responseJson;
        order['base_currency'] = 'INR';
        dispatch(receiveSelectedOrder(order));
      })
      .catch((error) => {
        if (error.status == 401) {
          dispatch(logout());
        }
        dispatch(receiveErrorSelectedOrder());
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`);
      })
      , 20000)
      .catch((error) => {
        if (error.status == 401) {
          dispatch(logout());
        }
        dispatch(receiveErrorSelectedOrder());
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`);
      });
  };
}

function requestSelectedOrder(refresh) {
  return {
    type: types.REQUEST_SELECTED_ORDER,
    refresh
  };
}

function receiveErrorSelectedOrder() {
  return {
    type: types.RECEIVE_ERROR_SELECTED_ORDER,
  };
}

function receiveSelectedOrder(order) {
  return {
    type: types.RECEIVE_SELECTED_ORDER,
    order
  };
}


export function cancelProduct(order_id, item_id) {
  return (dispatch, getState) => {
    dispatch(requestCancelProduct());
    let url = `${Config.MC_HOST}/me/cancel?id=${item_id}`;
    let auth = `${getState().user.token_type} ${getState().user.access_token}`;
    ApiUtils.timeoutPromise(fetch(url, Config.GET(auth))
      .then(ApiUtils.checkStatus)
      .then(() => {
        dispatch(receiveCancelProduct());
        dispatch(getOrder(order_id, true));
        dispatch(getOrderList());
      })
      .catch((error) => {
        if (error.status == 401) {
          dispatch(logout());
        }
        dispatch(receiveErrorCancelProduct());
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`);
      })
      , 20000)
      .catch((error) => {
        if (error.status == 401) {
          dispatch(logout());
        }
        dispatch(receiveErrorCancelProduct());
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`);
      });
  };
}

function receiveCancelProduct() {
  return {
    type: types.RECEIVE_ORDER_CANCEL_PRODUCT
  };
}

function requestCancelProduct() {
  return {
    type: types.REQUEST_ORDER_CANCEL_PRODUCT
  };
}

function receiveErrorCancelProduct() {
  return {
    type: types.RECEIVE_ERROR_ORDER_CANCEL_PRODUCT,
  };
}

export function cancelOrder(order_id) {
  return (dispatch, getState) => {
    dispatch(requestCancelOrder());
    let url = `${Config.MC_HOST}/me/cancel-order?id=${order_id}`;
    let auth = `${getState().user.token_type} ${getState().user.access_token}`;
    ApiUtils.timeoutPromise(fetch(url, Config.GET(auth))
      .then(ApiUtils.checkStatus)
      .then(() => {
        dispatch(receiveCancelOrder());
        dispatch(getOrder(order_id));
      })
      .catch((error) => {
        if (error.status == 401) {
          dispatch(logout());
        }
        dispatch(receiveErrorCancelOrder());
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`);
      })
      , 20000)
      .catch((error) => {
        if (error.status == 401) {
          dispatch(logout());
        }
        dispatch(receiveErrorCancelOrder());
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`);
      });
  };
}

function receiveCancelOrder() {
  return {
    type: types.RECEIVE_CANCEL_ORDER
  };
}

function requestCancelOrder() {
  return {
    type: types.REQUEST_CANCEL_ORDER
  };
}

function receiveErrorCancelOrder() {
  return {
    type: types.RECEIVE_ERROR_CANCEL_ORDER,
  };
}
