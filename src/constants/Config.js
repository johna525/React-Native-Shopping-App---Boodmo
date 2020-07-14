import {Platform} from 'react-native';
import * as base64 from 'base-64';
import Base64 from 'Base64';

export const ENV = 'prod'; // ['prod', 'dev']
export const APP_ID = '1154010647';
export const APP_NAME = 'boodmo';
export const PROD_HOST = 'https://mobile.boodmo.com/v1/mobile'; // Production
export const DEV_HOST = 'https://mobile.boodmo-stage.opsway-dev.com/v1/mobile'; // Development
export const MC_PROD_HOST = 'https://mobile.boodmo.com/v2'; // Production
export const MC_DEV_HOST = 'https://mobile.boodmo-stage.opsway-dev.com/v2'; // Development
export const HOST = ENV === 'prod' ? PROD_HOST : DEV_HOST;
export const MC_HOST = ENV === 'prod' ? MC_PROD_HOST : MC_DEV_HOST;
export const PROD_AUTH_HOST = 'https://mobile.boodmo.com'; // Production AUTH
export const DEV_AUTH_HOST = 'https://mobile.boodmo-stage.opsway-dev.com'; // Dev AUTH
export const AUTH_HOST = ENV === 'prod' ? PROD_AUTH_HOST : DEV_AUTH_HOST;
export const MOCK_HOST = 'https://private-b23aa-boodmo.apiary-mock.com/v1/mobile'; // MOCK SERVER (APIARY)
export const FACEBOOK_GRAPH = 'https://graph.facebook.com/v2.5';
export const IMAGE_FOLDER_ROOT = 'https://boodmo.com/media';
export const IMAGE_FOLDER = IMAGE_FOLDER_ROOT + '/cache/catalog_list';
export const CART_URL = 'https://boodmo.com/checkout/cart';
export const PROFILE_URL = 'https://boodmo.com/u/profile';
export const BOODMO_URL = 'https://boodmo.com/';
export const BETAOUT_ACTIVE = true;
export const BETAOUT_APIKEY = 'blgams44m2hashqo738h3h6hjhnlm97jy8whhjz8b1';
export const BETAOUT_PROJECT_ID = 34589;
export const BETAOUT_URL = 'https://api.betaout.com/v2/ecommerce/activities';
export const FRESHDESK_API_KEY = Base64.btoa('lmk8YDkcQYL1z9HdIeaY');
export const FRESHDESK_AGENT_ID = 16007377757;
export const ORI_URL = 'http://oriparts.com';
export const IOS_SOURCE = 'app_ios';
export const ANDROID_SOURCE = 'app_android';
export const SHOW_CURRENCY_SELECT = false;

//  stage config
//  export const PROD_HOST = 'https://mobile.boodmo-stage.opsway-dev.com/v1/mobile';
//  export const MC_PROD_HOST = 'https://mobile.boodmo-stage.opsway-dev.com/v2';
//  export const PROD_AUTH_HOST = 'https://mobile.boodmo-stage.opsway-dev.com';


export const API_KEY_RAZORPAY_TEST = 'rzp_test_4qwWeAcubUU7Dn';
export const BOODMO_LOGO_SMALL = 'https://boodmo.com/img/logosmall.jpg';

export const DEFAULT_SORTED_BY = {value: 'popular_desc', name: 'New and popular'};

export const GET = (auth = null) => {
  return {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': auth,
      'X-Mobile-App': `app_${Platform.OS}`
    }
  };
};

export const POST = (options = {body: null, auth: null}) => {
  const {body, auth} = options;
  return {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': auth,
      'X-Mobile-App': `app_${Platform.OS}`
    },
    body: JSON.stringify(body)
  };
};

export const PUT = (options = {body: null, auth: null}) => {
  const {body, auth} = options;
  return {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': auth,
      'X-Mobile-App': `app_${Platform.OS}`
    },
    body: JSON.stringify(body)
  };
};

export const DEV_POST = (body = {}) => {
  return {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${base64.encode('opsway:opsway1')}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
};
