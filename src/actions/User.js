import {FBLoginManager} from 'react-native-facebook-login';
import * as _ from 'lodash';

import * as types from '../constants/ActionTypes';
import * as Config from '../constants/Config';
import {DELIVERY_STEP, EMAIL_STEP} from '../constants/Checkout';
import ApiUtils from '../utils/ApiUtils';
import {updateUserInfoStep, logoutCheckout, loadProfile, goToStep} from './Checkout';
import {showAlert} from './SweetAlert';
import * as Log from './Log';
import * as BetaOut from './Betaout';
import {getCartProducts} from './Cart';

const moment = require('moment');

function setUserInfoFacebook(fbUserId, fbToken) {
  return {
    type: types.SET_USER_INFO_FACEBOOK,
    fbUserId,
    fbToken
  };
}

export function newUserFromCheckout(email) {
  return (dispatch) => {
    dispatch(setEmail(email));
    dispatch(updateUserInfoStep());
  };
}

function setEmail(email) {
  return {
    type: types.SET_USER_INFO_EMAIL,
    email,
  };
}

export function receiveCartCUID(c_uid) {
  return {
    type: types.RECEIVE_CART_CUID,
    c_uid
  };
}

export function receiveCartDraftCUID(c_uid) {
  return {
    type: types.RECEIVE_CART_DRAFT_CUID,
    c_uid
  };
}

export function signIn(profile, userId, token) {
  return (dispatch) => {
    const userProfile = {
      first_name: profile.first_name,
      last_name: profile.last_name,
      email: profile.email,
    };
    dispatch(setUserInfoFacebook(userProfile, parseInt(userId), token));
  };
}

export function signInFacebook(fbUserId, fbToken, checkout = true) {
  return (dispatch, getState) => {
    const url = `${Config.FACEBOOK_GRAPH}/${fbUserId}?fields=first_name,last_name,email&access_token=${fbToken}`;

    ApiUtils.timeoutPromise(fetch(url, Config.GET)
      .then(ApiUtils.checkStatus)
      .then(responseJson => {
        let first_name = responseJson.first_name;
        let last_name = responseJson.last_name;
        let email = responseJson.email;
        let url = `${Config.AUTH_HOST}/socialauth`;
        let fbProfile = {
          'identity': email,
          'identifier': fbUserId,
          'token': fbToken,
          'provider': 'facebook'
        };
        dispatch(requestAuth());
        ApiUtils.timeoutPromise(fetch(url, Config.POST({body: fbProfile}))
          .then(ApiUtils.checkStatus)
          .then(responseJson => {
            dispatch(updateUserInfoStep());
            dispatch(setUserInfo(
              email,
              responseJson['access_token'],
              responseJson['refresh_token'],
              responseJson['token_type'],
              parseInt(moment().format('X')) + responseJson['expires_in']
            ));
            let url = `${Config.MC_HOST}/me/analytics-info`;
            let auth = `${responseJson['token_type']} ${responseJson['access_token']}`;
            ApiUtils.timeoutPromise(fetch(url, Config.GET(auth))
              .then(ApiUtils.checkStatus)
              .then(responseJson => {
                // console.log('responseJson: ', responseJson);
                if (Config.BETAOUT_ACTIVE) {
                  dispatch(BetaOut.customerSetup({
                    customerId: responseJson.user_id,
                    email: responseJson.email || email,
                    phone: responseJson.phone,
                  }));
                }

                Log.crashlyticsLog('sign_in_facebook');
                Log.crashlyticsSetUser({
                  id: responseJson.user_id.toString(),
                  email: responseJson.email || email,
                  name: responseJson.first_name + ' ' + responseJson.last_name,
                });

                dispatch(setModifUserInfo({
                  car_name: responseJson['car_name'] || null,
                  car_link: responseJson['car_link'] || null,
                  ori_link: responseJson['ori_link'] || null,
                  car_id: responseJson['car_id'] || null,
                  is_finished: responseJson['is_finished'] || null,
                  workshop: responseJson['workshop'] || null,
                  phone: responseJson['phone'] || null,
                  user_id: responseJson['user_id'] || null,
                  first_name: responseJson.first_name || first_name || null,
                  last_name: responseJson.last_name || last_name || null
                }));
              }), 20000)
              .catch(() => {});
            dispatch(getCartProducts());
            dispatch(setUserInfoFacebook(parseInt(fbUserId), fbToken));
            if (checkout) {
              dispatch(loadProfile());
            }
            dispatch(goToStep(DELIVERY_STEP));
          })
          .catch((error) => {
            dispatch(receiveErrorAuth(error.message));
            if (_.isObjectLike(error)) {
              if (error.status >= 500 || error.status == 404 || error.status == 403) {
                Log.logCrash(`${url} - ${error.message}`);
              }
            }
          })
          , 20000)
          .catch((error) => {
            dispatch(receiveErrorAuth(''));
            dispatch(showAlert('Error', error.message));
            Log.logCrash(`${url} - ${error.message}`);
          });
      })
      .catch((error) => {
        dispatch(showAlert('Error', error.message));
        Log.logCrash(`${url} - ${error.message}`);
      })
      , 20000)
      .catch((error) => {
        dispatch(showAlert('Error', error.message));
        Log.logCrash(`${url} - ${error.message}`);
      });
  };
}

export function checkEmail(email, password) {
  return (dispatch, getState) => {
    if (password) {
      dispatch(OAuth(email, password, true));
    } else {
      let currency = getState().user.currentCurrency,
        currencyString = '';
      if (currency) {
        currencyString = `?currency=${currency.value}`;
      }
      let body = {
        checkout: {
          c_uid: getState().user.c_uid || (getState().user.draft_c_uid && getState().user.draft_c_uid.value),
          step: 'email',
          email
        }
      };
      dispatch(requestCheckEmail());
      let url = `${Config.MC_HOST}/checkout/email${currencyString}`;
      ApiUtils.timeoutPromise(fetch(url, Config.POST({body}))
        .then(ApiUtils.checkStatus)
        .then(ApiUtils.parseSuccessResponse)
        .then(responseJson => {
          switch (responseJson.success) {
          case true:
            dispatch(newUserFromCheckout(email));
            dispatch(goToStep(DELIVERY_STEP));
            break;
          case null:
            dispatch(receiveCheckEmail(true));
            break;
          }
        })
        .catch((error) => {
          let errors = error.errors || [];
          dispatch(receiveErrorAuth(errors));
          if (_.isObjectLike(error)) {
            if (error.status >= 500 || error.status == 404 || error.status == 403) {
              Log.logCrash(`${url} - ${error.message}`);
            }
          }
        })
        , 20000)
        .catch((error) => {
          dispatch(receiveErrorAuth(''));
          dispatch(showAlert('Error', error.message));
          Log.logCrash(`${url} - ${error.message}`);
        });
    }

  };
}

function requestCheckEmail() {
  return {
    type: types.REQUEST_CHECK_EMAIL
  };
}

function receiveCheckEmail(emailExists) {
  return {
    type: types.RECEIVE_CHECK_EMAIL,
    emailExists
  };
}

export function OAuth(email, password, checkout = true) {
  return (dispatch) => {
    // console.log('~~~ OAuth ~~~');
    dispatch(requestAuth());
    let userCredentials = {
      username: email,
      password: password,
      grant_type: 'password',
      client_id: 'mobile'
    };
    let url = `${Config.AUTH_HOST}/oauth`;
    ApiUtils.timeoutPromise(fetch(url, Config.POST({body: userCredentials}))
      .then(ApiUtils.checkStatus)
      .then(responseJson => {
        dispatch(updateUserInfoStep());
        dispatch(setUserInfo(
          email,
          responseJson['access_token'],
          responseJson['refresh_token'],
          responseJson['token_type'],
          parseInt(moment().format('X')) + responseJson['expires_in']
        ));
        let url = `${Config.MC_HOST}/me/analytics-info`;
        let auth = `${responseJson['token_type']} ${responseJson['access_token']}`;
        ApiUtils.timeoutPromise(fetch(url, Config.GET(auth))
          .then(ApiUtils.checkStatus)
          .then(responseJson => {
            if (Config.BETAOUT_ACTIVE) {
              dispatch(BetaOut.customerSetup({
                customerId: responseJson.user_id,
                email: responseJson.email || email,
                phone: responseJson.phone,
              }));
            }
            Log.crashlyticsLog('sign_in');

            Log.crashlyticsSetUser({
              id: responseJson.user_id.toString(),
              email: responseJson.email || email,
              name: responseJson.first_name + ' ' + responseJson.last_name,
            });

            dispatch(setModifUserInfo({
              car_name: responseJson['car_name'] || null,
              car_link: responseJson['car_link'] || null,
              ori_link: responseJson['ori_link'] || null,
              car_id: responseJson['car_id'] || null,
              is_finished: responseJson['is_finished'] || null,
              workshop: responseJson['workshop'] || null,
              phone: responseJson['phone'] || null,
              user_id: responseJson['user_id'] || null,
              first_name: responseJson['first_name'] || null,
              last_name: responseJson['last_name'] || null
            }));
          }), 20000)
          .catch((error) => {
            console.log(error);
          });
        dispatch(getCartProducts());
        if (checkout) {
          dispatch(loadProfile());
        }
        dispatch(goToStep(DELIVERY_STEP));
      })
      .catch(ApiUtils.parseError)
      .catch((error) => {
        dispatch(receiveErrorAuth(error.message));
        if (_.isObjectLike(error)) {
          if (error.status >= 500 || error.status == 403) {
            Log.logCrash(`${url} - ${error.message}`);
          }
        }
      })
      , 20000)
      .catch((error) => {
        dispatch(receiveErrorAuth(''));
        dispatch(showAlert('Error', error.message));
        Log.logCrash(`${url} - ${error.message}`);
      });
  };
}

function requestAuth() {
  return {
    type: types.REQUEST_AUTH
  };
}

function receiveErrorAuth(message) {
  return {
    type: types.RECEIVE_ERROR_AUTH,
    message
  };
}

function receiveErrorRegister(message) {
  return {
    type: types.RECEIVE_ERROR_REGISTER,
    message
  };
}

export function setUserInfo(email, access_token, refresh_token, token_type, tokenExpires) {
  return {
    type: types.SET_USER_INFO,
    email,
    access_token,
    refresh_token,
    token_type,
    tokenExpires
  };
}

function setModifUserInfo(metricsData) {
  return {
    type: types.SET_MODIF_USER_INFO,
    data: metricsData
  };
}

export function changeEmailCheckout() {
  return {
    type: types.CHECKOUT_STEP_CHANGE_EMAIL,
  };
}

export function logout() {
  return (dispatch) => {
    if (Config.BETAOUT_ACTIVE) {
      BetaOut.logout();
    }
    Log.crashlyticsLog('logout');
    Log.crashlyticsSetUser(null);
    FBLoginManager.logout(() => {
    });
    dispatch(goToStep(EMAIL_STEP));
    dispatch(logoutCheckout());
    dispatch(clearUserInfo());
  };
}

function clearUserInfo() {
  return {
    type: types.LOG_OUT,
  };
}

function requestRecovery() {
  return {
    type: types.REQUEST_PASSWORD_RECOVERY
  };
}

export function sendPasswordRecovery(email) {
  return (dispatch) => {
    dispatch(requestRecovery());
    let userCredentials = {
      email: email,
    };
    let url = `${Config.HOST}/user/forgotpassword`;
    ApiUtils.timeoutPromise(fetch(url, Config.POST({body: userCredentials}))
      .then(ApiUtils.checkStatus)
      .then(() => {
        dispatch(sentEmailPasswordRecovery());
      })
      .catch((error) => {
        let errors = [];
        _.each(error.errorBody, (err) => {
          _.each(err, (e) => {
            errors.push(e);
          });
        });
        dispatch(receiveErrorAuth(errors));
        if (_.isObjectLike(error)) {
          if (error.status >= 500 || error.status == 403) {
            Log.logCrash(`${url} - ${error.message}`);
          }
        }
      })
      , 20000)
      .catch((error) => {
        dispatch(receiveErrorAuth(''));
        dispatch(showAlert('Error', error.message));
        Log.logCrash(`${url} - ${error.message}`);
      });
  };
}

function sentEmailPasswordRecovery() {
  return {
    type: types.SENT_PASSWORD_RECOVERY,
  };
}

export function signUp(email, password, passwordVerify) {
  return (dispatch) => {
    dispatch(requestAuth());
    let userCredentials = {
      email: email,
      password: password,
      passwordVerify: passwordVerify,
    };
    let url = `${Config.HOST}/user/register`;
    ApiUtils.timeoutPromise(fetch(url, Config.POST({body: userCredentials}))
      .then(ApiUtils.checkStatus)
      .then(responseJson => {
        if (responseJson.success) {
          dispatch(signedUp());
          dispatch(OAuth(email, password));

          if (Config.BETAOUT_ACTIVE) {
            dispatch(BetaOut.logEvent('signup'));
          }

          Log.crashlyticsLog('signup');
        }
      })
      .catch((error) => {
        let errorMessage = '';
        switch (error.status) {
        case 422:
          let values = _.values(error.validation_messages);
          let errors = [];
          _.map(values, (value) => {
            errors.push(_.values(value));
          });
          errorMessage = errors.join('\n');
          break;
        default:
          errorMessage = error.message;
        }
        dispatch(receiveErrorRegister(errorMessage));
        if (_.isObjectLike(error)) {
          if (error.status >= 500 || error.status == 404 || error.status == 403) {
            Log.logCrash(`${url} - ${error.message}`);
          }
        }
      })
      , 20000)
      .catch((error) => {
        dispatch(receiveErrorRegister(''));
        dispatch(showAlert('Error', error.message));
        Log.logCrash(`${url} - ${error.message}`);
      });
  };
}

function signedUp() {
  return {
    type: types.SIGNED_UP,
  };
}

export function clearErrors() {
  return {
    type: types.CLEAR_AUTH_ERRORS,
  };
}

export function offlineUserLoaded(data) {
  return (dispatch) => {
    let {email, access_token, refresh_token, token_type} = data;
    let signedIn = email && access_token && refresh_token && token_type ? true : false;
    if (signedIn) {
      dispatch(updateUserInfoStep());
    }
    dispatch(setOfflineUser(data));
  };
}

function setOfflineUser(data) {
  currentCurrency = data.currentCurrency || {
    name: 'INR',
    value: 'INR',
    unicode: 'U+20B9'
  };
  return {
    type: types.OFFLINE_USER_LOADED,
    currentCurrency,
    ...data
  };
}

export function refreshToken(dispatch, getState) {
  dispatch(requestRefreshToken());
  let userCredentials = {
    grant_type: 'refresh_token',
    refresh_token: getState().user.refresh_token,
    client_id: 'mobile',
    client_secret: ''
  };
  let url = `${Config.AUTH_HOST}/oauth`;
  let freshTokenPromise = ApiUtils.timeoutPromise(fetch(url, Config.POST({body: userCredentials}))
    .then(ApiUtils.checkStatus)
    .then(responseJson => {
      dispatch(receiveNewToken(
        responseJson['access_token'],
        responseJson['token_type'],
        responseJson['refresh_token'],
        parseInt(moment().format('X')) + responseJson['expires_in'],
      ));
      return responseJson['access_token'] ? Promise.resolve(responseJson['access_token'])
        : Promise.reject(() => {
          dispatch(receiveErrorRefreshToken);
        });
    })
    .catch(() => {
      dispatch(receiveErrorRefreshToken());
      dispatch(logout());
    })
    , 20000)
    .catch(() => {
      dispatch(receiveErrorRefreshToken());
      dispatch(logout());
    });
  return freshTokenPromise;
}

function requestRefreshToken(freshTokenPromise) {
  return {
    type: types.REQUEST_REFRESH_TOKEN,
    freshTokenPromise
  };
}

function receiveNewToken(access_token, token_type, refresh_token, tokenExpires) {
  return {
    type: types.RECEIVE_REFRESH_TOKEN,
    access_token,
    token_type,
    refresh_token,
    tokenExpires
  };
}

function receiveErrorRefreshToken() {
  return {
    type: types.RECEIVE_ERROR_REFRESH_TOKEN
  };
}

export function fireFreshdeskModal() {
  return {
    type: types.FIRE_FRESHDESK_MODAL
  };
}

export function getTicketTypes() {
  return (dispatch) => {
    dispatch({
      type: types.FRESHDESK_TICKET_TYPES_SUCCESS,
      data: {
        'Request Spare Parts': [
          {
            title: 'MAKE',
            freshdesk: 'make',
            required: true,
            validation_type: 'simple',
            type: 'textInput',
            value: ''
          },
          {
            title: 'YEAR',
            freshdesk: 'year',
            required: true,
            validation_type: 'simple',
            type: 'textInput',
            value: ''
          },
          {
            title: 'MODEL',
            freshdesk: 'model',
            required: true,
            validation_type: 'simple',
            type: 'textInput',
            value: ''
          },
          {
            title: 'CHASSIS NUMBER (VIN number 17 characters)',
            freshdesk: 'chassis_number',
            required: false,
            validation_type: 'simple',
            type: 'textInput',
            value: ''
          }
        ],
        'Existing order questions': [
          {
            title: 'Order Number',
            freshdesk: 'order_number',
            required: true,
            validation_type: 'number',
            type: 'textInput',
            value: ''
          },
          {
            title: 'Where is my order?',
            freshdesk: 'where_is_my_order',
            required: false,
            validation_type: 'simple',
            type: 'checkout',
            value: false
          }
        ],
        'Common question': [
          {
            title: 'Specify type of your question',
            freshdesk: 'specify_type_of_your_question',
            required: true,
            validation_type: 'simple',
            type: 'selectInput',
            choices: [
              {
                name: 'Claim to manager',
                value: 'Claim to manager'
              },
              {
                name: 'Supplier relationship',
                value: 'Supplier relationship'
              },
              {
                name: 'Problem with website',
                value: 'Problem with website'
              },
              {
                name: 'Other',
                value: 'Other'
              }
            ],
            value: ''
          }
        ]
      }
    });
  };
}

export function sendFreshdeskFeedback(email, type, fields, description) {
  return (dispatch) => {
    dispatch({type: types.FRESHDESK_FEEDBACK_ATTEMPT});
    fetch('https://boodmocom.freshdesk.com/api/v2/tickets', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Config.FRESHDESK_API_KEY
      },
      body: JSON.stringify({
        email,
        type,
        description,
        'custom_fields' : fields,
        'status': 2,
        'priority': 2,
        'responder_id': Config.FRESHDESK_AGENT_ID
      })
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        dispatch({type: types.FRESHDESK_FEEDBACK_SUCCESS});
      })
      .catch(() => {
        dispatch({type: types.FRESHDESK_ERORR});
      });
  };
}

export function recoverFeedbackSendActions() {
  return (dispatch) => {
    dispatch({type: types.FRESHDESK_FEEDBACK_RECOVER});
  };
}

export function changeCurrentCurrency(currentCurrency) {
  return {
    type: types.CHANGE_CURRENT_CURRENCY,
    currentCurrency
  };
}
