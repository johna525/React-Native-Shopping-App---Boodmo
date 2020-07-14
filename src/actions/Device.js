import {NativeModules} from 'react-native';
import * as types from '../constants/ActionTypes';
import * as Config from "../constants/Config";
import offline from 'react-native-simple-store';
import {offlineUserLoaded} from './User';
import {getCurrency, diffInDays} from '../utils/Helper';

const currencies = require('./../constants/currencies.json');

export function setWidth(width) {
  return {
    type: types.SET_DEVICE_WIDTH,
    width: width
  };
}

export function setToken(token) {
  return {
    type: types.SET_DEVICE_TOKEN,
    token
  };
}

export function requestNotifPermIOS() {
  return {
    type: types.REQUEST_NOTIIF_PERM_IOS
  };
}

export function setBuildNumber(number) {
  return {
    type: types.SET_BUILD_NUMBER,
    number
  };
}

export function setCodePushVer(version) {
  return {
    type: types.SET_CODEPUSH_VERSION,
    version
  };
}

export function setHeight(height) {
  return {
    type: types.SET_DEVICE_HEIGHT,
    height: height
  };
}

export function setPlatformOS(platformOS) {
  return {
    type: types.SET_PLATFORM_OS,
    platformOS: platformOS
  };
}

export function setAppVersion(appVersion) {
  return {
    type: types.SET_APP_VERSION,
    appVersion: appVersion
  };
}

export function setOldAppVersion(appVersion, codePushVersion, notificationIOS) {
  return {
    type: types.SET_OLD_APP_VERSION,
    oldAppVersion: appVersion,
    codePushVersion,
    notificationIOS
  };
}

export function loadOfflineStore() {
  return (dispatch) => {
    let offlineArray = [
      'email',
      'first_name',
      'last_name',
      'access_token',
      'refresh_token',
      'token_type',
      'tokenExpires',
      'currentCurrency',
      'appVersion',
      'user_id',
      'auth_type',
      'c_uid',
      'draft_c_uid',
      'loginExpires',
      'codePushVersion',
      'notificationIOS',
      'loadedDeliveryInfo',
      'car_id',
      'car_link',
      'car_name',
      'is_finished',
      'ori_link',
      'phone',
      'workshop'
    ];
    offline.get(offlineArray).then(values => {
      let email = values[offlineArray.indexOf('email')];
      let access_token = values[offlineArray.indexOf('access_token')];
      let refresh_token = values[offlineArray.indexOf('refresh_token')];
      let token_type = values[offlineArray.indexOf('token_type')];
      let tokenExpires = values[offlineArray.indexOf('tokenExpires')];
      let currentCurrency = Config.SHOW_CURRENCY_SELECT ? values[offlineArray.indexOf('currentCurrency')] : getCurrency('INR');
      let appVersion = values[offlineArray.indexOf('appVersion')];
      let user_id = values[offlineArray.indexOf('user_id')];
      let auth_type = values[offlineArray.indexOf('auth_type')];
      let c_uid = values[offlineArray.indexOf('c_uid')];
      let draft_c_uid = values[offlineArray.indexOf('draft_c_uid')];
      let loginExpires = values[offlineArray.indexOf('loginExpires')];
      let codePushVersion = values[offlineArray.indexOf('codePushVersion')];
      let notificationIOS = values[offlineArray.indexOf('notificationIOS')];
      let loadedDeliveryInfo = values[offlineArray.indexOf('loadedDeliveryInfo')];
      let car_id = values[offlineArray.indexOf('car_id')];
      let car_link = values[offlineArray.indexOf('car_link')];
      let car_name = values[offlineArray.indexOf('car_name')];
      let is_finished = values[offlineArray.indexOf('is_finished')];
      let ori_link = values[offlineArray.indexOf('ori_link')];
      let phone = values[offlineArray.indexOf('phone')];
      let workshop = values[offlineArray.indexOf('workshop')];
      let first_name = values[offlineArray.indexOf('first_name')];
      let last_name = values[offlineArray.indexOf('last_name')];

      let currentDate = (Date.now() / 1000).toFixed();
      if (!loginExpires && access_token) {loginExpires = currentDate;}

      if (draft_c_uid) {
        if (diffInDays(currentDate, draft_c_uid.created_at) >= 180) {
          draft_c_uid = {
            id: null,
            created_at: null
          };
        }
      }

      let loginExpired = diffInDays(currentDate, loginExpires) >= 180;
      if ((diffInDays(currentDate, tokenExpires) >= 10) || loginExpired) {
        email = '';
        access_token = null;
        refresh_token = null;
        token_type = null;
        tokenExpires = null;
        loginExpires = loginExpired ? null : loginExpires;
        if (Config.BETAOUT_ACTIVE) NativeModules.BetaoutBridge.logout();
      }

      if (user_id && email && Config.BETAOUT_ACTIVE) NativeModules.BetaoutBridge.customerSetup(user_id.toString(), email, '');

      dispatch(setOldAppVersion(
        appVersion, codePushVersion, notificationIOS
      ));
      dispatch(offlineUserLoaded({
        email,
        first_name,
        last_name,
        access_token,
        refresh_token,
        token_type,
        tokenExpires,
        currentCurrency,
        user_id,
        auth_type,
        c_uid,
        draft_c_uid,
        loginExpires,
        loadedDeliveryInfo,
        car_id,
        car_link,
        car_name,
        is_finished,
        ori_link,
        phone,
        workshop
      }));
    });
  };
}
