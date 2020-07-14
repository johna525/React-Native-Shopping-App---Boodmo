import * as types from '../constants/ActionTypes';
import {EMAIL_STEP} from '../constants/Checkout';
import * as _ from 'lodash';

export default function checkout(state = {
  deliveryInfo: {
    pin: '',
    phone: '',
    first_name: '',
    last_name: '',
    address: '',
    city: '',
    state: null,
    country: {
      id: 0,
      name: 'India',
      value: 'INDIA'
    }
  },
  loadedDeliveryInfo: false,
  reviewCart: {},
  localPayment: false,
  crossboardPayment: false,
  availablePaymentMethods: [],
  localPaymentMethod: null,
  crossboardPaymentMethod: null,
  createdOrder: null,
  successOrder: null,
  createOrderError: false,
  successOrderError: false,
  stepEmailDone: false,
  stepDeliveryDone: false,
  stepReviewDone: false,
  stepPaymentDone: false,
  isFetching: false,
  pinIsFetching: false,
  pinError: false,
  pinFetched: false,
  deliveryErrors: [],
  availablePaymentMethodsError: false,
  selectedStep: EMAIL_STEP,
  steps: [
    {
      name: 'EMAIL',
      title: 'ENTER EMAIL',
      icon: 'at',
      done: false,
      disabled: false,
    },
    {
      name: 'DELIVERY',
      title: 'ENTER DELIVERY ADDRESS',
      icon: 'truck',
      done: false,
      disabled: true,
    },
    {
      name: 'REVIEW',
      title: 'REVIEW ORDER',
      icon: 'clipboard-check',
      done: false,
      disabled: true,
    },
    {
      name: 'PAYMENT',
      title: 'PLACE ORDER',
      icon: 'credit-card',
      done: false,
      disabled: true,
    }
  ]
}, action) {
  switch (action.type) {
  case types.CHECKOUT_GO_TO_STEP:
    return {
      ...state,
      selectedStep: action.selectedStep
    };
  case types.CHECKOUT_SET_USER_INFO:
    return {
      ...state,
      stepEmailDone: true,
      stepDeliveryDone: false,
      stepReviewDone: false,
      stepPaymentDone: false,
      localPayment: false,
      crossboardPayment: false,
      availablePaymentMethods: [],
      pinError: false,
      pinFetched: false,
      pinIsFetching: false,
    };
  case types.REQUEST_LOAD_PROFILE:
    return {
      ...state,
      isFetching: true,
    };
  case types.RECEIVE_LOAD_PROFILE:
    return {
      ...state,
      deliveryInfo: action.deliveryInfo,
      loadedDeliveryInfo: true,
      isFetching: false,
    };
  case types.OFFLINE_USER_LOADED:
    return {
      ...state,
      loadedDeliveryInfo: action.loadedDeliveryInfo
    };
  case types.RECEIVE_ERROR_LOAD_PROFILE:
    return {
      ...state,
      isFetching: false,
    };
  case types.CHECKOUT_SET_DELIVERY_INFO:
    return {
      ...state,
      deliveryInfo: action.deliveryInfo,
      pinError: false,
      pinIsFetching: false,
      pinFetched: true,
      stepDeliveryDone: true,
      stepReviewDone: false,
      stepPaymentDone: false,
      localPayment: false,
      crossboardPayment: false,
      availablePaymentMethods: [],
    };
  case types.CHECKOUT_SAVE_DELIVERY_INFO:
    return {
      ...state,
      deliveryInfo: action.deliveryInfo,
    };
  case types.OFFLINE_CHECKOUT_DELIVERY_INFO_LOADED:
    return {
      ...state,
      deliveryInfo: action.deliveryInfo,
      offlineDeliveryInfoLoaded: true
    };
  case types.CHECKOUT_SET_REVIEW_STEP:
    return {
      ...state,
      stepReviewDone: true,
      stepPaymentDone: false,
    };
  case types.CHECKOUT_UPDATE_STEPS:
    return {
      ...state,
      steps: action.steps,
    };
  case types.REQUEST_REVIEW_CART:
    return {
      ...state,
      isFetching: true,
      deliveryErrors: [],
    };
  case types.RECEIVE_REVIEW_CART:
    return {
      ...state,
      reviewCart: action.reviewCart,
      localPayment: action.localPayment,
      crossboardPayment: action.crossboardPayment,
      deliveryErrors: [],
      isFetching: false
    };
  case types.RECEIVE_ERROR_REVIEW_CART:
    return {
      ...state,
      isFetching: false,
      deliveryErrors: action.errors
    };
  case types.CHECKOUT_UPDATE_PAYMENT_METHOD:
    return {
      ...state,
      localPaymentMethod: action.localPaymentMethod,
      crossboardPaymentMethod: action.crossboardPaymentMethod,
      stepPaymentDone: true
    };
  case types.REQUEST_DELIVERY_VALIDATE_PIN:
    return {
      ...state,
      deliveryInfo: action.deliveryInfo,
      pinIsFetching: true,
      stepDeliveryDone: false,
      pinError: false,
      pinFetched: false,
      deliveryErrors: _.omit(state.deliveryErrors, 'pin'),
    };
  case types.RECEIVE_DELIVERY_VALIDATE_PIN:
    return {
      ...state,
      deliveryInfo: action.deliveryInfo,
      pinIsFetching: false,
      stepDeliveryDone: false,
      pinError: false,
      pinFetched: true,
      deliveryErrors: _.omit(state.deliveryErrors, 'pin'),
    };
  case types.RECEIVE_DELIVERY_ERROR_VALIDATE_PIN:
    return {
      ...state,
      pinIsFetching: false,
      pinError: true,
      pinFetched: true,
      stepDeliveryDone: false,
      stepReviewDone: false,
      stepPaymentDone: false,
      deliveryErrors: _.omit(state.deliveryErrors, 'pin'),
    };
  case types.REQUEST_DELIVERY_AVAILABLE_PAYMENT_METHODS:
    return {
      ...state,
      isFetching: true,
      availablePaymentMethods: [],
      availablePaymentMethodsError: false
    };
  case types.RECEIVE_DELIVERY_AVAILABLE_PAYMENT_METHODS:
    return {
      ...state,
      availablePaymentMethods: action.availablePaymentMethods,
      isFetching: false,
      availablePaymentMethodsError: false
    };
  case types.RECEIVE_DELIVERY_ERROR_AVAILABLE_PAYMENT_METHODS:
    return {
      ...state,
      isFetching: false,
      availablePaymentMethods: [],
      availablePaymentMethodsError: true
    };
  case types.REQUEST_CREATE_ORDER:
    return {
      ...state,
      isFetching: true,
      createOrderError: false,
      createdOrder: null,
    };
  case types.RECEIVE_ORDER:
    return {
      ...state,
      isFetching: false,
      createOrderError: false,
      createdOrder: action.createdOrder
    };
  case types.RECEIVE_ERROR_CREATE_ORDER:
    return {
      ...state,
      isFetching: false,
      createOrderError: true,
      createdOrder: null,
    };
  case types.REQUEST_SUCCESS_ORDER:
    return {
      ...state,
      isFetching: true,
      successOrderError: false,
      successOrder: null,
    };
  case types.RECEIVE_SUCCESS_ORDER:
    return {
      ...state,
      isFetching: false,
      successOrderError: false,
      successOrder: action.successOrder
    };
  case types.RECEIVE_ERROR_SUCCESS_ORDER:
    return {
      ...state,
      isFetching: false,
      successOrderError: true,
      successOrder: null,
    };
  case types.REQUEST_CHECK_EMAIL:
  case types.LOG_OUT:
    return {
      ...state,
      deliveryInfo: {
        pin: '',
        phone: '',
        first_name: '',
        last_name: '',
        address: '',
        city: '',
        state: null,
        country: {
          name: 'India',
          value: 'INDIA'
        }
      },
      loadedDeliveryInfo: false,
      reviewCart: {
        packages: [],
        total: 0,
        amount: 0,
        deliveryCharge: 0,
        grandTotal: 0
      },
      localPayment: false,
      crossboardPayment: false,
      availablePaymentMethods: [],
      localPaymentMethod: null,
      crossboardPaymentMethod: null,
      createdOrder: null,
      createOrderError: false,
      successOrder: null,
      successOrderError: false,
      stepEmailDone: false,
      stepDeliveryDone: false,
      stepReviewDone: false,
      stepPaymentDone: false,
      isFetching: false,
      pinIsFetching: false,
      pinError: false,
      pinFetched: false,
      deliveryErrors: [],
      availablePaymentMethodsError: false,
      steps: [
        {
          name: 'EMAIL',
          title: 'ENTER EMAIL',
          icon: 'at',
          done: false,
          disabled: false,
        },
        {
          name: 'DELIVERY',
          title: 'ENTER DELIVERY ADDRESS',
          icon: 'truck',
          done: false,
          disabled: true,
        },
        {
          name: 'REVIEW',
          title: 'REVIEW ORDER',
          icon: 'clipboard-check',
          done: false,
          disabled: true,
        },
        {
          name: 'PAYMENT',
          title: 'PLACE ORDER',
          icon: 'credit-card',
          done: false,
          disabled: true,
        }
      ]
    };
  case types.CHECKOUT_RESET_TO_DELIVERY:
    return {
      ...state,
      availablePaymentMethods: [],
      loadedDeliveryInfo: false,
      reviewCart: {},
      localPayment: false,
      crossboardPayment: false,
      localPaymentMethod: null,
      crossboardPaymentMethod: null,
      createOrderError: false,
      stepEmailDone: false,
      stepDeliveryDone: false,
      stepReviewDone: false,
      stepPaymentDone: false,
      isFetching: false,
      pinIsFetching: false,
      pinError: false,
      pinFetched: false,
      deliveryErrors: [],
      availablePaymentMethodsError: false,
    };
  case types.RESET_LOADED_PROFILE_STATE:
    return {
      ...state,
      loadedDeliveryInfo: false
    };
  default:
    return state;
  }
}
