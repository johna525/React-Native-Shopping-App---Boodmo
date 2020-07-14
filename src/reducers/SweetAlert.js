import * as types from '../constants/ActionTypes';

export default function sweetalert(state = {
  alertHeader: null,
  alertMessage: null,
  alertState: false
}, action) {
  switch (action.type) {
  case types.SWEETALERT_SHOW:
    return {
      alertState: true,
      alertHeader: action.alertHeader,
      alertMessage: action.alertMessage
    };
  case types.SWEETALERT_HIDE:
    return {
      alertState: false
    };
  default:
    return state;
  }
}
