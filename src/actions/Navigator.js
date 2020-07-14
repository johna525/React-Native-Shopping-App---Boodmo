import * as types from '../constants/ActionTypes';

export function setRoute(route) {
  return {
    type: types.SET_APP_ROUTE,
    route
  };
}
