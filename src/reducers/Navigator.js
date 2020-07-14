import * as types from '../constants/ActionTypes';

export default function navigator(state = {
  route: 'default'
}, action) {
  switch (action.type) {
  case types.SET_APP_ROUTE:
    return {
      ...state,
      route: action.route
    };
  default:
    return state;
  }
}
