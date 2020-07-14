import * as _ from 'lodash';

const currencies = require('./../constants/currencies.json');

String.prototype.outputUnicode = function () {
  if (!this.includes('U+')) {
    throw new Error('Unicode has wrong format');
  }

  return String.fromCharCode(this.replace('U+', '0x'));
};
String.prototype.deCamelCase = function () {
  let sep = ' ';

  sep = typeof sep === 'undefined' ? '_' : sep;

  return this
    .replace(/([a-z\d])([A-Z])/g, '$1' + sep + '$2')
    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + sep + '$2')
    .toLowerCase();
};
String.prototype.capitalize = function () {
  return this.replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase();
  });
};
String.prototype.formatStatus = function () {
  let status = this.replace('_', ' ');

  return status.charAt(0).toUpperCase() + status.slice(1);
};

export function cartsEqual(cart1, cart2) {
  if (cart1.length !== cart2.length) {
    return false;
  }

  for (let index = 0; index < cart1.length; index++) {
    if (cart1[index].productId != cart2[index].productId) {
      return false;
    }
    if (cart1[index].quantity != cart2[index].quantity) {
      return false;
    }

  }

  return true;
}

String.prototype.formatPrice = formatPrice;
Number.prototype.formatPrice = formatPrice;

function formatPrice(locale) {
  let amount = +this;

  amount = (amount / 100).toFixed(2);
  switch (locale) {
  case 'INR':
    amount = inrFormat(amount);
    break;
  default:
    amount = usdFormat(amount);
  }

  return amount;
}

function usdFormat(val) {
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function inrFormat(val) {
  let x = val;
  let afterPoint = '';

  x = x.toString();
  if (x.indexOf('.') > 0) {
    afterPoint = x.substring(x.indexOf('.'), x.length);
  }
  x = Math.floor(x);
  x = x.toString();
  let lastThree = x.substring(x.length - 3);
  const otherNumbers = x.substring(0, x.length - 3);
  if (otherNumbers != '') {
    lastThree = ',' + lastThree;
  }

  return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree + afterPoint;
}

String.prototype.outputCurrency = function () {
  const currency = getCurrency(this.toString());

  return currency.unicode.outputUnicode();
};

export function getCurrency(currencyCode) {
  return currencies.find((currency) => currency.value === currencyCode);
}

export function diffInDays(date1, date2) {
  let timeDiff = Math.abs(date1 - date2);

  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

export function getField (obj, field) {
  let result = [];

  (function iterator (localObj = obj) {
    for (let property in localObj) {
      if (localObj.hasOwnProperty(property)) {
        if (property === field) {
          result.push(localObj[property]);
        } else if (typeof localObj[property] === 'object') {
          return iterator(localObj[property]);
        }
      } else {
        return null;
      }
    }
  }());

  return result.length === 0 ? null : result.length === 1 ? result[0] : result;
}
