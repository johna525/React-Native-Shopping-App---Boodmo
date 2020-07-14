import * as types from '../constants/ActionTypes';

export default function vehicles(state = {
  carMakers: [],
  carMakers_vin: [],
  years: [],
  models: [],
  modifications: [],
  carMakersIsFetching: false,
  carMakersFetched: false,
  carMakersError: false,
  modelsIsFetching: false,
  modelsFetched: false,
  modelsError: false,
  modificationsIsFetching: false,
  modificationsFetched: false,
  modificationsError: false,
}, action) {
  switch (action.type) {
  case types.REQUEST_CAR_MAKERS:
    return {
      ...state,
      carMakersIsFetching: true,
      carMakersFetched: false,
      carMakersError: false,
    };
  case types.RECEIVE_CAR_MAKERS:
    return {
      ...state,
      carMakersIsFetching: false,
      carMakersFetched: true,
      carMakersError: false,
      carMakers: action.carMakers,
      carMakers_vin: action.carMakers_vin
    };
  case types.RECEIVE_ERROR_CAR_MAKERS:
    return {
      ...state,
      carMakersIsFetching: false,
      carMakersFetched: false,
      carMakersError: true,
    };
  case types.SELECT_CAR_MAKER:
    return {
      ...state,
      years: [],
      models: [],
      modifications: []
    };
  case types.SELECT_CAR_MAKER_VIN:
    return {
      ...state,
    };
  case types.CLEAR_CAR_MAKER:
    return {
      ...state,
      years: [],
      models: [],
      modifications: []
    };
  case types.CLEAR_CAR_MAKER_VIN:
    return {
      ...state,
    };
  case types.RECEIVE_YEARS:
    return {
      ...state,
      years: action.years
    };
  case types.SELECT_YEAR:
    return {
      ...state,
      models: [],
      modifications: [],
    };
  case types.CLEAR_YEAR:
    return {
      ...state,
      models: [],
      modifications: [],
    };
  case types.REQUEST_MODELS:
    return {
      ...state,
      modelsIsFetching: true,
      modelsFetched: false,
      modelsError: false
    };
  case types.RECEIVE_MODELS:
    return {
      ...state,
      modelsIsFetching: false,
      modelsFetched: true,
      modelsError: false,
      models: action.models
    };
  case types.RECEIVE_ERROR_MODELS:
    return {
      ...state,
      modelsIsFetching: false,
      modelsFetched: false,
      modelsError: true,
    };
  case types.SELECT_MODEL:
    return {
      ...state,
      modifications: [],
    };
  case types.CLEAR_MODEL:
    return {
      ...state,
      modifications: [],
    };
  case types.REQUEST_MODIFICATIONS:
    return {
      ...state,
      modificationsIsFetching: true,
      modificationsFetched: false,
      modificationsError: false,
    };
  case types.RECEIVE_MODIFICATIONS:
    return {
      ...state,
      modificationsIsFetching: false,
      modificationsFetched: true,
      modificationsError: false,
      modifications: action.modifications
    };
  case types.RECEIVE_ERROR_MODIFICATIONS:
    return {
      ...state,
      modificationsIsFetching: false,
      modificationsFetched: false,
      modificationsError: true,
    };
  default:
    return state;
  }
}
