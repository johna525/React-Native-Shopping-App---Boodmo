import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/index';
import offline from './offline';
import {oauthMiddleWare} from '../actions/oauthMiddleware';
import {metricsMiddleware} from '../utils/metrics';
import devToolsEnhancer from 'remote-redux-devtools';

const createStoreWithMiddleware = applyMiddleware(oauthMiddleWare, thunkMiddleware, metricsMiddleware)(createStore);

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState, devToolsEnhancer());
  // const store = createStoreWithMiddleware(rootReducer, initialState);
  offline(store);

  return store;
}
