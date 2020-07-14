import {refreshToken} from './User';
const moment = require('moment');

export function oauthMiddleWare({dispatch, getState}) {

  return (next) => (action) => {
    if (typeof action === 'function') {
      if (getState().user.signedIn && getState().user.refresh_token) {

        const tokenExpiration = getState().user.tokenExpires;
        const currentTimestamp = parseInt(moment().format('X'));
        if (tokenExpiration && (tokenExpiration - currentTimestamp) < 5000) {
          if (!getState().user.freshTokenPromise) {
            return refreshToken(dispatch, getState).then(() => next(action));
          } else {
            return getState().user.freshTokenPromise.then(() => next(action));
          }
        }
      }
    }
    return next(action);
  };
}
