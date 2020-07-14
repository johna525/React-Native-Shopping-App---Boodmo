import {combineReducers} from 'redux';
import sweetalert from './SweetAlert';
import network from './Network';
import device from './Device';
import vehicles from './Vehicles';
import parts from './Parts';
import filter from './Filter';
import product from './Product';
import cart from './Cart';
import checkout from './Checkout';
import user from './User';
import orders from './Orders';
import payment from './Payment';
import navigator from './Navigator';

const rootReducer = combineReducers({
  sweetalert,
  network,
  device,
  vehicles,
  parts,
  filter,
  product,
  cart,
  checkout,
  user,
  orders,
  payment,
  navigator
});

export default rootReducer;
