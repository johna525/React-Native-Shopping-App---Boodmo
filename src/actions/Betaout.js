import {NativeModules} from 'react-native';

import ApiUtils from '../utils/ApiUtils';
import * as BetaoutHelper from '../utils/BetaoutHelper';
import * as Log from './Log';
import * as Config from '../constants/Config';
import {BETAOUT_UPDATE} from '../constants/ActionTypes';

const {BetaoutBridge} = NativeModules;

export const customerSetup = (user) => {
  const customerId = user.customerId ? user.customerId.toString() : '';
  const email = user.email || '';
  const phone = user.phone || '';

  if (Config.BETAOUT_ACTIVE) {
    BetaoutBridge.customerSetup(customerId, email, phone);
  }

  return (dispatch) => {
    dispatch(updateBetaout());
  };
};

export const logout = () => {
  if (Config.BETAOUT_ACTIVE) {
    BetaoutBridge.logout();
  }

  return (dispatch) => {
    dispatch(updateBetaout());
  };
};

export const viewProduct = (productInfo) => {
  if (Config.BETAOUT_ACTIVE) {
    const product = productInfo.product ? BetaoutHelper.getProductInfo(productInfo) : BetaoutHelper.getProductInfoWithoutPrice(productInfo);

    BetaoutBridge.viewProduct(product);
  }

  return (dispatch) => {
    dispatch(updateBetaout());
  };
};

export const removeProduct = (product, products, user) => {
  if (Config.BETAOUT_ACTIVE) {
    BetaoutBridge.removeProduct(BetaoutHelper.getProductRequestBody(product, products, user));
  }

  return (dispatch) => {
    dispatch(updateBetaout());
  };
};

export const addProduct = (product, products, user) => {
  if (Config.BETAOUT_ACTIVE) {
    BetaoutBridge.addProduct(BetaoutHelper.getProductRequestBody(product, products, user));
  }

  return (dispatch) => {
    dispatch(updateBetaout());
  };
};

export const editProduct = (product, products, user) => {
  if (Config.BETAOUT_ACTIVE) {
    BetaoutBridge.editProduct(BetaoutHelper.getProductRequestBody(product, products, user));
  }

  return (dispatch) => {
    dispatch(updateBetaout());
  };
};

export const fullCartUpdate = (products, user) => {
  if (products.length > 0 && Config.BETAOUT_ACTIVE) {
    BetaoutBridge.fullCartUpdate(BetaoutHelper.getFullCartUpdateBody(products, user));
  }

  return (dispatch) => {
    dispatch(updateBetaout());
  };
};

/**
 *
 * @param properties Object
 * @returns {function(*)}
 */

export const updateProperties = properties => {
  if (Config.BETAOUT_ACTIVE) {
    let linkArr = properties.car_link && properties.car_link.split('/') || null;
    let car_id_link = linkArr && linkArr[linkArr.length - 3] || null;
    let data = {
      ...properties,
      car_id_link
    };

    BetaoutBridge.updateProperties(data);
  }

  return dispatch => {
    dispatch(updateBetaout());
  };
};

/**
 *
 * @param event String
 * @param updateProperties Object
 * @returns {function(*)}
 */

export const logEvent = (event, updateProperties = {}) => {
  if (Config.BETAOUT_ACTIVE) {
    BetaoutBridge.logEvent(event, updateProperties);
  }

  return dispatch => {
    dispatch(updateBetaout());
  };
};

export const updateCart = (products, user) => {
  return (dispatch) => {
    ApiUtils.timeoutPromise(fetch(Config.BETAOUT_URL, Config.POST({
      body: {
        apikey: Config.BETAOUT_APIKEY,
        project_id: Config.BETAOUT_PROJECT_ID,
        'activity_type': 'full_cart_update',
        'identifiers': BetaoutHelper.getIdentifiersRequestBodyPart(user),
        'products': BetaoutHelper.getProductsRequestBodyPart(products),
        'cart_info': BetaoutHelper.getCartInfoRequestBodyPart(user, products)
      }
    }))
      .then(ApiUtils.checkStatus)
      .then((res) => {
        if (res.responseCode === 200) {
          dispatch(updateBetaout());
        } else {
          throw new Error(res.errorMessage);
        }
      })
      , 20000)
      .catch(error => {
        Log.logCrash(`${Config.BETAOUT_URL} - ${error.message}`);
      });
  };
};

export const clearCart = (products, user) => {
  if (Config.BETAOUT_ACTIVE) {
    BetaoutBridge.clearCart(BetaoutHelper.getFullCartUpdateBody(products, user));
  }

  return (dispatch) => {
    dispatch(updateBetaout());
  };
};

const updateBetaout = () => {
  return {
    type: BETAOUT_UPDATE
  };
};
