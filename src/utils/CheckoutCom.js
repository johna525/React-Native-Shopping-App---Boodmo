import {ENV} from '../constants/Config';
const HOST = ENV === 'prod' ? 'https://api2.checkout.com/v2' : 'https://sandbox.checkout.com/api2/v2';

export const CANCELED = 'canceled';
export const SESSION_EXPIRED = 'session_expired';
export const SERVER_ERROR = 'server_error';
export const SUCCESS = 'success';

export function chargeWithCard(promise) {
  return new Promise((resolve, reject) => {
    promise.then(
      (response) => {
        resolve(response);
      },
      (error) => {
        reject(error);
      }
    );
  });
}
export function createChargePromise(body, key) {
  return fetch(`${HOST}/charges/js/card`, POST({body, key}));
}

export function checkStatus(response) {
  let json = response.json();
  if (response.status === 200) {
    return json.then((resp) => {
      if (resp['responseCode'] === '10000') {
        return Promise.resolve(resp);
      } else {
        return Promise.reject(resp);
      }
    });
  } else {
    return json.then(Promise.reject.bind(Promise));
  }
}

const GET = (key = null) => {
  return {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': key,
    }
  };
};

const POST = (options = {body: null, key: null}) => {
  const {body, key} = options;
  return {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': key,
    },
    body: JSON.stringify(body)
  };
};
