import * as Config from '../constants/Config';

export const getProductInfo = (item) => {
  return {
    brand: item.product.part['brand_name'],
    id: item.product.part.id.toString(),
    sku: item.product.part.number.toString(),
    name: item.product.part.name,
    imageUrl: `${Config.IMAGE_FOLDER}${item.product.part.image}`,
    url: `${Config.BOODMO_URL}catalog/part-${item.product.part.slug}-${item.product.part.id}/`,
    price: parseFloat((parseInt(item.product['base_price'].amount, 10) / 100).toFixed(2)),
    currency: item.product['base_price'].currency,
    groupID: item.product.part['family_id'].toString(),
    groupName: item.product.part['family_name'],
    quantity: item.product['requested_qty']
  };
};

export const getProductInfoWithoutPrice = (item) => {
  let image;

  if (item.attributes['main_image']) {
    image = `${item.attributes['main_image']}`;
  } else if (item && item.family && item.family['image']) {
    image = `${item.family['image']}`;
  } else {
    image = null;
  }

  return {
    brand: item.brand.name,
    id: item.id.toString(),
    sku: item.number.toString(),
    name: item.name,
    imageUrl: image ? `${Config.IMAGE_FOLDER}${image}` : '',
    url: `${Config.BOODMO_URL}catalog/part-${item.slug}-${item.id}/`,
    price: 0.01,
    currency: item.currency,
    groupID: item.family.id.toString(),
    groupName: item.family.name,
    quantity: 1
  };
};

export const getProductsRequestBodyPart = (products) => {
  return products.map(item => {
    return getProductInfo(item);
  });
};

export const getProductRequestBody = (product, products, user) => {
  return {
    productId: product.part.id.toString(),
    productPrice: parseFloat((parseInt(product['base_price'].amount, 10) / 100).toFixed(2)),
    productImageURL: `${Config.IMAGE_FOLDER}${product.part.image}`,
    productName: product.part.name,
    productURL: `${Config.BOODMO_URL}catalog/part-${product.part.slug}-${product.part.id}/`,
    productQuantity: product['requested_qty'],
    productBrand: product.part['brand_name'],
    productGroupID: `${product.part['family_id']}`,
    productGroupName: product.part['family_name'],
    cartTotal: parseFloat((getBaseSubTotal(products) / 100).toFixed(2)),
    cartRevenue: parseFloat((getBaseSubTotal(products) / 100).toFixed(2)),
    cartCurrency: user.currentCurrency.value
  };
};

export const getFullCartUpdateBody = (products, user) => {
  return {
    products: getProductsRequestBodyPart(products),
    cart: getCartInfoRequestBodyPart(user, products),
  };
};

export const getCartInfoRequestBodyPart = (user, products) => {
  return {
    total: !!products.length ? parseFloat((getBaseSubTotal(products) / 100).toFixed(2)) : 0,
    revenue: !!products.length ? parseFloat((getBaseSubTotal(products) / 100).toFixed(2)) : 0,
    currency: user.currentCurrency.value,
  };
};

export const getIdentifiersRequestBodyPart = (user) => {
  return {
    customer_id: user.user_id || '',
    email: user.email || '',
    phone: user.phone || ''
  };
};

export const getBaseSubTotal = products => {
  return products.reduce((prev, current) => {
    const {base_price: {amount}, requested_qty} = current.product;
    return prev + (amount * requested_qty);
  }, 0);
};
