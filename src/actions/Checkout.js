/* eslint-disable no-unused-vars */
import * as types from '../constants/ActionTypes';
import offline from 'react-native-simple-store';
import ApiUtils from '../utils/ApiUtils';
import * as Config from '../constants/Config';
import * as Messages from '../constants/Messages';
import * as Log from './Log';
import {showAlert} from './SweetAlert';
import {clearCart} from './Cart';
import {logout, setUserInfo} from './User';
import {clearPayment, getPaymentInfo} from './Payment';
import {DELIVERY_STEP, EMAIL_STEP, PAYMENT_STEP, REVIEW_STEP} from '../constants/Checkout';
const moment = require('moment');
const _ = require('lodash');

import {metricsCheckoutApplyContinueClick} from '../utils/metrics';

export function loadProfile() {
  return (dispatch, getState) => {
    dispatch(requestLoadProfile());
    let url = `${Config.MC_HOST}/me/profile`;
    let auth = `${getState().user.token_type} ${getState().user.access_token}`;
    ApiUtils.timeoutPromise(fetch(url, Config.GET(auth))
      .then(ApiUtils.checkStatus)
      .then(responseJson => {
        if (!_.isEmpty(responseJson)) {
          let deliveryInfo = getState().checkout.deliveryInfo;
          if (responseJson.address.pin) {
            _.set(deliveryInfo, 'pin', responseJson.address.pin);
          }
          if (responseJson.address.city) {
            _.set(deliveryInfo, 'city', responseJson.address.city);
          }
          if (responseJson.address.address) {
            _.set(deliveryInfo, 'address', responseJson.address.address);
          }
          if (responseJson.address.last_name) {
            _.set(deliveryInfo, 'last_name', responseJson.address.last_name);
          }
          if (responseJson.address.first_name) {
            _.set(deliveryInfo, 'first_name', responseJson.address.first_name);
          }
          if (responseJson.address.phone) {
            _.set(deliveryInfo, 'phone', responseJson.address.phone);
          }
          if (responseJson.address.state) {
            let state = responseJson.address.state;
            _.set(deliveryInfo, 'state', {name: state, value: state});
          }
          _.set(deliveryInfo, 'country', {name: 'India', value: 'INDIA'});
          dispatch(receiveLoadProfile(deliveryInfo));
        } else {
          dispatch(receiveErrorLoadProfile());
        }
      })
      .catch((error) => {
        if (error.status === 401) {
          dispatch(logout());
        }
        dispatch(receiveErrorLoadProfile());
        Log.logCrash(`${url} - ${error.message}`);
      })
      , 20000)
      .catch((error) => {
        if (error.status === 401) {
          dispatch(logout());
        }
        dispatch(receiveErrorLoadProfile());
        Log.logCrash(`${url} - ${error.message}`);
      });
  };
}

function requestLoadProfile() {
  return {
    type: types.REQUEST_LOAD_PROFILE
  };
}

function receiveErrorLoadProfile() {
  return {
    type: types.RECEIVE_ERROR_LOAD_PROFILE,
  };
}

function receiveLoadProfile(deliveryInfo) {
  return {
    type: types.RECEIVE_LOAD_PROFILE,
    deliveryInfo
  };
}

export function updateUserInfoStep() {
  return (dispatch) => {
    dispatch(setUserInfoStep());
    dispatch(updateSteps());
    dispatch(goToStep(DELIVERY_STEP));
  };
}

function updateSteps() {
  return (dispatch, getState) => {
    let steps = [
      {
        name: 'EMAIL',
        title: 'ENTER EMAIL',
        icon: 'at',
        done: getState().checkout.stepEmailDone,
        disabled: false,
      },
      {
        name: 'DELIVERY',
        title: 'ENTER DELIVERY ADDRESS',
        icon: 'truck',
        done: getState().checkout.stepDeliveryDone,
        disabled: !getState().checkout.stepEmailDone,
      },
      {
        name: 'REVIEW',
        title: 'REVIEW ORDER',
        icon: 'clipboard-check',
        done: getState().checkout.stepReviewDone,
        disabled: !getState().checkout.stepDeliveryDone,
      },
      {
        name: 'PAYMENT',
        title: 'PLACE ORDER',
        icon: 'credit-card',
        done: getState().checkout.stepPaymentDone,
        disabled: !getState().checkout.stepReviewDone,
      }
    ];
    dispatch(setSteps(steps));
  };
}

function setSteps(steps) {
  return {
    type: types.CHECKOUT_UPDATE_STEPS,
    steps
  };
}

function setUserInfoStep() {
  return {
    type: types.CHECKOUT_SET_USER_INFO
  };
}

function setDeliveryInfo(deliveryInfo) {
  return {
    type: types.CHECKOUT_SET_DELIVERY_INFO,
    deliveryInfo
  };
}

export function reviewed() {
  return (dispatch) => {
    dispatch(setReviewStep());
    dispatch(updateSteps());
  };
}

function setReviewStep() {
  return {
    type: types.CHECKOUT_SET_REVIEW_STEP
  };
}

export function saveDeliveryInfo(deliveryInfo) {
  return {
    type: types.CHECKOUT_SAVE_DELIVERY_INFO,
    deliveryInfo
  };
}

export function validateDeliveryInfo(deliveryInfo) {
  return (dispatch, getState) => {
    dispatch(getReviewInfo(deliveryInfo));
  };
}

export function getCart(products) {
  let reviewProducts = {};
  _.forEach(products, (value) => {
    reviewProducts[value.productId] = value.quantity;
  });
  return reviewProducts;
}

function getReviewInfo(deliveryInfo) {
  return (dispatch, getState) => {
    dispatch(requestGetReviewInfo());
    let currency = getState().user.currentCurrency,
      currencyString = '';
    if (currency) {
      currencyString = `?currency=${currency.value}`;
    }
    let body = {
      checkout: {
        email: getState().user.email,
        c_uid: getState().user.c_uid || (getState().user.draft_c_uid && getState().user.draft_c_uid.id),
        address: {
          pin: deliveryInfo.pin,
          phone: deliveryInfo.phone,
          first_name: deliveryInfo.first_name,
          last_name: deliveryInfo.last_name,
          address: deliveryInfo.address,
          city: deliveryInfo.city,
          state: deliveryInfo.state.name,
          country: deliveryInfo.country.name,
        },
        step: 'address',
      }
    };
    let url = `${Config.MC_HOST}/checkout/address${currencyString}`;
    let auth = `${getState().user.token_type} ${getState().user.access_token}`;
    ApiUtils.timeoutPromise(fetch(url, Config.POST({body, auth}))
      .then(ApiUtils.checkStatus)
      .then((response) => ApiUtils.parseSuccessResponse(response, false))
      .then(responseJson => {
        let localPayment = false,
          crossboardPayment = false,
          order = responseJson.order,
          cart = responseJson.cart;
        let packages = _.map(order.packages, (reviewPackage) => {
          if (reviewPackage['locality'] === 'local') {
            localPayment = true;
          } else if (reviewPackage['locality'] === 'crossboard') {
            crossboardPayment = true;
          }
          _.map(reviewPackage.items, (item, supplierPartId) => {
            let productPart = cart[supplierPartId].product.part;
            let product = {
              id: item.part_id,
              name: productPart.name,
              number: productPart.number,
              brand: productPart.brand_name,
              image: productPart.image || null,
              price: item.price,
              deliveryCharge: item.delivery_price,
              quantity: item.qty,
              total: item.total
            };
            item['part'] = product;
            item['supplierPartId'] = supplierPartId;
            return item;
          });
          return reviewPackage;
        });
        let reviewCart = {
          packages: packages,
          grand_total: order.grand_total || 0,
          delivery_total: order.delivery_total || 0,
          subtotal: order.grand_total.amount - order.delivery_total.amount || 0,
          items_count: order.items_count || 0,
          currency: order.currency,
          grand_total_list: order.grand_total_list
        };
        dispatch(setDeliveryInfo(deliveryInfo));
        dispatch(receiveGetReviewInfo(reviewCart, localPayment, crossboardPayment));
        dispatch(goToStep(REVIEW_STEP));
        dispatch(updateSteps());
      })
      .catch((error) => {
        if (error.status === 401) {
          dispatch(logout());
        }
        let errors = error.errors || [];
        dispatch(receiveErrorGetReviewInfo(errors));
        if (errors.length === 0) {
          dispatch(showAlert('Error', Messages.requestError));
          Log.logCrash(`${url} - ${error.message}`, body);
        }
      })
      , 20000)
      .catch((error) => {
        if (error.status === 401) {
          dispatch(logout());
        }
        dispatch(receiveErrorGetReviewInfo());
        dispatch(showAlert('Error', error.message));
        Log.logCrash(`${url} - ${error.message}`);
      });
  };
}

function requestGetReviewInfo() {
  return {
    type: types.REQUEST_REVIEW_CART
  };
}

function receiveGetReviewInfo(reviewCart, localPayment, crossboardPayment) {
  return {
    type: types.RECEIVE_REVIEW_CART,
    reviewCart,
    localPayment,
    crossboardPayment
  };
}

function receiveErrorGetReviewInfo(errors) {
  return {
    type: types.RECEIVE_ERROR_REVIEW_CART,
    errors
  };
}

function setReviewCart(reviewCart) {
  return {
    type: types.CHECKOUT_UPDATE_REVIEW_CART,
    reviewCart
  };
}

export function updatePaymentMethods(localPaymentMethod, crossboardPaymentMethod) {
  return (dispatch) => {
    dispatch(setPaymentMethods(localPaymentMethod, crossboardPaymentMethod));
    dispatch(updateSteps());
    dispatch(createOrder());
  };
}

function setPaymentMethods(localPaymentMethod, crossboardPaymentMethod) {
  return {
    type: types.CHECKOUT_UPDATE_PAYMENT_METHOD,
    localPaymentMethod,
    crossboardPaymentMethod
  };
}

export function validatePin(deliveryInfo) {
  return (dispatch, getState) => {
    let pin = deliveryInfo.pin;
    _.set(deliveryInfo, 'pin', pin);
    dispatch(requestValidatePin(deliveryInfo));
    let url = `${Config.MC_HOST}/location?pin=${pin}`;
    ApiUtils.timeoutPromise(fetch(url, Config.GET())
      .then(ApiUtils.checkStatus)
      .then(responseJson => {
        if (!_.isEmpty(responseJson)) {
          let state = responseJson.state,
            city = responseJson.city,
            country = responseJson.country;
          _.set(deliveryInfo, 'state', {name: state, value: state});
          _.set(deliveryInfo, 'country', {name: country, value: country});
          _.set(deliveryInfo, 'city', city);
          dispatch(receiveValidatePin(deliveryInfo));
        } else {
          dispatch(receiveErrorValidatePin());
        }
      })
      .catch((error) => {
        if (error.status === 401) {
          dispatch(logout());
        }
        dispatch(receiveErrorValidatePin());
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`);
      })
      , 20000)
      .catch((error) => {
        if (error.status === 401) {
          dispatch(logout());
        }
        dispatch(receiveErrorValidatePin());
        dispatch(showAlert('Error', error.message));
        Log.logCrash(`${url} - ${error.message}`);
      });
  };
}

function requestValidatePin(deliveryInfo) {
  return {
    type: types.REQUEST_DELIVERY_VALIDATE_PIN,
    deliveryInfo
  };
}

function receiveValidatePin(deliveryInfo) {
  return {
    type: types.RECEIVE_DELIVERY_VALIDATE_PIN,
    deliveryInfo
  };
}

function receiveErrorValidatePin() {
  return {
    type: types.RECEIVE_DELIVERY_ERROR_VALIDATE_PIN,
  };
}

function getCartWithLocality(packages) {
  let reviewProducts = {};
  _.forEach(packages, (value) => {
    if (value['locality'] === 'local') {
      _.forEach(value.items, (item, id) => {
        reviewProducts[id] = item.qty;
      });
    }

  });
  return reviewProducts;
}

export function getAvailablePaymentMethods() {
  return (dispatch, getState) => {
    dispatch(requestAvailablePaymentMethods());
    let deliveryInfo = getState().checkout.deliveryInfo;
    let currency = getState().user.currentCurrency,
      currencyString = '';
    if (currency) {
      currencyString = `?currency=${currency.value}`;
    }
    let body = {
      checkout: {
        c_uid: getState().user.c_uid || (getState().user.draft_c_uid && getState().user.draft_c_uid.id),
        email: getState().user.email,
        address: {
          pin: deliveryInfo.pin,
          phone: deliveryInfo.phone,
          first_name: deliveryInfo.first_name,
          last_name: deliveryInfo.last_name,
          address: deliveryInfo.address,
          city: deliveryInfo.city,
          state: deliveryInfo.state.value,
          country: deliveryInfo.country.value,
        },
        step: 'review',
      }
    };
    let url = `${Config.MC_HOST}/checkout/payment${currencyString}`;
    let auth = `${getState().user.token_type} ${getState().user.access_token}`;
    ApiUtils.timeoutPromise(fetch(url, Config.POST({body, auth}))
      .then(ApiUtils.checkStatus)
      .then(responseJson => {
        let paymentMethods = responseJson.payment_methods;
        dispatch(receiveAvailablePaymentMethods(paymentMethods));
        dispatch(reviewed());
        dispatch(goToStep(PAYMENT_STEP));
      })
      .catch((error) => {
        if (error.status === 401) {
          dispatch(logout());
        }
        dispatch(receiveErrorAvailablePaymentMethods());
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`);
      })
      , 20000)
      .catch((error) => {
        if (error.status === 401) {
          dispatch(logout());
        }
        dispatch(receiveErrorAvailablePaymentMethods());
        dispatch(showAlert('Error', error.message));
        Log.logCrash(`${url} - ${error.message}`);
      });
  };
}

function getCheckoutCartForQuery(reviewCart) {
  let items = _.map(reviewCart.packages, (cartCackage) => {
    return _.map(cartCackage.products, (product) => {
      return {
        product_id: product.id,
        qty: product.quantity,
        part_id: product.number,
        price: product.price,
        delivery_price: product.deliveryCharge,
        delivery_days: product.delivery,
      };
    });
  });

  return {
    items: items,
    subTotal: reviewCart.amount,
    totalDelivery: reviewCart.deliveryCharge,
    grandTotal: reviewCart.grandTotal
  };
}

function requestAvailablePaymentMethods() {
  return {
    type: types.REQUEST_DELIVERY_AVAILABLE_PAYMENT_METHODS,
  };
}

function receiveAvailablePaymentMethods(availablePaymentMethods) {
  return {
    type: types.RECEIVE_DELIVERY_AVAILABLE_PAYMENT_METHODS,
    availablePaymentMethods
  };
}

function receiveErrorAvailablePaymentMethods() {
  return {
    type: types.RECEIVE_DELIVERY_ERROR_AVAILABLE_PAYMENT_METHODS
  };
}

export function logoutCheckout() {
  return {
    type: types.LOG_OUT
  };
}

export function createOrder() {
  return (dispatch, getState) => {
    dispatch(requestCreateOrder());
    let deliveryInfo = getState().checkout.deliveryInfo;
    let localPayment = getState().checkout.localPayment;
    let crossboardPayment = getState().checkout.crossboardPayment;
    let paymentMethods = [];
    if (localPayment) {
      paymentMethods.push(getState().checkout.localPaymentMethod);
    }
    if (crossboardPayment) {
      paymentMethods.push(getState().checkout.crossboardPaymentMethod);
    }

    let currency = getState().user.currentCurrency,
      currencyString = '';
    if (currency) {
      currencyString = `?currency=${currency.value}`;
    }
    let body = {
      checkout: {
        c_uid: getState().user.c_uid || (getState().user.draft_c_uid && getState().user.draft_c_uid.id),
        email: getState().user.email,
        address: {
          pin: deliveryInfo.pin,
          phone: deliveryInfo.phone,
          first_name: deliveryInfo.first_name,
          last_name: deliveryInfo.last_name,
          address: deliveryInfo.address,
          city: deliveryInfo.city,
          state: deliveryInfo.state.value,
          country: deliveryInfo.country.value
        },
        paymentMethod: paymentMethods,
        step: 'payment'
      }
    };
    let url = `${Config.MC_HOST}/checkout/order${currencyString}`;
    let auth = `${getState().user.token_type} ${getState().user.access_token}`;
    ApiUtils.timeoutPromise(fetch(url, Config.POST({body, auth}))
      .then(ApiUtils.checkStatus)
      .then(responseJson => {
        let createdOrder = responseJson;
        let auth = createdOrder['oauth'] || null;
        if (auth) {
          dispatch(setUserInfo(
            body.checkout.email,
            auth['access_token'],
            auth['refresh_token'],
            auth['token_type'],
            auth['user_id'] || '',
            parseInt(moment().format('X')) + auth['expires_in']
          ));
        }
        if (_.has(createdOrder, 'payments') && createdOrder['payments'].length > 0) {
          let currentPaymentIndex = 0;
          dispatch(getPaymentInfo(createdOrder['payments'][currentPaymentIndex], currentPaymentIndex));
        }
        dispatch(receiveCreateOrder(createdOrder));
      })
      .catch((error) => {
        if (error.status == 401) {
          dispatch(logout());
        }
        dispatch(receiveErrorCreateOrder());
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`, body);
      })
      , 30000)
      .catch((error) => {
        if (error.status == 401) {
          dispatch(logout());
        }
        dispatch(receiveErrorCreateOrder());
        dispatch(showAlert('Error', error.message));
        Log.logCrash(`${url} - ${error.message}`, body);
      });
  };
}

function requestCreateOrder() {
  return {
    type: types.REQUEST_CREATE_ORDER,
  };
}

function receiveCreateOrder(createdOrder) {
  metricsCheckoutApplyContinueClick();
  return (dispatch, getState) => {
    dispatch(clearCart());
    dispatch({
      type: types.RECEIVE_ORDER,
      createdOrder
    });
  };
}

function receiveErrorCreateOrder() {
  return {
    type: types.RECEIVE_ERROR_CREATE_ORDER
  };
}

export function clearCheckout() {
  return (dispatch, getState) => {
    dispatch(resetCheckout());
    dispatch(updateSteps());
  };
}

function resetCheckout() {
  return {
    type: types.CHECKOUT_RESET_TO_DELIVERY
  };
}

export function finishOrder() {
  return (dispatch, getState) => {
    dispatch(clearCart());
    dispatch(clearPayment());
    dispatch(goToStep(DELIVERY_STEP));
    dispatch(clearCheckout());
  };
}

export function resetLoadedProfileState() {
  return {
    type: types.RESET_LOADED_PROFILE_STATE
  };
}

export function goToStep(selectedStep) {
  return {
    type: types.CHECKOUT_GO_TO_STEP,
    selectedStep
  };
}

export function getInitialStep() {
  return (dispatch, getState) => {
    let signedIn = getState().user.signedIn;
    let emailExists = getState().user.emailExists;
    if (signedIn || emailExists === false) {
      if (!stepDeliveryDone) {
        dispatch(updateUserInfoStep());
        dispatch(loadProfile());
      }
    }
    let stepEmailDone = getState().checkout.stepEmailDone;
    let stepDeliveryDone = getState().checkout.stepDeliveryDone;
    let stepReviewDone = getState().checkout.stepReviewDone;
    let selectedStep = EMAIL_STEP;
    selectedStep = stepEmailDone ? DELIVERY_STEP : selectedStep;
    selectedStep = stepDeliveryDone ? REVIEW_STEP : selectedStep;
    selectedStep = stepReviewDone ? PAYMENT_STEP : selectedStep;
    dispatch(goToStep(selectedStep));
  };
}

export function getCreatedOrder(orderId) {
  return (dispatch, getState) => {
    dispatch(requestSuccessOrder());
    let body = {
      order_id: orderId
    };
    let url = `${Config.MC_HOST}/checkout/success`;
    let auth = `${getState().user.token_type} ${getState().user.access_token}`;
    ApiUtils.timeoutPromise(fetch(url, Config.POST({body, auth}))
      .then(ApiUtils.checkStatus)
      .then(responseJson => {
        let successOrder = responseJson.order;
        successOrder.sub_total = successOrder.grand_total.amount - successOrder.delivery_total.amount;
        dispatch(receiveSuccessOrder(successOrder));
      })
      .catch((error) => {
        metricsCheckoutApplyContinueClick(error.status.toString());
        if (error.status === 401) {
          dispatch(logout());
        }
        dispatch(receiveErrorSuccessOrder());
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`, body);
      })
      , 30000)
      .catch((error) => {
        metricsCheckoutApplyContinueClick(error.status.toString());
        if (error.status === 401) {
          dispatch(logout());
        }
        dispatch(receiveErrorSuccessOrder());
        dispatch(showAlert('Error', error.message));
        Log.logCrash(`${url} - ${error.message}`, body);
      });
  };
}


function requestSuccessOrder() {
  return {
    type: types.REQUEST_SUCCESS_ORDER,
  };
}

function receiveSuccessOrder(successOrder) {
  return {
    type: types.RECEIVE_SUCCESS_ORDER,
    successOrder
  };
}

function receiveErrorSuccessOrder() {
  return {
    type: types.RECEIVE_ERROR_SUCCESS_ORDER
  };
}
