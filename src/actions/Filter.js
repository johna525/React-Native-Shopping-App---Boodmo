import * as types from '../constants/ActionTypes';
import ApiUtils from '../utils/ApiUtils';
import * as Config from '../constants/Config';
import * as Messages from '../constants/Messages';
import * as Log from './Log';
import {showAlert} from './SweetAlert';

//==========================================================
// CAR MAKERS
//==========================================================

export function getFilterCarMakers() {
  return (dispatch, getState) => {
    const carMakers = getState().filter.carMakers;
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
    let url = `${Config.HOST}/vehicles/brand`;
    ApiUtils.timeoutPromise(fetch(url, Config.GET)
      .then(ApiUtils.checkStatus)
      .then(responseJson => {
        let carMakers = responseJson.items.map((v) => {
          return {
            value: v.id,
            name: v.name,
            min_year_calculated: v.min_year_calculated,
            max_year: v.max_year,
          };
        });
        dispatch(receiveFilterCarMakers(carMakers));
      })
      .catch((error) => {
        dispatch(receiveErrorFilterCarMakers());
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`);
      })
      , 20000)
      .catch((error) => {
        dispatch(receiveErrorFilterCarMakers());
        dispatch(showAlert('Error', error.message));
        Log.logCrash(`${url} - ${error.message}`);
      });
  };
}

function requestCarMakers() {
  return {
    type: types.REQUEST_FILTER_CAR_MAKERS,
  };
}

export function receiveFilterCarMakers(carMakers) {
  return {
    type: types.RECEIVE_FILTER_CAR_MAKERS,
    carMakers: carMakers
  };
}

function receiveErrorFilterCarMakers() {
  return {
    type: types.RECEIVE_ERROR_FILTER_CAR_MAKERS
  };
}

export function selectFilterCarMaker() {
  return {
    type: types.SELECT_FILTER_CAR_MAKER,
  };
}
export function clearFilterCarMaker() {
  return {
    type: types.CLEAR_FILTER_CAR_MAKER,
  };
}

//==========================================================
// YEARS
//==========================================================

export function getFilterYears(carMaker) {
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
    type: types.RECEIVE_FILTER_YEARS,
    years,
  };
}

export function receiveFilterYears(years) {
  return {
    type: types.RECEIVE_FILTER_YEARS,
    years,
  };
}
export function selectFilterYear() {
  return {
    type: types.SELECT_FILTER_YEAR
  };
}
export function clearFilterYear() {
  return {
    type: types.CLEAR_FILTER_YEAR
  };
}

//==========================================================
// MODELS
//==========================================================

export function getFilterModels(selectedCarMaker, selectedYear) {
  return (dispatch, getState) => {
    const models = getState().filter.models;
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
        dispatch(receiveFilterModels(models));
      })
      .catch((error) => {
        dispatch(receiveErrorFilterModels());
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`);
      })
      , 20000)
      .catch((error) => {
        dispatch(receiveErrorFilterModels());
        dispatch(showAlert('Error', error.message));
        Log.logCrash(`${url} - ${error.message}`);
      });
  };
}

function requestModels() {
  return {
    type: types.REQUEST_FILTER_MODELS,
  };
}

export function receiveFilterModels(models) {
  return {
    type: types.RECEIVE_FILTER_MODELS,
    models: models
  };
}

function receiveErrorFilterModels() {
  return {
    type: types.RECEIVE_ERROR_FILTER_MODELS
  };
}

export function selectFilterModel() {
  return {
    type: types.SELECT_FILTER_MODEL,
  };
}

export function clearFilterModel() {
  return {
    type: types.CLEAR_FILTER_MODEL
  };
}

//==========================================================
// MODEL LINES
//==========================================================

export function getFilterModelLines(selectedCarMaker, selectedModel = null) {
  return (dispatch, getState) => {
    const modelLines = getState().filter.modelLines;
    if (shouldFetchModelLines(modelLines)) {
      return dispatch(fetchModelLines(selectedCarMaker, selectedModel));
    }
  };
}

function shouldFetchModelLines(modelLines) {
  return modelLines.length === 0;
}

function fetchModelLines(selectedCarMaker, selectedYear) {
  return (dispatch, getState) => {
    dispatch(requestModelLines());
    let url = selectedYear ? `${Config.HOST}/vehicles/modelline?parent_brand_id=${selectedCarMaker.value}&year_value=${selectedYear.value}`
      : `${Config.HOST}/vehicles/modelline?parent_brand_id=${selectedCarMaker.value}`;

    ApiUtils.timeoutPromise(fetch(url, Config.GET)
      .then(ApiUtils.checkStatus)
      .then(responseJson => {
        let selectedModelLine = responseJson['selected'] ? {
          value: responseJson['selected']['id'],
          name: responseJson['selected']['name'],
        } : null;
        let modelLines = responseJson.items.map((v) => {
          return {
            value: v.id,
            name: v.name,
          };
        });

        dispatch(receiveFilterModelLines(modelLines));
        dispatch(setFilterModelLine(selectedModelLine));
        if (selectedModelLine && !getState().filter.models.length) {
          dispatch(getFilterModels(selectedModelLine));
        }
      })
      .catch((error) => {
        dispatch(receiveErrorFilterModelLines());
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`);
      })
      , 20000)
      .catch((error) => {
        dispatch(receiveErrorFilterModelLines());
        dispatch(showAlert('Error', error.message));
        Log.logCrash(`${url} - ${error.message}`);
      });
  };
}

function requestModelLines() {
  return {
    type: types.REQUEST_FILTER_MODEL_LINES,
  };
}

function receiveFilterModelLines(modelLines) {
  return {
    type: types.RECEIVE_FILTER_MODEL_LINES,
    modelLines: modelLines,
  };
}

function receiveErrorFilterModelLines() {
  return {
    type: types.RECEIVE_ERROR_FILTER_MODEL_LINES
  };
}

export function selectFilterModelLine() {
  return {
    type: types.SELECT_FILTER_MODEL_LINE,
  };
}
function setFilterModelLine(selectedModelLine) {
  return {
    type: types.SET_FILTER_MODEL_LINE,
    selectedModelLine: selectedModelLine
  };
}
export function clearFilterModelLine() {
  return {
    type: types.CLEAR_FILTER_MODEL_LINE,
  };
}

//==========================================================
// MODIFICATIONS
//==========================================================

export function getFilterModifications(selectedModel, selectedYear) {
  return (dispatch, getState) => {
    const modifications = getState().filter.modifications;
    if (shouldFetchModifications(modifications)) {
      return dispatch(fetchFilterModifications(selectedModel, selectedYear));
    }
  };
}

function shouldFetchModifications(modifications) {
  return modifications.length === 0;
}

function fetchFilterModifications(selectedModel, selectedYear) {
  return (dispatch) => {
    dispatch(requestFilterModifications());
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
        dispatch(receiveFilterModifications(modifications));
      })
      .catch((error) => {
        dispatch(receiveErrorFilterModifications());
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`);
      })
      , 20000)
      .catch((error) => {
        dispatch(receiveErrorFilterModifications());
        dispatch(showAlert('Error', error.message));
        Log.logCrash(`${url} - ${error.message}`);
      });
  };
}

function requestFilterModifications() {
  return {
    type: types.REQUEST_FILTER_MODIFICATIONS,
  };
}

export function receiveFilterModifications(modifications) {
  return {
    type: types.RECEIVE_FILTER_MODIFICATIONS,
    modifications,
  };
}

function receiveErrorFilterModifications() {
  return {
    type: types.RECEIVE_ERROR_FILTER_MODIFICATIONS
  };
}

export function selectFilterModification() {
  return {
    type: types.SELECT_FILTER_MODIFICATION
  };
}
export function clearFilterModification() {
  return {
    type: types.CLEAR_FILTER_MODIFICATION
  };
}

//==========================================================
// BRANDS
//==========================================================
export function receiveFilterBrands(brands) {
  return {
    type: types.RECEIVE_FILTER_BRANDS,
    brands: brands
  };
}

//==========================================================
// FAMILY
//==========================================================
export function receiveFilterFamily(family) {
  return {
    type: types.RECEIVE_FILTER_FAMILY,
    family: family
  };
}

//==========================================================
// MIN/MAX PRICE RANGE
//==========================================================

export function inputPriceRangeMin(priceRangeMin) {
  return {
    type: types.INPUT_PRICE_RANGE_MIN,
    priceRangeMin: priceRangeMin
  };
}

export function inputPriceRangeMax(priceRangeMax) {
  return {
    type: types.INPUT_PRICE_RANGE_MAX,
    priceRangeMax: priceRangeMax
  };
}

//==========================================================
// SORTING
//==========================================================

export function setEnableSorting(enableSorting) {
  return {
    type: types.SET_ENABLE_SORTING,
    enableSorting: enableSorting
  };
}

//==========================================================
// CATEGORIES
//==========================================================

export function receiveFilterCategories(allCategories, categories) {
  return {
    type: types.RECEIVE_FILTER_CATEGORIES,
    allCategories: allCategories,
    categories: categories
  };
}

export function selectFilterCategory() {
  return {
    type: types.SELECT_FILTER_CATEGORY,
  };
}
export function clearFilterCategory() {
  return {
    type: types.CLEAR_FILTER_CATEGORY,
  };
}
//==========================================================
// SUBCATEGORIES
//==========================================================

export function getFilterSubCategories(selectedCategory) {
  return (dispatch, getState) => {
    const subCategories = getState().filter.allCategories.filter((v) => {
      return v.parent === selectedCategory.value;
    });
    dispatch(receiveFilterSubCategories(subCategories));
  };
}
export function receiveFilterSubCategories(subCategories) {
  return {
    type: types.RECEIVE_FILTER_SUBCATEGORIES,
    subCategories: subCategories
  };
}
export function selectFilterSubCategory() {
  return {
    type: types.SELECT_FILTER_SUBCATEGORY,
  };
}
export function clearFilterSubCategory() {
  return {
    type: types.CLEAR_FILTER_SUBCATEGORY,
  };
}

//==========================================================
// SUBSUBCATEGORIES
//==========================================================

export function getFilterSubSubCategories(selectedSubCategory) {
  return (dispatch, getState) => {
    const subSubCategories = getState().filter.allCategories.filter((v) => {
      return v.parent === selectedSubCategory.value;
    });
    dispatch(receiveFilterSubSubCategories(subSubCategories));
  };
}
export function receiveFilterSubSubCategories(subSubCategories) {
  return {
    type: types.RECEIVE_FILTER_SUBSUBCATEGORIES,
    subSubCategories: subSubCategories
  };
}

//==========================================================
// RESET FORM
//==========================================================

export function setResetFilterForm(parameters) {
  return {
    type: types.SET_RESET_FILTER_DATA,
    parameters: parameters
  };
}

export function resetFilter() {
  return {
    type: types.RESET_FILTER_DATA
  };
}
