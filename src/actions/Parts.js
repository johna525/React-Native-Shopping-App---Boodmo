import * as types from '../constants/ActionTypes';
import ApiUtils from '../utils/ApiUtils';
import * as Config from '../constants/Config';
import * as Messages from '../constants/Messages';
import * as Log from './Log';
import {showAlert} from './SweetAlert';
import {receiveFilterBrands, receiveFilterFamily, receiveFilterCategories} from './Filter';
import * as _ from 'lodash';

export function openOriPartNumber(access) {
  return {
    type: types.OPEN_ORI_PARTNUMBER,
    openPartNumber: access
  };
}


export function getParts(searchParameters) {
  return (dispatch, getState) => {
    const oldSearchParameters = getState().parts.searchParameters;
    if (shouldFetchParts(searchParameters, oldSearchParameters)) {
      return dispatch(fetchParts(searchParameters));
    }
  };
}

function shouldFetchParts(searchParameters, oldSearchParameters) {
  return searchParameters !== oldSearchParameters;
}

function fetchParts(searchParameters) {
  return (dispatch, getState) => {
    dispatch(requestParts(searchParameters));
    if (searchParameters.page === 1) {dispatch(clearSearchPage());}
    if (!searchParameters) {return null;}
    let searchArray = [];

    if (searchParameters.sorted_by == null) {
      searchArray.push(
        `sorted_by=${encodeURIComponent(Config.DEFAULT_SORTED_BY.value)}`
      );
    }
    if (searchParameters.keyword) {
      searchParameters.sorted_by = null;
    }
    let currency = getState().user.currentCurrency;
    if (currency) {
      searchParameters.currency = currency.value;
    }
    [
      'keyword',
      'after_ori',
      'car_maker_id',
      'year_value',
      'model_line_id',
      'model_id',
      'modification_id',
      'sorted_by',
      'brand_id',
      'family_id',
      'category_id',
      'price_range_min',
      'price_range_max',
      'page',
      'currency',
    ].forEach((v) => {
      if (searchParameters[v]) {
        searchArray.push(
          `${v}=${encodeURIComponent(searchParameters[v])}`
        );
      }
    });

    let searchQuery = searchArray.join('&');

    if (!searchQuery) {return null;}

    let url = `${Config.MC_HOST}/search?${searchQuery}`;
    ApiUtils.timeoutPromise(fetch(url, Config.GET)
      .then(ApiUtils.checkStatus)
      .then(responseJson => {
        let localItems = _.map(responseJson.items, (item) => {
          item.image = item.attributes['main_image']
            ? item.attributes['main_image']
            : (item.family.image ? item.family.image : null);
          return item;
        });
        const items = _.uniqBy(getState().parts.items.concat(localItems), 'id');
        const total = responseJson.total;
        let brands, family, categories, allCategories = [];
        if (responseJson.aggs && responseJson.aggs.brand && responseJson.aggs.brand.options.length > 0) {
          brands = responseJson.aggs.brand.options.map((v) => {
            return {
              value: v.value,
              name: v.label,
            };
          });
        } else {
          brands = getState().filter.brands;
        }
        dispatch(receiveFilterBrands(brands));
        if (responseJson.aggs && responseJson.aggs.family && responseJson.aggs.family.options.length > 0) {
          family = responseJson.aggs.family.options.filter((v) => {
            return v.label !== 'UNKNOWN';
          }).map((v) => {
            return {
              value: v.value,
              name: v.label,
            };
          });
          family.sort(function (a, b) {
            const textA = a.name.toUpperCase();
            const textB = b.name.toUpperCase();

            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
          });
        } else {
          family = getState().filter.family;
        }
        dispatch(receiveFilterFamily(family));
        if (responseJson.aggs && responseJson.aggs.categories && Object.keys(responseJson.aggs.categories.items).length > 0) {
          allCategories = Object.values(responseJson.aggs.categories.items)
            .map((v) => {
              let path = v.path.split('.').map((value) => {
                return parseInt(value);
              });
              path.pop();
              let parent = path.length ? path[path.length - 1] : null;
              return {
                value: v.id,
                name: v.name,
                parent: parent
              };
            });
          categories = allCategories.filter((value) => {
            return value.parent == null;
          });
        } else {
          allCategories = getState().filter.allCategories;
          categories = getState().filter.categories;
        }
        dispatch(receiveFilterCategories(allCategories, categories));
        dispatch(receiveParts(items, total));
      })
      .catch((error) => {
        dispatch(receiveErrorParts());
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`);
      })
      , 25000)
      .catch((error) => {
        dispatch(receiveErrorParts());
        dispatch(showAlert('Error', error.message));
        Log.logCrash(`${url} - ${error.message}`);
      });
  };
}

function requestParts(searchParameters) {
  return {
    type: types.REQUEST_PARTS,
    searchParameters: searchParameters
  };
}

function receiveParts(items, total) {
  return {
    type: types.RECEIVE_PARTS,
    items: items,
    total: total
  };
}

function receiveErrorParts() {
  return {
    type: types.RECEIVE_ERROR_PARTS
  };
}

function clearSearchPage() {
  return {
    type: types.CLEAR_SEARCH_PAGE
  };
}
