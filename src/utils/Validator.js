export function email(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export function name(name) {
  const re = /^[a-zA-Z ]*$/;
  return re.test(name);
}

export function number(number) {
  const re = /^\d+$/;
  return re.test(number);
}

export function specNumber(number) {
  const re = /^[\d\-]+$/;
  return re.test(number);
}

export function checkPartNumber(number) {
  const re = /^[0-9A-Za-z\s\-]+$/;
  return re.test(number);
}

String.prototype.isEmpty = function() {
  return (this == null || this.length === 0 || !this.trim());
};

export function getParameterByName(name, url) {
  name = name.replace(/[\[\]]/g, '\\$&');
  let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  results = regex.exec(url);
  if (!results) {return null;}
  if (!results[2]) {return '';}
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
