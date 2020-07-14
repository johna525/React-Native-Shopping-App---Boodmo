import * as _ from 'lodash';

import * as types from '../constants/ActionTypes';
import ApiUtils from '../utils/ApiUtils';
import {updateQueryStringParameter} from '../utils/Url';
import * as Config from '../constants/Config';
import * as Messages from '../constants/Messages';
import * as Log from './Log';
import {showAlert} from './SweetAlert';
import * as BetaOut from './Betaout';


//==========================================================
// PART INFO
//==========================================================

export function getPartInfo(selectedProduct, deliveryPin = false) {
  return (dispatch) => {
    return dispatch(fetchProduct(selectedProduct, deliveryPin));
  };
}


function fetchProduct(selectedProduct, deliveryPin) {
  return (dispatch, getState) => {
    dispatch(requestProduct());
    let currency = getState().user.currentCurrency,
      currencyString = '';
    if (currency) {
      currencyString = `?currency=${currency.value}`;
    }
    let url = `${Config.MC_HOST}/part/${selectedProduct}${currencyString}`;
    if (deliveryPin) {url = updateQueryStringParameter(url, 'pin', deliveryPin);}
    ApiUtils.timeoutPromise(fetch(url, Config.GET)
      .then(ApiUtils.checkStatus)
      .then(responseJson => {
        if (deliveryPin) {
          checkPin(deliveryPin);
        }
        let partInfo = responseJson.part;
        let assured_return_period = responseJson.assured_return_period;
        dispatch(receiveProduct(selectedProduct, partInfo, assured_return_period));
        let mainSupplier = responseJson.best_offer;
        let suppliers = responseJson.price_list;
        dispatch(receiveProductSuppliers(mainSupplier, suppliers));
        dispatch(getOtherInfo(selectedProduct));

        if (mainSupplier) {
          dispatch(BetaOut.viewProduct(mainSupplier));
        } else {
          partInfo.currency = currency.value;
          dispatch(BetaOut.viewProduct(partInfo));
        }
      })
      .catch((error) => {
        dispatch(receiveErrorProductPartInfo());
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`);
      })
      , 20000)
      .catch((error) => {
        dispatch(receiveErrorProductPartInfo());
        dispatch(showAlert('Error', error.message));
        Log.logCrash(`${url} - ${error.message}`);
      });
  };
}

function requestProduct() {
  return {
    type: types.REQUEST_PRODUCT_PARTINFO,
  };
}

function receiveProduct(selectedProduct, partInfo, assured_return_period) {
  return {
    type: types.RECEIVE_PRODUCT_PARTINFO,
    selectedProduct,
    partInfo,
    assured_return_period
  };
}

function receiveErrorProductPartInfo() {
  return {
    type: types.RECEIVE_ERROR_PRODUCT_PARTINFO
  };
}

function getOtherInfo(selectedProduct) {
  return (dispatch) => {
    // dispatch(getSuppliers(selectedProduct));
    dispatch(getReplacements(selectedProduct));
    dispatch(getCompatibility(selectedProduct));
  };
}

//==========================================================
// CHECK PIN
//==========================================================

export function getPinInfo(pin) {
  return (dispatch) => {
    return dispatch(checkPin(pin));
  };
}

function checkPin(pin) {
  return (dispatch) => {
    let url = `${Config.MC_HOST}/location?pin=${pin}`;

    ApiUtils.timeoutPromise(fetch(url, Config.GET())
      .then(ApiUtils.checkStatus)
      .then(responseJson => {
        console.log('validatePin response: ', responseJson);
        if (!_.isEmpty(responseJson)) {
          dispatch(receiveValidatePin(responseJson));
        } else {
          dispatch(receiveValidatePin({pin}));
          // dispatch(receiveErrorValidatePin());
        }
      })
      .catch((error) => {
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`);
      })
      , 20000)
      .catch((error) => {
        dispatch(showAlert('Error', error.message));
        Log.logCrash(`${url} - ${error.message}`);
      });
  };
}

function receiveValidatePin(pinInfo) {
  return {
    type: types.RECEIVE_PIN_INFO,
    pinInfo
  };
}

//==========================================================
// SUPPLIERS
//==========================================================

export function getSuppliers(selectedProduct) {
  return (dispatch, getState) => {
    dispatch(requestProductSuppliers());
    let currency = getState().user.currentCurrency,
      currencyString = '';
    if (currency) {
      currencyString = `?currency=${currency.value}`;
    }
    let url = `${Config.HOST}/sold-by/${selectedProduct}${currencyString}`;
    ApiUtils.timeoutPromise(fetch(url, Config.GET)
      .then(ApiUtils.checkStatus)
      .then(responseJson => {
        let mainSupplier = responseJson['mainSeller'] ? responseJson['mainSeller'] : null;
        let suppliers = responseJson.items;
        dispatch(receiveProductSuppliers(mainSupplier, suppliers));
      })
      .catch((error) => {
        dispatch(receiveErrorProductSuppliers());
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`);
      })
      , 20000)
      .catch((error) => {
        dispatch(receiveErrorProductSuppliers());
        dispatch(showAlert('Error', error.message));
        Log.logCrash(`${url} - ${error.message}`);
      });
  };
}


function requestProductSuppliers() {
  return {
    type: types.REQUEST_PRODUCT_SUPPLIERS,
  };
}

function receiveProductSuppliers(mainSupplier, suppliers) {
  return {
    type: types.RECEIVE_PRODUCT_SUPPLIERS,
    mainSupplier: mainSupplier,
    suppliers: suppliers,
  };
}

function receiveErrorProductSuppliers() {
  return {
    type: types.RECEIVE_ERROR_PRODUCT_SUPPLIERS
  };
}

//==========================================================
// REPLACEMENTS
//==========================================================

export function getReplacements(selectedProduct) {
  return (dispatch, getState) => {
    dispatch(requestProductReplacements());
    let currency = getState().user.currentCurrency,
      currencyString = '';
    if (currency) {
      currencyString = `?currency=${currency.value}`;
    }
    let url = `${Config.HOST}/replacements/${selectedProduct}${currencyString}`;
    ApiUtils.timeoutPromise(fetch(url, Config.GET)
      .then(ApiUtils.checkStatus)
      .then(responseJson => {
        let aftermarketParts = {
          count: responseJson.originalCountReplacement,
          items: responseJson.aftermarket,
        };
        let oemParts = {
          count: responseJson.originalCountOem,
          items: responseJson.oem,
        };
        dispatch(receiveProductReplacements(aftermarketParts, oemParts));
      })
      .catch((error) => {
        dispatch(receiveErrorProductReplacements());
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`);
      })
      , 20000)
      .catch((error) => {
        dispatch(receiveErrorProductReplacements());
        dispatch(showAlert('Error', error.message));
        Log.logCrash(`${url} - ${error.message}`);
      });
  };
}

function requestProductReplacements() {
  return {
    type: types.REQUEST_PRODUCT_REPLACEMENTS,
  };
}

function receiveProductReplacements(aftermarketParts, oemParts) {
  return {
    type: types.RECEIVE_PRODUCT_REPLACEMENTS,
    aftermarketParts: aftermarketParts,
    oemParts: oemParts,
  };
}

function receiveErrorProductReplacements() {
  return {
    type: types.RECEIVE_ERROR_PRODUCT_REPLACEMENTS
  };
}

//==========================================================
// COMPATIBILITY
//==========================================================

export function getCompatibility(selectedProduct) {
  return (dispatch, getState) => {
    dispatch(requestProductCompatibility());
    let currency = getState().user.currentCurrency,
      currencyString = '';
    if (currency) {
      currencyString = `?currency=${currency.value}`;
    }
    let url = `${Config.HOST}/applicability/${selectedProduct}${currencyString}`;
    ApiUtils.timeoutPromise(fetch(url, Config.GET)
      .then(ApiUtils.checkStatus)
      .then(responseJson => {
        let compatibility = {
          count: responseJson.total,
          items: responseJson.items,
        };
        dispatch(receiveProductCompatibility(compatibility));
      })
      .catch((error) => {
        dispatch(receiveErrorProductCompatibility());
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`);
      })
      , 20000)
      .catch((error) => {
        dispatch(receiveErrorProductCompatibility());
        dispatch(showAlert('Error', error.message));
        Log.logCrash(`${url} - ${error.message}`);
      });
  };
}

function requestProductCompatibility() {
  return {
    type: types.REQUEST_PRODUCT_COMPATIBILITY,
  };
}

function receiveProductCompatibility(compatibility) {
  return {
    type: types.RECEIVE_PRODUCT_COMPATIBILITY,
    compatibility: compatibility
  };
}

function receiveErrorProductCompatibility() {
  return {
    type: types.RECEIVE_ERROR_PRODUCT_COMPATIBILITY
  };
}

//==========================================================
// ADD TO CART
//==========================================================


export function addToCart(supplierPartId) {
  return (dispatch) => {
    dispatch(requestProductAddToCart());
    let url = `${Config.CART_URL}/add/${supplierPartId}/1/`;
    ApiUtils.timeoutPromise(fetch(url, Config.POST())
      .then(ApiUtils.checkStatus)
      .then(() => {
        dispatch(receiveProductAddToCart());
      })
      .catch((error) => {
        dispatch(receiveErrorProductAddToCart());
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`);
      })
      , 20000)
      .catch((error) => {
        dispatch(receiveErrorProductAddToCart());
        dispatch(showAlert('Error', error.message));
        Log.logCrash(`${url} - ${error.message}`);
      });
  };
}

function requestProductAddToCart() {
  return {
    type: types.REQUEST_PRODUCT_ADDTOCART,
  };
}

function receiveProductAddToCart() {
  return {
    type: types.RECEIVE_PRODUCT_ADDTOCART,
  };
}

function receiveErrorProductAddToCart() {
  return {
    type: types.RECEIVE_ERROR_PRODUCT_ADDTOCART,
  };
}

export function productAddedToCart() {
  return {
    type: types.PRODUCT_ADDEDTOCART
  };
}

export function clearProductInfo() {
  return {
    type: types.CLEAR_PRODUCT
  };
}
