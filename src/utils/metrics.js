import {GoogleTagManager} from 'react-native-google-analytics-bridge';
import DeviceInfo from 'react-native-device-info';

import * as types from '../constants/ActionTypes';

let metricsData = {
  deviceToken: null,
  clientId: DeviceInfo.getUniqueID().toString(),
  userAuth: '0',
  authType: 'email',
  hitId: DeviceInfo.getUniqueID().toString() + '_' + Date.now(),
  sectionName: '',
  products: []
};

export const metricsMiddleware = store => next => action => {
  const state = store.getState();

  switch (action.type) {
  case types.OFFLINE_USER_LOADED:
    if (action.signedIn) {
      metricsData = {
        ...metricsData,
        userId: action.user_id ? action.user_id.toString() : null
      };
    }
    metricsData = {
      ...metricsData,
      userAuth: action.signedIn ? '1' : '0',
      authType: action.auth_type
    };
    try {
      GoogleTagManager.pushDataLayerEvent({
        event: 'openScreen',
        deviceToken: metricsData.deviceToken,
        clientId: metricsData.clientId,
        userAuth: metricsData.userAuth,
        authType: metricsData.authType
      });
    } catch (e) {}
    break;
  case types.SET_MODIF_USER_INFO:
    try {
      GoogleTagManager.pushDataLayerEvent({
        event: 'openScreen',
        ...action.data
      });
    } catch (e) {}
    break;
  case types.SET_DEVICE_TOKEN:
    metricsData = {
      ...metricsData,
      deviceToken: action.token && action.token.toString() || null
    };
    break;
  case types.RECEIVE_PARTS:
    let impressions = [];

    if (Array.isArray(action.items)) {
      action.items.map((i, pos) => {
        impressions.push({
          id: i.id && i.id.toString(),
          name: i.name,
          category: i.family && i.family.name || null,
          dimension16: i.family && i.family.id && i.family.id.toString() || null,
          brand: i.brand && i.brand.name || null,
          price: i.price && i.price.amount && (parseFloat(i.price.amount) / 100).toString() || null,
          metric1: i.price && i.price.amount && (parseFloat(i.price.amount) / 100).toString() || null,
          position: pos + 1,
          list: 'SearchResults'
        });
      });
    }
    try {
      GoogleTagManager.pushDataLayerEvent({
        event: 'openScreen',
        hitId: metricsData.hitId,
        screenName: 'SearchResults',
        pageType: 'SearchResults',
        productsQuantityAvailable: action.total && action.total.toString(),
        productsQuantityTotal: action.total && action.total.toString(),
        sectionName: null,
        checkoutStepName: null,
        transactionPaymentType: null,
        transactionShippingMethod: null,
        ecommerce: {
          currencyCode: state.user.currentCurrency.name,
          impressions
        }
      });
    } catch (e) {}
    break;
  case types.RECEIVE_PRODUCT_PARTINFO:
    try {
      GoogleTagManager.pushDataLayerEvent({
        event: 'openScreen',
        hitId: metricsData.hitId,
        screenName: 'ProductPage',
        pageType: 'ProductPage',
        productsQuantityAvailable: null,
        productsQuantityTotal: null,
        sectionName: null,
        checkoutStepName: null,
        transactionPaymentType: null,
        transactionShippingMethod: null,
        ecommerce: {
          currencyCode: state.user.currentCurrency.name,
          detail: {
            actionField: {
              list: 'ProductPage'
            },
            products: [{
              id: action.partInfo && action.partInfo.id && action.partInfo.id.toString(),
              name: action.partInfo.name,
              category: action.partInfo.family.name,
              dimension16: action.partInfo && action.partInfo.family && action.partInfo.family.id && action.partInfo.family.id.toString(),
              brand: action.partInfo.brand.name,
              variant: action.partInfo.brand.oem,
              price: action.partInfo.price && action.partInfo.price.amount && (parseFloat(action.partInfo.price.amount) / 100).toString() || null,
              metric1: action.partInfo.price && action.partInfo.price.amount && (parseFloat(action.partInfo.price.amount) / 100).toString() || null
            }]
          }
        }
      });
    } catch (e) {}
    break;
  case types.CHANGE_SECTION_NAME_METRICS:
    metricsData = {
      ...metricsData,
      sectionName: action.sectionName
    };

    try {
      GoogleTagManager.pushDataLayerEvent({
        event: 'openScreen',
        hitId: metricsData.hitId,
        screenName: 'Main',
        pageType: 'Main',
        sectionName: metricsData.sectionName,
        productsQuantityAvailable: null,
        productsQuantityTotal: null,
        checkoutStepName: null,
        transactionPaymentType: null,
        transactionShippingMethod: null,
        ecommerce: null
      });
    } catch (e) {}
    break;
  case types.CHECKOUT_GO_TO_STEP:
    if (state.cart.products && state.cart.products.length > 0) {
      let products = [];

      if (Array.isArray(state.cart.products)) {
        state.cart.products.map((p, index) => {
          products.push({
            id: p.product && p.product.id && p.product.id.toString(),
            name: p.product.part.name,
            category: p.product.part.family_name,
            dimension16: p.product && p.product.part && p.product.part.family_id && p.product.part.family_id.toString(),
            dimension11: p.product && p.product.seller && p.product.seller.dispatch_days.toString(),
            brand: p.product.part.brand_name,
            variant: p.product.part.brand_is_oem,
            price: p.product.price && p.product.price.amount && (parseFloat(p.product.price.amount) / 100).toString() || null,
            metric1: p.product.price && p.product.price.amount && (parseFloat(p.product.price.amount) / 100).toString() || null,
            quantity: state.cart.cart && state.cart.cart[index] && state.cart.cart[index].quantity || null
          });
        });
      }

      metricsData = {
        ...metricsData,
        products
      };

      try {
        GoogleTagManager.pushDataLayerEvent({
          event: 'openScreen',
          hitId: metricsData.hitId,
          screenName: 'Shopping cart',
          pageType: 'Checkout',
          checkoutStepName: state.checkout.steps && state.checkout.steps[action.selectedStep] && state.checkout.steps[action.selectedStep].name,
          productsQuantityAvailable: null,
          productsQuantityTotal: null,
          sectionName: null,
          transactionPaymentType: null,
          transactionShippingMethod: null,
          ecommerce: {
            currencyCode: state.user.currentCurrency.name,
            checkout: {
              actionField: {
                step: action.selectedStep,
                option: state.checkout.localPayment ? state.checkout.localPaymentMethod : state.checkout.crossboardPaymentMethod
              },
              products: metricsData.products
            }
          }
        });
      } catch (e) {}
    }
    break;
  case types.RECEIVE_SUCCESS_ORDER:
    try {
      GoogleTagManager.pushDataLayerEvent({
        event: 'openScreen',
        hitId: metricsData.hitId,
        screenName: 'ThankYouPage',
        pageType: 'ThankYouPage',
        transactionPaymentType: state.checkout.localPayment ? state.checkout.localPaymentMethod : state.checkout.crossboardPaymentMethod,
        transactionShippingMethod: 'delivery',
        checkoutStepName: null,
        productsQuantityAvailable: null,
        productsQuantityTotal: null,
        sectionName: null,
        ecommerce: {
          currencyCode: state.user.currentCurrency.name,
          purchase: {
            actionField: {
              id: state.checkout.createdOrder && state.checkout.createdOrder.order_id && state.checkout.createdOrder.order_id.toString() || null,
              revenue: action.successOrder && action.successOrder.sub_total && action.successOrder.sub_total.toString() || null,
              shipping: action.successOrder && action.successOrder.delivery_total && action.successOrder.delivery_total.amount && action.successOrder.delivery_total.amount.toString() || null,
              affiliation: 'mobile'
            },
            products: metricsData.products
          }
        }
      });
    } catch (e) {}
    break;
  case types.CHECKOUT_UPDATE_PAYMENT_METHOD:
    metricsCheckoutPaymentMethodSelect({
      eventContext: action.crossboardPaymentMethod,
      ecommerce: {
        currencyCode: state.user.currentCurrency.name,
        checkout_option: {
          actionField: {
            step: 3,
            option: action.crossboardPaymentMethod
          }
        }
      }
    });
    break;
  }
  return next(action);
};

export function metricsScreenHandler(screen_id) {
  switch (screen_id) {
  case 'FilterPage':
    screenEventCreator({
      event: 'openScreen',
      hitId: metricsData.hitId,
      screenName: 'FilterResults',
      pageType: 'FilterResults'
    });
    break;
  case 'OrderInfoPage':
    screenEventCreator({
      event: 'openScreen',
      hitId: metricsData.hitId,
      screenName: 'Applicability',
      pageType: 'InfoPage'
    });
    break;
  case 'AuthPage':
    screenEventCreator({
      event: 'openScreen',
      hitId: metricsData.hitId,
      screenName: 'Authorization',
      pageType: 'authorisation'
    });
    break;
  case 'Menu':
    screenEventCreator({
      event: 'openScreen',
      hitId: metricsData.hitId,
      screenName: 'Menu',
      pageType: 'Menu'
    });
    break;
  case 'OrdersPage':
    screenEventCreator({
      event: 'openScreen',
      hitId: metricsData.hitId,
      screenName: 'MyOrders',
      pageType: 'Profile'
    });
    break;
  }
}

function screenEventCreator(data) {
  try {
    GoogleTagManager.pushDataLayerEvent({
      productsQuantityAvailable: null,
      productsQuantityTotal: null,
      checkoutStepName: null,
      transactionPaymentType: null,
      transactionShippingMethod: null,
      ecommerce: null,
      sectionName: null,
      ...data
    });
  } catch (e) {}
}

function eventCreator(data) {
  let eventContent = data.eventContent || null;
  let eventContext = data.eventContext || null;
  let eventProductId = data.eventProductId || null;
  let eventCategoryId = data.eventCategoryId || null;
  let ecommerce = data.ecommerce || null;
  try {
    GoogleTagManager.pushDataLayerEvent({
      event: 'OWOX',
      hitId: metricsData.hitId,
      ...data,
      eventContent,
      eventContext,
      eventProductId,
      eventCategoryId,
      ecommerce
    });
  } catch (e) {}
}

export function metricsMainSectionsSelect(content) {
  eventCreator({
    eventCategory: 'Interactions',
    eventAction: 'click',
    eventLabel: 'section',
    eventContent: content
  });
}

export function metricsMainSearch(context) {
  eventCreator({
    eventCategory: 'Interactions',
    eventAction: 'click',
    eventLabel: 'searchParts',
    eventContext: context
  });
}

export function metricsSearchResProductClick(product) {
  eventCreator({
    eventCategory: 'Interactions',
    eventAction: 'open',
    eventLabel: 'productPage',
    ...product
  });
}

export function metricsSearchResFilterClick() {
  eventCreator({
    eventCategory: 'Interactions',
    eventAction: 'open',
    eventLabel: 'filterScreen'
  });
}

export function metricsFilterOptionClick(content, context) {
  eventCreator({
    eventCategory: 'Interactions',
    eventAction: 'click',
    eventLabel: 'filterElement',
    eventContent: content,
    eventContext: context
  });
}

export function metricsFilterButtonsClick(applyOpt) {
  eventCreator({
    eventCategory: 'Interactions',
    eventAction: 'click',
    eventLabel:  applyOpt ? 'applyFilters' : 'resetFilters'
  });
}

export function metricsProductPageAddToCartClick(product) {
  eventCreator({
    eventCategory: 'Conversions',
    eventAction: 'add',
    eventLabel:  'cart'
  });
}

export function metricsProductPageApplicabilityClick(eventProductId, eventCategoryId) {
  eventCreator({
    eventCategory: 'Conversions',
    eventAction: 'add',
    eventLabel:  'cart',
    eventProductId,
    eventCategoryId
  });
}

export function metricsCartIconClick() {
  eventCreator({
    eventCategory: 'Interactions',
    eventAction: 'open',
    eventLabel:  'shoppingCart'
  });
}

export function metricsMenuIconClick() {
  eventCreator({
    eventCategory: 'Interactions',
    eventAction: 'click',
    eventLabel:  'menu'
  });
}

export function metricsCheckoutProceedClick() {
  eventCreator({
    eventCategory: 'Interactions',
    eventAction: 'click',
    eventLabel:  'proceedToCheckout'
  });
}

export function metricsCheckoutRemoveClick(product) {
  eventCreator({
    eventCategory: 'Interactions',
    eventAction: 'remove',
    eventLabel: 'cart',
    ...product
  });
}

export function metricsCheckoutChangeQtyClick(product) {
  eventCreator({
    eventCategory: 'Interactions',
    eventLabel: 'cart',
    ...product
  });
}

export function metricsCheckoutContinueClick() {
  eventCreator({
    eventCategory: 'Interactions',
    eventAction: 'click',
    eventLabel:  'continue'
  });
}

export function metricsCheckoutContinueStepClick(data) {
  eventCreator({
    eventCategory: 'Interactions',
    eventAction: 'click',
    eventLabel:  'goAhead',
    ...data
  });
}

export function metricsCheckoutApplyContinueClick(errCode) {
  eventCreator({
    eventCategory: 'Conversions',
    eventAction: 'click',
    eventLabel:  'makeOrder',
    eventContext: errCode || null
  });
}

function metricsCheckoutPaymentMethodSelect(data) {
  eventCreator({
    eventCategory: 'Interactions',
    eventAction: 'switch',
    eventLabel:  'paymentMethod',
    ...data
  });
}

export function metricsAuthLoginClick(eventContext) {
  eventCreator({
    eventCategory: 'Interactions',
    eventAction: 'click',
    eventLabel:  'signin',
    eventContext
  });
}

export function metricsAuthForgotPassClick() {
  eventCreator({
    eventCategory: 'Interactions',
    eventAction: 'click',
    eventLabel:  'forgotPasword'
  });
}

export function metricsAuthRecoverClick() {
  eventCreator({
    eventCategory: 'Interactions',
    eventAction: 'click',
    eventLabel:  'recoverPassword'
  });
}

export function metricsAuthRegistrationClick(eventContext) {
  eventCreator({
    eventCategory: 'Conversions',
    eventAction: 'click',
    eventLabel:  'signup',
    eventContext
  });
}
