/**
 * Created by garando on 6/28/17.
 */
export function sortByPrice (a, b) {
  if (a.price === null) {
    return 1;
  }
  if (b.price === null) {
    return -1;
  }
  return a.price - b.price;
}
export function cheaper (a, b) {
  if (a.price === null) {
    return b;
  }
  if (b.price === null) {
    return a;
  }
  return parseFloat(a.price.replace(/,/g, '')) < parseFloat(b.price.replace(/,/g, '')) ? a : b;
}

export function faster (a, b) {
  if (a.delivery.days === null) {
    return b;
  }
  if (b.delivery.days === null) {
    return a;
  }
  return a.delivery.days < b.delivery.days ? a : b;
}
