import * as types from '../constants/ActionTypes';

export function online() {
  return {
    type: types.CONNECTION_ONLINE
  };
}

export function offline() {
  return {
    type: types.CONNECTION_OFFLINE
  };
}