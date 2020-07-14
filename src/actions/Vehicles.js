import * as types from '../constants/ActionTypes';
import ApiUtils from '../utils/ApiUtils';
import * as Config from '../constants/Config';
import * as Messages from '../constants/Messages';
import * as Log from './Log';
import {showAlert} from './SweetAlert';

//==========================================================
// CAR MAKERS
//==========================================================

export function getCarMakers() {
  return (dispatch, getState) => {
    const carMakers = getState().vehicles.carMakers;
    if (shouldFetchCarMakers(carMakers)) {
      return dispatch(fetchCarMakers());
    }
  };
}

function shouldFetchCarMakers(carMakers) {
  return carMakers.length === 0;
}

function fetchCarMakers() {
  return (dispatch) => {
    dispatch(requestCarMakers());
    let url = `${Config.HOST}/vehicles/brand?popular`;
    ApiUtils.timeoutPromise(fetch(url, Config.GET)
      .then(ApiUtils.checkStatus)
      .then(responseJson => {
        let carMakers = responseJson.items.map((v) => {
          return {
            value: v.id,
            name: v.name,
            is_featured: !!v['is_featured'],
            min_year_calculated: v.min_year_calculated,
            max_year: v.max_year,
          };
        });
        let carMakers_vin = responseJson.items.filter((v) => v.vin_url)
          .map((v) => {
            return {
              value: v.id,
              name: v.name,
              is_featured: !!v['is_featured'],
              vin_url: v.vin_url,
            };
          });
        dispatch(receiveCarMakers(carMakers, carMakers_vin));
      })
      .catch((error) => {
        dispatch(receiveErrorCarMakers());
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`);
      })
      , 20000)
      .catch((error) => {
        dispatch(receiveErrorCarMakers());
        dispatch(showAlert('Error', error.message));
        Log.logCrash(`${url} - ${error.message}`);
      });
  };
}

function requestCarMakers() {
  return {
    type: types.REQUEST_CAR_MAKERS,
  };
}

function receiveCarMakers(carMakers, carMakers_vin) {
  return {
    type: types.RECEIVE_CAR_MAKERS,
    carMakers: carMakers,
    carMakers_vin: carMakers_vin,
  };
}

function receiveErrorCarMakers() {
  return {
    type: types.RECEIVE_ERROR_CAR_MAKERS
  };
}

export function selectCarMaker() {
  return {
    type: types.SELECT_CAR_MAKER
  };
}
export function selectCarMakerVin() {
  return {
    type: types.SELECT_CAR_MAKER_VIN
  };
}
export function clearCarMaker() {
  return {
    type: types.CLEAR_CAR_MAKER
  };
}
export function clearCarMakerVin() {
  return {
    type: types.CLEAR_CAR_MAKER_VIN
  };
}
//==========================================================
// YEARS
//==========================================================

export function getYears(carMaker) {
  let start = carMaker.min_year_calculated;
  let end = carMaker.max_year;
  let years = [];
  for (let i = end; i >= start; i--) {
    years.push({
      value: i,
      name: i.toString()
    });
  }
  return {
    type: types.RECEIVE_YEARS,
    years: years,
  };
}

export function selectYear() {
  return {
    type: types.SELECT_YEAR
  };
}
export function clearYear() {
  return {
    type: types.CLEAR_YEAR
  };
}

//==========================================================
// MODELS
//==========================================================

export function getModels(selectedCarMaker, selectedYear) {
  return (dispatch, getState) => {
    const models = getState().vehicles.models;
    if (shouldFetchModels(models)) {
      return dispatch(fetchModels(selectedCarMaker, selectedYear));
    }
  };
}


function shouldFetchModels(models) {
  return models.length === 0;
}

function fetchModels(selectedCarMaker, selectedYear) {
  return (dispatch) => {
    dispatch(requestModels());
    let url = selectedYear ? `${Config.HOST}/vehicles/model?parent_brand_id=${selectedCarMaker.value}&year_value=${selectedYear.value}`
      : `${Config.HOST}/vehicles/model?parent_brand_id=${selectedCarMaker.value}`;
    ApiUtils.timeoutPromise(fetch(url, Config.GET)
      .then(ApiUtils.checkStatus)
      .then(responseJson => {
        let models = responseJson.items.map((v) => {
          return {
            value: v.id,
            name: v.name,
          };
        });
        dispatch(receiveModels(models));
      })
      .catch((error) => {
        dispatch(receiveErrorModels());
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`);
      })
      , 20000)
      .catch((error) => {
        dispatch(receiveErrorModels());
        dispatch(showAlert('Error', error.message));
        Log.logCrash(`${url} - ${error.message}`);
      });
  };
}

function requestModels() {
  return {
    type: types.REQUEST_MODELS,
  };
}

function receiveModels(models) {
  return {
    type: types.RECEIVE_MODELS,
    models: models
  };
}

function receiveErrorModels() {
  return {
    type: types.RECEIVE_ERROR_MODELS
  };
}

export function selectModel() {
  return {
    type: types.SELECT_MODEL
  };
}
export function clearModel() {
  return {
    type: types.CLEAR_MODEL
  };
}

//==========================================================
// MODIFICATIONS
//==========================================================

export function getModifications(selectedModel, selectedYear) {
  return (dispatch, getState) => {
    const modifications = getState().vehicles.modifications;
    if (shouldFetchModifications(modifications)) {
      return dispatch(fetchModifications(selectedModel, selectedYear));
    }
  };
}

function shouldFetchModifications(modifications) {
  return modifications.length === 0;
}

function fetchModifications(selectedModel, selectedYear) {
  return (dispatch) => {
    dispatch(requestModifications());
    let url = `${Config.HOST}/vehicles/modification?parent_model_id=${selectedModel.value}&year_value=${selectedYear.value}`;
    ApiUtils.timeoutPromise(fetch(url, Config.GET)
      .then(ApiUtils.checkStatus)
      .then(responseJson => {
        let modifications = responseJson.items.map((v) => {
          return {
            value: v.id,
            slug: v.slug,
            name: v.name,
            oem_url: v.oem_url,
            url: v.url,
            imageUrl: v.imageUrl,
            parent_slug: v.parent_slug || '',
          };
        });
        dispatch(receiveModifications(modifications));
      })
      .catch((error) => {
        dispatch(receiveErrorModifications());
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`);
      })
      , 20000)
      .catch((error) => {
        dispatch(receiveErrorModifications());
        dispatch(showAlert('Error', error.message));
        Log.logCrash(`${url} - ${error.message}`);
      });
  };
}

function requestModifications() {
  return {
    type: types.REQUEST_MODIFICATIONS,
  };
}

function receiveModifications(modifications) {
  return {
    type: types.RECEIVE_MODIFICATIONS,
    modifications: modifications
  };
}

function receiveErrorModifications() {
  return {
    type: types.RECEIVE_ERROR_MODIFICATIONS
  };
}

export function selectModification() {
  return {
    type: types.SELECT_MODIFICATION
  };
}
export function clearModification() {
  return {
    type: types.CLEAR_MODIFICATION
  };
}
