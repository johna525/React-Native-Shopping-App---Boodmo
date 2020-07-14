import * as types from '../constants/ActionTypes';

export default function filter(state = {
  carMakers: [],
  years: [],
  modifications: [],
  models: [],
  modelLines: [],
  brands: [],
  family: [],
  allCategories: [],
  categories: [],
  subCategories: [],
  subSubCategories: [],
  selectedModel: null,
  selectedModelLine: null,
  selectedYear: null,
  selectedModification: null,

  carMakersIsFetching: false,
  carMakersFetched: false,
  carMakersError: false,
  modelsIsFetching: false,
  modelsFetched: false,
  modelsError: false,
  modelLinesIsFetching: false,
  modelLinesFetched: false,
  modelLinesError: false,
  modificationsIsFetching: false,
  modificationsFetched: false,
  modificationsError: false,

  enableSorting: false

}, action) {
  switch (action.type) {
  case types.REQUEST_FILTER_CAR_MAKERS:
    return {
      ...state,
      carMakersIsFetching: true,
      carMakersFetched: false,
      carMakersError: false,
    };
  case types.RECEIVE_FILTER_CAR_MAKERS:
    return {
      ...state,
      carMakersIsFetching: false,
      carMakersFetched: true,
      carMakersError: false,
      carMakers: action.carMakers,
    };
  case types.RECEIVE_ERROR_FILTER_CAR_MAKERS:
    return {
      ...state,
      carMakersIsFetching: false,
      carMakersFetched: false,
      carMakersError: true,
    };
  case types.SELECT_FILTER_CAR_MAKER:
    return {
      ...state,
      models: [],
      years: [],
      modifications: [],
    };
  case types.CLEAR_FILTER_CAR_MAKER:
    return {
      ...state,
      models: [],
      years: [],
      modifications: [],
    };
  case types.REQUEST_FILTER_MODEL_LINES:
    return {
      ...state,
      modelLinesIsFetching: true,
      modelLinesFetched: false,
      modelLinesError: false,
    };
  case types.RECEIVE_FILTER_MODEL_LINES:
    return {
      ...state,
      modelLinesIsFetching: false,
      modelLinesFetched: true,
      modelLinesError: false,
      modelLines: action.modelLines
    };
  case types.RECEIVE_ERROR_FILTER_MODEL_LINES:
    return {
      ...state,
      modelLinesIsFetching: false,
      modelLinesFetched: false,
      modelLinesError: true,
    };
  case types.SELECT_FILTER_MODEL_LINE:
    return {
      ...state,
    };
  case types.SET_FILTER_MODEL_LINE:
    return {
      ...state,
      selectedModelLine: action.selectedModelLine,
    };
  case types.CLEAR_FILTER_MODEL_LINE:
    return {
      ...state,
      selectedModelLine: null,
      selectedModification: null,
      modelLinesIsFetching: false,
      modelLinesFetched: false,
      modelLinesError: false,
      modelLines: [],
      modifications: [],
    };
  case types.RECEIVE_FILTER_YEARS:
    return {
      ...state,
      years: action.years
    };
  case types.SELECT_FILTER_YEAR:
    return {
      ...state,
      models: [],
      modifications: [],
    };
  case types.CLEAR_FILTER_YEAR:
    return {
      ...state,
      models: [],
      modifications: [],
    };
  case types.REQUEST_FILTER_MODIFICATIONS:
    return {
      ...state,
      modificationsIsFetching: true,
      modificationsFetched: false,
      modificationsError: false,
    };
  case types.RECEIVE_FILTER_MODIFICATIONS:
    return {
      ...state,
      modificationsIsFetching: false,
      modificationsFetched: true,
      modificationsError: false,
      modifications: action.modifications
    };
  case types.RECEIVE_ERROR_FILTER_MODIFICATIONS:
    return {
      ...state,
      modificationsIsFetching: false,
      modificationsFetched: false,
      modificationsError: true,
    };
  case types.SELECT_FILTER_MODIFICATION:
    return {
      ...state,
    };
  case types.SET_FILTER_MODIFICATION:
    return {
      ...state,
      selectedModification: action.selectedModification,
    };
  case types.CLEAR_FILTER_MODIFICATION:
    return {
      ...state,
      selectedModification: null,
      modificationsIsFetching: false,
      modificationsFetched: false,
      modificationsError: false,
      modifications: [],
    };
  case types.REQUEST_FILTER_MODELS:
    return {
      ...state,
      modelsIsFetching: true,
      modelsFetched: false,
      modelsError: false,
    };
  case types.RECEIVE_FILTER_MODELS:
    return {
      ...state,
      modelsIsFetching: false,
      modelsFetched: true,
      modelsError: false,
      models: action.models
    };
  case types.RECEIVE_ERROR_FILTER_MODELS:
    return {
      ...state,
      modelsIsFetching: false,
      modelsFetched: false,
      modelsError: true,
    };
  case types.SET_RESET_FILTER_DATA:
    return {
      ...state,
      carMakers: action.parameters['carMakers'] ? action.parameters['carMakers'] : [],
      models: action.parameters['models'] ? action.parameters['models'] : [],
      years: action.parameters['years'] ? action.parameters['years'] : [],
      modifications: action.parameters['modifications'] ? action.parameters['modifications'] : [],

      carMakersIsFetching: false,
      carMakersFetched: false,
      carMakersError: false,
      modelLinesIsFetching: false,
      modelLinesFetched: false,
      modelLinesError: false,
      modelsIsFetching: false,
      modelsFetched: false,
      modelsError: false,
      modificationsIsFetching: false,
      modificationsFetched: false,
      modificationsError: false,
    };
  case types.RESET_FILTER_DATA:
    return {
      ...state,
      carMakers: state.carMakers,
      models: [],
      modelLines: [],
      years: [],
      modifications: [],
      brands: state.brands,
      family: state.family,
      allCategories: state.allCategories,
      categories: state.categories,
      subCategories: [],
      subSubCategories: [],
    };
  case types.SET_ENABLE_SORTING:
    return {
      ...state,
      enableSorting: action.enableSorting
    };
  case types.RECEIVE_FILTER_BRANDS:
    return {
      ...state,
      brands: action.brands
    };
  case types.RECEIVE_FILTER_FAMILY:
    return {
      ...state,
      family: action.family
    };
  case types.RECEIVE_FILTER_CATEGORIES:
    return {
      ...state,
      allCategories: action.allCategories,
      categories: action.categories
    };
  case types.SELECT_FILTER_CATEGORY:
    return {
      ...state,
      subCategories: [],
      subSubCategories: []
    };
  case types.CLEAR_FILTER_CATEGORY:
    return {
      ...state,
      subCategories: [],
      subSubCategories: []
    };
  case types.RECEIVE_FILTER_SUBCATEGORIES:
    return {
      ...state,
      subCategories: action.subCategories
    };
  case types.SELECT_FILTER_SUBCATEGORY:
    return {
      ...state,
      subSubCategories: []
    };
  case types.CLEAR_FILTER_SUBCATEGORY:
    return {
      ...state,
      subSubCategories: []
    };
  case types.RECEIVE_FILTER_SUBSUBCATEGORIES:
    return {
      ...state,
      subSubCategories: action.subSubCategories
    };
  default:
    return state;
  }
}
