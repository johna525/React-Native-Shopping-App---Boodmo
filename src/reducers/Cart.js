import * as types from '../constants/ActionTypes';

export default function cart(state = {
  cart: [],
  count: 0,
  total: 0,
  amount: 0,
  offlineLoaded: false,
  products: [],
  isFetching: false,
  isUpdated: false,
  error: false
}, action) {
  switch (action.type) {
  case types.ADD_TO_CART:
  case types.REMOVE_LOCAL_PRODUCTS_FROM_CART:
    return {
      ...state,
      cart: action.cart,
      count: action.cart.length,
      isUpdated: true
    };
  case types.ADD_DRAFT_PRODUCT_TO_CART:
    let cart = [...state.cart];
    let products = [...state.products];
    let {total, count, amount} = {...state};
    if (cart.filter((arr) => arr.productId === action.data.product.id).length === 0) {
      cart.push({productId: action.data.product.id, quantity: 1});
      products.push(action.data);
      count++;
      total++;
      amount += parseFloat(action.data.product.price.amount);
    } else {
      cart.map((arr) => {
        if (arr.productId === action.data.product.id) {arr.quantity++;}
      });
      total++;
      amount += parseFloat(action.data.product.price.amount);
    }
    return {
      ...state,
      cart,
      products,
      count,
      amount,
      total
    };
  case types.DELETE_FROM_CART:
  case types.UPDATE_QUANTITY_CART:
    return {
      ...state,
      cart: action.cart,
      count: action.cart.length,
      products: action.products,
      isUpdated: true
    };
  case types.UPDATE_CART_INFO:
    return {
      ...state,
      cart: action.cart,
      count: action.count,
      total: action.total,
      amount: action.amount
    };
  case types.REQUEST_CART_PRODUCTS:
    return {
      ...state,
      isFetching: true,
      error: false
    };
  case types.RECEIVE_CART_PRODUCTS:
    return {
      ...state,
      isFetching: false,
      error: false,
      products: action.products
    };
  case types.RECEIVE_ERROR_CART_PRODUCTS:
    return {
      ...state,
      isFetching: false,
      error: true,
      products: [],
      cart: [],
    };
  case types.CLEAR_CART:
    return {
      ...state,
      cart: [],
      products: [],
      count: 0,
      total: 0,
      amount: 0,
      isUpdated: true
    };
  case types.BETAOUT_UPDATE:
    return {
      ...state,
      isUpdated: false
    };
  default:
    return state;
  }
}
