import * as types from '../constants/ActionTypes';

export default function product(state = {
  selectedProduct: null,
  partInfo: null,
  pinInfo: null,
  assured_return_period: null,
  isFetching: true,
  fetched: false,
  error: false,
  mainSupplier: null,
  suppliers: null,
  suppliersIsFetching: true,
  suppliersFetched: false,
  suppliersError: false,
  aftermarketParts: {
    count: 0,
    items: null,
  },
  oemParts: {
    count: 0,
    items: null,
  },
  replacementsIsFetching: true,
  replacementsFetched: false,
  replacementsError: false,
  compatibility: {
    count: 0,
    items: null,
  },
  compatibilityIsFetching: true,
  compatibilityFetched: false,
  compatibilityError: false,
  addToCartIsFetching: false,
  addToCartFetched: false,
}, action) {
  switch (action.type) {
  case types.REQUEST_PRODUCT_PARTINFO:
    return {
      ...state,
      isFetching: true,
      fetched: false,
      error: false
    };
  case types.RECEIVE_PRODUCT_PARTINFO:
    return {
      ...state,
      isFetching: false,
      fetched: true,
      error: false,
      selectedProduct: action.selectedProduct,
      partInfo: action.partInfo,
      assured_return_period: action.assured_return_period
    };
  case types.RECEIVE_ERROR_PRODUCT_PARTINFO:
    return {
      ...state,
      isFetching: false,
      fetched: false,
      error: false,
    };
  case types.REQUEST_PRODUCT_SUPPLIERS:
    return {
      ...state,
      suppliersIsFetching: true,
      suppliersFetched: false,
      suppliersError: false,
    };
  case types.RECEIVE_PRODUCT_SUPPLIERS:
    return {
      ...state,
      suppliersIsFetching: false,
      suppliersFetched: true,
      suppliersError: false,
      mainSupplier: action.mainSupplier,
      suppliers: action.suppliers,
    };
  case types.RECEIVE_ERROR_PRODUCT_SUPPLIERS:
    return {
      ...state,
      suppliersIsFetching: false,
      suppliersFetched: false,
      suppliersError: true,
    };
  case types.REQUEST_PRODUCT_REPLACEMENTS:
    return {
      ...state,
      replacementsIsFetching: true,
      replacementsFetched: false,
      replacementsError: false,
    };
  case types.RECEIVE_PRODUCT_REPLACEMENTS:
    return {
      ...state,
      replacementsIsFetching: false,
      replacementsFetched: true,
      replacementsError: false,
      aftermarketParts: action.aftermarketParts,
      oemParts: action.oemParts,
    };
  case types.RECEIVE_ERROR_PRODUCT_REPLACEMENTS:
    return {
      ...state,
      replacementsIsFetching: false,
      replacementsFetched: false,
      replacementsError: true,
    };
  case types.REQUEST_PRODUCT_COMPATIBILITY:
    return {
      ...state,
      compatibilityIsFetching: true,
      compatibilityFetched: false,
      compatibilityError: false,
    };
  case types.RECEIVE_PRODUCT_COMPATIBILITY:
    return {
      ...state,
      compatibilityIsFetching: false,
      compatibilityFetched: true,
      compatibilityError: false,
      compatibility: action.compatibility,
    };
  case types.RECEIVE_PIN_INFO:
    return {
      ...state,
      pinInfo: action.pinInfo,
    };
  case types.REQUEST_PRODUCT_ADDTOCART:
    return {
      ...state,
      addToCartIsFetching: true,
      compatibilityFetched: false
    };
  case types.RECEIVE_PRODUCT_ADDTOCART:
    return {
      ...state,
      addToCartIsFetching: false,
      addToCartFetched: true
    };
  case types.PRODUCT_ADDEDTOCART:
    return {
      ...state,
      addToCartIsFetching: false,
      addToCartFetched: false
    };
  case types.RECEIVE_ERROR_PRODUCT_ADDTOCART:
    return {
      ...state,
      addToCartIsFetching: false,
      addToCartFetched: false
    };
  case types.CLEAR_PRODUCT:
    return {
      ...state,
      selectedProduct: null,
      assured_return_period: null,
      partInfo: null,
      isFetching: true,
      fetched: false,
      error: false,
      mainSupplier: null,
      suppliers: null,
      suppliersIsFetching: true,
      suppliersFetched: false,
      suppliersError: false,
      aftermarketParts: {
        count: 0,
        items: null,
      },
      oemParts: {
        count: 0,
        items: null,
      },
      replacementsIsFetching: true,
      replacementsFetched: false,
      replacementsError: false,
      compatibility: {
        count: 0,
        items: null,
      },
      compatibilityIsFetching: true,
      compatibilityFetched: false,
      compatibilityError: false,
      addToCartIsFetching: false,
      addToCartFetched: false,
    };
  default:
    return state;
  }
}
