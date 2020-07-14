import * as types from '../constants/ActionTypes';
import * as Log from './Log';
import * as Events from '../constants/Events';

export function showAlert(alertHeader, alertMessage) {
  return {
    type: types.SWEETALERT_SHOW,
    alertHeader,
    alertMessage
  };
}

export function hideAlert() {
  Log.logEvent(Events.EVENT_MODAL_OK);
  return {
    type: types.SWEETALERT_HIDE
  };
}