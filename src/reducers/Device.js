import * as types from '../constants/ActionTypes';

export default function device(state = {
  screenWidth: 0,
  screenHeight: 0,
  platformOS: null,
  headerHeight: 50,
  iosBarHeader: 0,
  appVersion: null,
  oldAppVersion: null,
  buildNumber: null,
  codePushVersion: null,
  offlineLoadedDevice: false,
  deviceToken: null,
  notificationIOS: false
}, action) {
  switch (action.type) {
  case types.SET_DEVICE_WIDTH:
    return {
      ...state,
      screenWidth: action.width
    };
  case types.SET_DEVICE_HEIGHT:
    return {
      ...state,
      screenHeight: action.height
    };
  case types.SET_BUILD_NUMBER:
    return {
      ...state,
      buildNumber: action.number
    };
  case types.SET_CODEPUSH_VERSION:
    return {
      ...state,
      codePushVersion: action.version
    };
  case types.REQUEST_NOTIIF_PERM_IOS:
    return {
      ...state,
      notificationIOS: true
    };
  case types.SET_PLATFORM_OS:
    return {
      ...state,
      platformOS: action.platformOS,
      iosBarHeader: action.platformOS === 'ios' ? 20 : 0
    };
  case types.SET_APP_VERSION:
    return {
      ...state,
      appVersion: action.appVersion,
    };
  case types.SET_OLD_APP_VERSION:
    return {
      ...state,
      oldAppVersion: action.oldAppVersion,
      codePushVersion: action.codePushVersion,
      offlineLoadedDevice: true,
      notificationIOS: action.notificationIOS
    };
  case types.SET_DEVICE_TOKEN:
    return {
      ...state,
      deviceToken: action.token
    };
  default:
    return state;
  }
}
