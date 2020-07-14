import React, {Component} from 'React';
import {Provider} from 'react-redux';
import configureStore from './store/configure-store';
import App from './containers/App';

const store = configureStore();

class Root extends Component {

  constructor() {
    super();
  }

  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}
export default Root;