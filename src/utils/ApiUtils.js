import messages from '../constants/Messages';
import * as _ from 'lodash';

const ApiUtils = {

  timeoutPromise: function (promise, ms = 30000) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(messages.timeOut));
      }, ms);
      promise.then(
        (response) => {
          clearTimeout(timeoutId);
          resolve(response);
        },
        (error) => {
          clearTimeout(timeoutId);
          reject(error);
        }
      );
    });
  },

  checkStatus: function (response) {
    let json = response.json(); // there's always a body
    if (response.status >= 200 && response.status < 300) {
      return json;
    }
    return json.then(err => {
      throw err;
    });
  },

  parseSuccessResponse: function (responseJson, needParsing = true) {
    switch (responseJson.success) {
    case true:
    case null:
      return responseJson;
      break;
    case false:
      let errors = [],
        errorMessage = null;
      if (needParsing) {
        _.each(responseJson.errors, (errorField) => {
          _.each(errorField, (error) => {
            errors.push(error);
          });
        });
        errorMessage = errors.join('\n');
      } else {
        errors = responseJson.errors;
      }
      let error = new Error(errorMessage);
      error.errors = errors;
      throw error;
      break;
    }
  },

  parseError: function (errorJson) {
    let errorMessage = errorJson.detail || (errorJson.statusText || null);
    let error = new Error(errorMessage);
    error.status = errorJson.status;
    error.errors = errorJson.errors || [];
    throw error;
  },

  /**
     * Deprecated
     * @param response
     * @returns {*|Promise}
     */
  parseJSON: function (response) {
    return response.json();
  }
};
export {ApiUtils as default};
