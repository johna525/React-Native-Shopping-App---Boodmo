import offline from 'react-native-simple-store';
import {checkVersion} from '../utils/checkVersion';

export default function (store) {
  let currentEmail = '',
    currentAccess_token = null,
    currentRefresh_token = null,
    currentToken_type = null,
    currentTokenExpires = null,
    currentCurrentCurrency = null;

  store.subscribe(() => {
    const {offlineLoadedDevice, appVersion, oldAppVersion, codePushVersion, notificationIOS} = store.getState().device;
    const {offlineLoaded} = store.getState().cart;
    const {
      offlineLoadedAuth,
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
      car_id,
      car_link,
      car_name,
      is_finished,
      ori_link,
      phone,
      workshop
    } = store.getState().user;
    const {loadedDeliveryInfo} = store.getState().checkout;

    if (offlineLoadedDevice && checkVersion({currentVersion: oldAppVersion, latestVersion: appVersion}, true)) {
      offline.save('appVersion', appVersion);
    }

    if (access_token && Object.values(loadedDeliveryInfo ? typeof loadedDeliveryInfo === 'object' : {}).length > 0) {offline.save('loadedDeliveryInfo', loadedDeliveryInfo);}

    if (codePushVersion) {offline.save('codePushVersion', codePushVersion);}
    if (notificationIOS) {offline.save('notificationIOS', notificationIOS);}

    if (offlineLoadedAuth &&
            (currentEmail != email ||
                currentAccess_token != access_token ||
                currentRefresh_token != refresh_token ||
                currentToken_type != token_type ||
                currentTokenExpires != tokenExpires ||
                currentCurrentCurrency != currentCurrency)) {
      currentEmail = email;
      currentAccess_token = access_token;
      currentRefresh_token = refresh_token;
      currentToken_type = token_type;
      currentTokenExpires = tokenExpires;
      currentCurrentCurrency = currentCurrency;
      offline.save('email', email);
      offline.save('first_name', first_name);
      offline.save('last_name', last_name);
      offline.save('access_token', access_token);
      offline.save('refresh_token', refresh_token);
      offline.save('token_type', token_type);
      offline.save('tokenExpires', tokenExpires);
      offline.save('currentCurrency', currentCurrency);
      offline.save('user_id', user_id);
      offline.save('auth_type', auth_type);
      offline.save('c_uid', c_uid);
      offline.save('loginExpires', loginExpires);
      offline.save('car_id', car_id);
      offline.save('car_link', car_link);
      offline.save('car_name', car_name);
      offline.save('is_finished', is_finished);
      offline.save('ori_link', ori_link);
      offline.save('phone', phone);
      offline.save('workshop', workshop);
    } else if (offlineLoadedAuth) {
      offline.save('draft_c_uid', draft_c_uid);
    }
  });
}
