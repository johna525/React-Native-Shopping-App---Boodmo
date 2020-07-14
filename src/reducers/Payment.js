import * as types from '../constants/ActionTypes';

export default function payment(state = {
  payment: null,
  currentPaymentIndex: null,
  isFetching: false,
  paymentError: null,
}, action) {
  switch (action.type) {
  case types.REQUEST_PAYMENT_INFO:
    return {
      ...state,
      isFetching: true,
      payment: null,
      paymentError: null,
    };
  case types.RECEIVE_PAYMENT_INFO:
    return {
      ...state,
      isFetching: false,
      payment: action.payment,
      currentPaymentIndex: action.currentPaymentIndex,
      paymentError: null,
    };
  case types.RECEIVE_ERROR_PAYMENT_INFO:
    return {
      ...state,
      isFetching: false,
      payment: null,
      paymentError: action.error,
    };
  case types.CLEAR_PAYMENT_INFO:
    return {
      ...state,
      payment: null,
      currentPaymentIndex: null,
      isFetching: false,
      paymentError: null,
    };
  default:
    return state;
  }
}