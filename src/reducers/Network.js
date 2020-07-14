import * as types from '../constants/ActionTypes';

export default function network(state = {
  connectionChecked: false,
  connected: true
}, action) {
  switch (action.type) {
  case types.CONNECTION_CHECKING:
    return {
      ...state,
      connectionChecked: false
    };
  case types.CONNECTION_CHECKED:
    return {
      ...state,
      connectionChecked: true
    };
  case types.CONNECTION_ONLINE:
    return {
      ...state,
      connectionChecked: true,
      connected: true
    };
  case types.CONNECTION_OFFLINE:
    return {
      ...state,
      connectionChecked: true,
      connected: false
    };
  default:
    return state;
  }
}
