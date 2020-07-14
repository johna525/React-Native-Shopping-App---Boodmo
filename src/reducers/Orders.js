import * as types from '../constants/ActionTypes';

export default function orders(state = {
  orders: [],
  ordersError: null,
  isFetching: false,
  orderIsFetching: false,
  selectedOrder: {
    packages: []
  },
  selectedOrderError: null,
  isFetchingModal: false,
}, action) {
  switch (action.type) {
  case types.REQUEST_ORDERS:
    return {
      ...state,
      isFetching: true,
      orders: !action.refresh ? [] : state.orders,
      ordersError: null,
    };
  case types.RECEIVE_ORDERS:
    return {
      ...state,
      isFetching: false,
      orders: action.orders,
      ordersError: null,
    };
  case types.RECEIVE_ERROR_ORDERS:
    return {
      ...state,
      isFetching: false,
      orders: [],
      ordersError: action.error,
    };
  case types.REQUEST_SELECTED_ORDER:
    return {
      ...state,
      orderIsFetching: true,
      selectedOrder: !action.refresh ? {
        packages: []
      } : state.selectedOrder,
      selectedOrderError: null,
    };
  case types.RECEIVE_SELECTED_ORDER:
    return {
      ...state,
      orderIsFetching: false,
      selectedOrder: action.order,
      selectedOrderError: null,
    };
  case types.RECEIVE_ERROR_SELECTED_ORDER:
    return {
      ...state,
      orderIsFetching: false,
      selectedOrder: {
        packages: []
      },
      selectedOrderError: action.error,
    };
  case types.REQUEST_ORDER_CANCEL_PRODUCT:
    return {
      ...state,
      isFetchingModal: true,
    };
  case types.RECEIVE_ORDER_CANCEL_PRODUCT:
    return {
      ...state,
      isFetchingModal: false,
    };
  case types.RECEIVE_ERROR_ORDER_CANCEL_PRODUCT:
    return {
      ...state,
      isFetchingModal: false,
    };
  case types.REQUEST_CANCEL_ORDER:
    return {
      ...state,
      isFetchingModal: true,
    };
  case types.RECEIVE_CANCEL_ORDER:
    return {
      ...state,
      isFetchingModal: false,
    };
  case types.RECEIVE_ERROR_CANCEL_ORDER:
    return {
      ...state,
      isFetchingModal: false,
    };
  default:
    return state;
  }
}
