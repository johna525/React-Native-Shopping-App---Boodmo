import * as types from '../constants/ActionTypes';

export default function parts(state = {
  openPartNumber: true,
  isFetching: true,
  fetched: false,
  error: false,
  items: [],
  total: '',
  searchParameters: {
    keyword: null,
    sorted_by: null,
    car_maker_id: null,
    model_id: null,
    model_line_id: null,
    brand_id: null,
    family_id: null,
    price_range_min: null,
    price_range_max: null,
    page: 1,
  }
}, action) {
  switch (action.type) {
  case types.OPEN_ORI_PARTNUMBER:
    return {
      ...state,
      openPartNumber: action.openPartNumber
    };
  case types.REQUEST_PARTS:
    return {
      ...state,
      isFetching: true,
      fetched: false,
      error: false,
      searchParameters: action.searchParameters
    };
  case types.RECEIVE_PARTS:
    return {
      ...state,
      isFetching: false,
      fetched: true,
      error: false,
      items: action.items,
      total: action.total,
    };
  case types.RECEIVE_ERROR_PARTS:
    return {
      ...state,
      isFetching: false,
      fetched: false,
      error: true,
    };
  case types.CLEAR_SEARCH_PAGE:
    return {
      ...state,
      items: [],
      total: ''
    };
  default:
    return state;
  }
}
