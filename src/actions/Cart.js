import * as types from '../constants/ActionTypes';
import {clearCheckout} from './Checkout';
import * as Log from './Log';
import * as Events from '../constants/Events';
import * as _ from 'lodash';
import * as Config from '../constants/Config';
import ApiUtils from '../utils/ApiUtils';
import {logout, receiveCartCUID, receiveCartDraftCUID} from './User';
import {showAlert} from './SweetAlert';
import * as Messages from '../constants/Messages';
import * as BetaOut from './Betaout';

function getProductById(id, products) {
  let productId = typeof id === 'string' ? Number(id) : id;
  let item = products.length ? products[0] : {};

  if (products.length > 1) {
    item = products.filter(item => {
      return item.product.id === productId;
    })[0];
  }
  return item.product;
}

export function addProductToCart(productId) {
  return (dispatch, getState) => {
    if (productId) {
      Log.logEvent(Events.EVENT_CART_ADD);
      let cart = getState().cart.cart;
      let index = getProductIndex(cart, productId);
      let product = {
        productId,
        quantity: 1
      };
      if (index !== -1) {
        product.quantity = cart[index].quantity;
        cart[index] = product;
      } else {
        product.quantity = 1;
        cart.push(product);
      }
      cart = _.sortBy(cart, 'productId');
      dispatch(addToCart(cart));
      dispatch(addProduct(productId.toString(), product.quantity));
    }
  };
}

export function addDraftProductToCart(data, image) {
  return (dispatch) => {
    let product = JSON.parse(JSON.stringify(data.product));
    let updatedProduct = {...product, part: {...product.part, image}};
    dispatch({
      type: types.ADD_DRAFT_PRODUCT_TO_CART,
      data: {...data, product: updatedProduct}
    });
  };
}

function getProductIndex(cart, productId) {
  let index = -1;

  cart.map(function (value, key) {
    if (productId === value.productId) {
      index = key;
    }
  });
  return index;
}

function addToCart(cart) {
  return {
    type: types.ADD_TO_CART,
    cart
  };
}

export function updateQuantity(index, quantity) {
  return (dispatch, getState) => {
    Log.logEvent(Events.EVENT_CART_CHANGE_QUANTITY);
    let cart = JSON.parse(JSON.stringify(getState().cart.cart));
    let products = JSON.parse(JSON.stringify(getState().cart.products));
    if (cart[index]) {cart[index].quantity = quantity;}
    products[index].product.requested_qty = quantity;
    dispatch(updateProductQuantity(cart, products));
    dispatch(editProduct(products[index].product.id, quantity));
  };
}

function updateProductQuantity(cart, products) {
  return {
    type: types.UPDATE_QUANTITY_CART,
    cart,
    products
  };
}

export function deleteProductFromCart(index) {
  return (dispatch, getState) => {
    Log.logEvent(Events.EVENT_CART_REMOVE);
    let cart = JSON.parse(JSON.stringify(getState().cart.cart));
    // let old_cart = JSON.parse(JSON.stringify(getState().cart));
    let products = JSON.parse(JSON.stringify(getState().cart.products));
    const productId = products[index] && products[index].product && products[index].product.id && products[index].product.id.toString() || null;
    const deletedItem = products.splice(index, 1)[0];

    cart.splice(index, 1);
    dispatch(deleteFromCart(cart, products));
    dispatch(deleteProduct(productId, deletedItem.product));
  };
}

function deleteFromCart(cart, products) {
  return {
    type: types.DELETE_FROM_CART,
    cart,
    products
  };
}

export function getCartInfo(products) {
  return (dispatch) => {
    dispatch(clearCheckout());
    const count = products.length;
    let total = 0, amount = 0;
    let cart = [];

    if (count) {
      products.map(function (product) {
        total += product.product.requested_qty;
        amount += product.product.price.amount * product.product.requested_qty;
        cart.push({
          productId: product.product.id,
          quantity: product.product.requested_qty
        });
      });
    }
    dispatch(updateCartInfo(cart, count, total, amount));
  };
}

function updateCartInfo(cart, count, total, amount) {
  return {
    type: types.UPDATE_CART_INFO,
    cart,
    count,
    total,
    amount
  };
}

export function clearCart() {
  return {
    type: types.CLEAR_CART
  };
}

export function clearCartFromLocal(localProducts, currentProducts) {
  return (dispatch) => {
    let cart = _.remove(currentProducts, function(product) {
      return !_.includes(localProducts, product.productId.toString());
    });
    dispatch(removeLocalFromCart(cart));
  };
}

function removeLocalFromCart(cart) {
  return {
    type: types.REMOVE_LOCAL_PRODUCTS_FROM_CART,
    cart
  };
}

function addProduct(id, qty) {
  return (dispatch, getState) => {
    const {user} = getState();
    let currency = user.currentCurrency,
      currencyString = '';
    if (currency) {
      currencyString = `?currency=${currency.value}`;
    }
    let url = `${Config.MC_HOST}/checkout/cart/add${currencyString}`;
    let auth = `${user.token_type} ${user.access_token}`;
    let cartId = user.c_uid || (user.draft_c_uid && user.draft_c_uid.id);
    let body = {
      checkout: {
        step: 'shopping_cart',
        c_uid: cartId,
        add_item: {
          id,
          qty
        }
      }
    };
    ApiUtils.timeoutPromise(fetch(url, Config.POST({body, auth}))
      .then(ApiUtils.checkStatus)
      .then(responseJson => {
        const products = _.values(responseJson.cart);
        // const product = getProductById(id, products);

        dispatch(getCartInfo(products));
        dispatch(receiveCartProducts(products));

        // dispatch(BetaOut.addProduct(product, products, user));
        dispatch(BetaOut.fullCartUpdate(products, user));

        if (user.access_token) {
          dispatch(receiveCartCUID(responseJson.c_uid || null));
        } else {
          dispatch(receiveCartDraftCUID(responseJson.c_uid || null));
        }
      }).catch((error) => {
        if (error.status == 401) {
          dispatch(logout());
        }
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`, body);
      })
      , 20000);
  };
}

function deleteProduct(id, product) {
  return (dispatch, getState) => {
    const {user} = getState();
    let currency = user.currentCurrency,
      currencyString = '';
    if (currency) {
      currencyString = `?currency=${currency.value}`;
    }
    let url = `${Config.MC_HOST}/checkout/cart/delete${currencyString}`;
    let auth = `${user.token_type} ${user.access_token}`;
    let cartId = user.c_uid || (user.draft_c_uid && user.draft_c_uid.id);
    let body = {
      checkout: {
        step: 'shopping_cart',
        c_uid: cartId,
        remove_item: id
      }
    };
    ApiUtils.timeoutPromise(fetch(url, Config.POST({body, auth}))
      .then(ApiUtils.checkStatus)
      .then(responseJson => {
        const products = _.values(responseJson.cart);

        dispatch(getCartInfo(products));
        dispatch(receiveCartProducts(products));

        if (!!products.length) {
          dispatch(BetaOut.removeProduct(product, products, user));
        } else {
          dispatch(BetaOut.clearCart(products, user));
        }

        if (user.access_token) {
          dispatch(receiveCartCUID(responseJson.c_uid || null));
        } else {
          dispatch(receiveCartDraftCUID(responseJson.c_uid || null));
        }
      }).catch((error) => {
        if (error.status == 401) {
          dispatch(logout());
        }
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`, body);
      })
      , 20000);
  };
}

function editProduct(id, qty) {
  return (dispatch, getState) => {
    const {user} = getState();
    let currency = user.currentCurrency,
      currencyString = '';
    if (currency) {
      currencyString = `?currency=${currency.value}`;
    }
    let url = `${Config.MC_HOST}/checkout/cart/edit${currencyString}`;
    let auth = `${user.token_type} ${user.access_token}`;
    let cartId = user.c_uid || (user.draft_c_uid && user.draft_c_uid.id);
    let body = {
      checkout: {
        step: 'shopping_cart',
        c_uid: cartId,
        edit_item: {
          id,
          qty
        }
      }
    };
    ApiUtils.timeoutPromise(fetch(url, Config.POST({body, auth}))
      .then(ApiUtils.checkStatus)
      .then(responseJson => {
        const products = _.values(responseJson.cart);
        // const product = getProductById(id, products);

        dispatch(getCartInfo(products));
        dispatch(receiveCartProducts(products));

        // dispatch(BetaOut.editProduct(product, products, user));
        dispatch(BetaOut.fullCartUpdate(products, user));

        if (user.access_token) {
          dispatch(receiveCartCUID(responseJson.c_uid || null));
        } else {
          dispatch(receiveCartDraftCUID(responseJson.c_uid || null));
        }
      }).catch((error) => {
        if (error.status == 401) {
          dispatch(logout());
        }
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`, body);
      })
      , 20000);
  };
}

export function getCartProducts() {
  return (dispatch, getState) => {
    const {user} = getState();
    let currency = user.currentCurrency,
      currencyString = '';
    if (currency) {
      currencyString = `?currency=${currency.value}`;
    }
    let url = `${Config.MC_HOST}/checkout/cart${currencyString}`;
    let auth = `${user.token_type} ${user.access_token}`;
    let cartId = user.c_uid || (user.draft_c_uid && user.draft_c_uid.id);
    let body = {
      checkout: {
        step: 'shopping_cart',
        c_uid: cartId
      }
    };

    ApiUtils.timeoutPromise(fetch(url, Config.POST({body, auth}))
      .then(ApiUtils.checkStatus)
      .then(responseJson => {
        let products = _.values(responseJson.cart);

        dispatch(getCartInfo(products));
        dispatch(receiveCartProducts(products));
        if (user.access_token) {
          dispatch(receiveCartCUID(responseJson.c_uid || null));
        } else {
          dispatch(receiveCartDraftCUID(responseJson.c_uid || null));
        }
      }).catch((error) => {
        if (error.status == 401) {
          dispatch(logout());
        }
        dispatch(showAlert('Error', Messages.requestError));
        Log.logCrash(`${url} - ${error.message}`, body);
      })
      , 20000);
  };
}

function requestCartProducts() {
  return {
    type: types.REQUEST_CART_PRODUCTS
  };
}

function receiveCartProducts(products) {
  return {
    type: types.RECEIVE_CART_PRODUCTS,
    products,
  };
}

function receiveErrorCartProducts() {
  return {
    type: types.RECEIVE_ERROR_CART_PRODUCTS
  };
}
