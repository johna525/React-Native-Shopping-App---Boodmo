import * as types from '../constants/ActionTypes';
import {getCurrency} from '../utils/Helper';

export default function user(state = {
  email: '',
  first_name: null,
  last_name: null,
  car_id: null,
  car_link: null,
  car_name: null,
  is_finished: null,
  ori_link: null,
  phone: null,
  workshop: null,
  access_token: null,
  refresh_token: null,
  token_type: null,
  tokenExpires: null,
  loginExpires: null,
  fbUserId: null,
  fbToken: null,
  signedIn: false,
  signedOut: false,
  isFetching: false,
  recoveryIsFetching: false,
  refreshTokenIsFetching: false,
  authError: '',
  registerError: '',
  sentRecoveryMessage: false,
  emailExists: 'empty',
  offlineLoadedAuth: false,
  freshTokenPromise: null,
  freshdeskTicketTypes: [],
  freshdeskFeedbackLoading: false,
  freshdeskFeedbackLoaded: false,
  freshdeskErr: false,
  freshdeskModalVisible: false,
  user_id: null,
  auth_type: 'email',
  c_uid: null,
  draft_c_uid: {
    id: null,
    created_at: null
  },
  currentCurrency: {
    name: 'INR',
    value: 'INR',
    unicode: 'U+20B9'
  }
}, action) {
  switch (action.type) {
  case types.SET_USER_INFO_FACEBOOK:
    return {
      ...state,
      fbUserId: action.fbUserId,
      fbToken: action.fbToken,
      auth_type: 'facebook'
    };
  case types.REQUEST_AUTH:
    return {
      ...state,
      isFetching: true,
      authError: '',
      registerError: '',
      recoveryIsFetching: false,
      sentRecoveryMessage: false,
    };
  case types.RECEIVE_ERROR_AUTH:
    return {
      ...state,
      isFetching: false,
      recoveryIsFetching: false,
      authError: action.message,
      registerError: '',
      sentRecoveryMessage: false,
      registeredSuccessfully: false
    };
  case types.DELETE_FROM_CART:
    return {
      ...state,
      c_uid: action.cart.length === 0 ? null : state.c_uid
    };
  case types.RECEIVE_ORDER:
    return {
      ...state,
      c_uid: null
    };
  case types.RECEIVE_ERROR_REGISTER:
    return {
      ...state,
      isFetching: false,
      authError: '',
      registerError: action.message,
      sentRecoveryMessage: false,
      registeredSuccessfully: false
    };
  case types.SIGNED_UP:
    return {
      ...state,
      isFetching: false,
      authError: '',
      registerError: '',
      sentRecoveryMessage: false,
      registeredSuccessfully: true
    };
  case types.SET_USER_INFO:
    return {
      ...state,
      email: action.email,
      access_token: action.access_token,
      refresh_token: action.refresh_token,
      token_type: action.token_type,
      auth_type: 'email',
      tokenExpires: action.tokenExpires,
      signedIn: true,
      signedOut: false,
      isFetching: false,
      emailExists: 'empty',
      authError: '',
      registerError: '',
      sentRecoveryMessage: false,
      registeredSuccessfully: false
    };
  case types.RECEIVE_CART_CUID:
    return {
      ...state,
      c_uid: action.c_uid
    };
  case types.SET_MODIF_USER_INFO:
    return {
      ...state,
      car_id: action.data.car_id,
      car_link: action.data.car_link,
      car_name: action.data.car_name,
      is_finished: action.data.is_finished,
      ori_link: action.data.ori_link,
      phone: action.data.phone,
      user_id: action.data.user_id,
      workshop: action.data.workshop,
      first_name: action.data.first_name,
      last_name: action.data.last_name
    };
  case types.RECEIVE_CART_DRAFT_CUID:
    return {
      ...state,
      draft_c_uid: ((state.draft_c_uid && state.draft_c_uid.id === action.c_uid) && (action.c_uid !== null)) ? state.draft_c_uid : {
        id: action.c_uid,
        created_at: (Date.now() / 1000).toFixed()
      }
    };
  case types.LOG_OUT:
    return {
      ...state,
      email: '',
      first_name: null,
      last_name: null,
      car_id: null,
      car_link: null,
      car_name: null,
      is_finished: null,
      ori_link: null,
      phone: null,
      user_id: null,
      workshop: null,
      access_token: null,
      refresh_token: null,
      token_type: null,
      tokenExpires: null,
      fbUserId: null,
      fbToken: null,
      signedIn: false,
      isFetching: false,
      signedOut: true,
      emailExists: 'empty',
      authError: '',
      registerError: '',
      sentRecoveryMessage: false,
      registeredSuccessfully: false,
      c_uid: null
    };
  case types.REQUEST_CHECK_EMAIL:
    return {
      ...state,
      isFetching: true,
      emailExists: 'empty',
      authError: '',
      registerError: '',
      sentRecoveryMessage: false,
      registeredSuccessfully: false
    };
  case types.RECEIVE_CHECK_EMAIL:
    return {
      ...state,
      isFetching: false,
      emailExists: action.emailExists,
      authError: '',
      registerError: '',
      sentRecoveryMessage: false,
      registeredSuccessfully: false
    };
  case types.CHECKOUT_STEP_CHANGE_EMAIL:
    return {
      ...state,
      isFetching: false,
      emailExists: 'empty',
      authError: '',
      registerError: '',
      sentRecoveryMessage: false,
      registeredSuccessfully: false
    };
  case types.SET_USER_INFO_EMAIL:
    return {
      ...state,
      email: action.email,
      signedOut: false,
      authError: '',
      registerError: '',
      isFetching: false,
      sentRecoveryMessage: false,
      registeredSuccessfully: false
    };
  case types.REQUEST_PASSWORD_RECOVERY:
    return {
      ...state,
      recoveryIsFetching: true,
      emailExists: true,
    };
  case types.SENT_PASSWORD_RECOVERY:
    return {
      ...state,
      recoveryIsFetching: false,
      authError: '',
      registerError: '',
      sentRecoveryMessage: true,
      registeredSuccessfully: false
    };
  case types.CLEAR_AUTH_ERRORS:
    return {
      ...state,
      isFetching: false,
      authError: '',
      registerError: '',
      sentRecoveryMessage: false,
      registeredSuccessfully: false
    };
  case types.OFFLINE_USER_LOADED:
    return {
      ...state,
      email: action.email,
      first_name: action.first_name,
      last_name: action.last_name,
      user_id: action.user_id,
      access_token: action.access_token,
      refresh_token: action.refresh_token,
      token_type: action.token_type,
      tokenExpires: action.tokenExpires,
      signedIn: action.signedIn,
      currentCurrency: action.currentCurrency,
      offlineLoadedAuth: true,
      auth_type: action.auth_type,
      c_uid: action.c_uid,
      draft_c_uid: action.draft_c_uid,
      loginExpires: action.loginExpires,
      car_id: action.car_id,
      car_link: action.car_link,
      car_name: action.car_name,
      is_finished: action.is_finished,
      ori_link: action.ori_link,
      phone: action.phone,
      workshop: action.workshop
    };
  case types.REQUEST_REFRESH_TOKEN:
    return {
      ...state,
      refreshTokenIsFetching: true,
      refreshTokenError: false,
      freshTokenPromise: action.freshTokenPromise
    };
  case types.RECEIVE_REFRESH_TOKEN:
    return {
      ...state,
      access_token: action.access_token,
      refresh_token: action.refresh_token,
      token_type: action.token_type,
      tokenExpires: action.tokenExpires,
      refreshTokenIsFetching: false,
    };
  case types.RECEIVE_ERROR_REFRESH_TOKEN:
    return {
      ...state,
      refreshTokenIsFetching: false,
    };
  case types.FRESHDESK_TICKET_TYPES_SUCCESS:
    return {
      ...state,
      freshdeskTicketTypes: action.data
    };
  case types.FRESHDESK_FEEDBACK_ATTEMPT:
    return {
      ...state,
      freshdeskFeedbackLoading: true,
      freshdeskFeedbackLoaded: false
    };
  case types.FRESHDESK_FEEDBACK_SUCCESS:
    return {
      ...state,
      freshdeskFeedbackLoading: false,
      freshdeskFeedbackLoaded: true,
      freshdeskErr: false
    };
  case types.FRESHDESK_FEEDBACK_RECOVER:
    return {
      ...state,
      freshdeskFeedbackLoaded: false,
      freshdeskFeedbackLoading: false,
      freshdeskErr: false
    };
  case types.FRESHDESK_ERORR:
    return {
      ...state,
      freshdeskErr: true
    };
  case types.FIRE_FRESHDESK_MODAL:
    return {
      ...state,
      freshdeskModalVisible: !state.freshdeskModalVisible
    };
  case types.CHANGE_CURRENT_CURRENCY:
    return {
      ...state,
      currentCurrency: action.currentCurrency
    };
  default:
    return state;
  }
}
