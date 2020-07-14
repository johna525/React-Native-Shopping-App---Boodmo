import * as types from '../constants/ActionTypes';
import * as Config from '../constants/Config';
import * as Messages from '../constants/Messages';
import * as Log from './Log';
import {showAlert} from './SweetAlert';
import ApiUtils from '../utils/ApiUtils';
import {logout} from './User';

export function getPaymentInfo(payment_id, currentPaymentIndex) {
  return (dispatch, getState) => {
    dispatch(requestPaymentInfo());
    let url = `${Config.HOST}/payment/pay/${payment_id}`;
    let auth = `${getState().user.token_type} ${getState().user.access_token}`;
    ApiUtils.timeoutPromise(fetch(url, Config.GET(auth))
      .then(ApiUtils.checkStatus)
      .then(responseJson => {
        let payment = responseJson;
        payment['payment_id'] = payment_id;
        dispatch(receivePaymentInfo(payment, currentPaymentIndex));
      })
      .catch((error) => {
        if (error.status == 401) {
          dispatch(logout());
        }
        dispatch(receiveErrorPaymentInfo());
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`);
      })
      , 20000)
      .catch((error) => {
        if (error.status == 401) {
          dispatch(logout());
        }
        dispatch(receiveErrorPaymentInfo());
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`);
      });
  };
}

function requestPaymentInfo() {
  return {
    type: types.REQUEST_PAYMENT_INFO,
  };
}

function receiveErrorPaymentInfo(error = true) {
  return {
    type: types.RECEIVE_ERROR_PAYMENT_INFO,
    error
  };
}

function receivePaymentInfo(payment, currentPaymentIndex) {
  return {
    type: types.RECEIVE_PAYMENT_INFO,
    payment,
    currentPaymentIndex
  };
}

export function clearPayment() {
  return {
    type: types.CLEAR_PAYMENT_INFO,
  };
}
