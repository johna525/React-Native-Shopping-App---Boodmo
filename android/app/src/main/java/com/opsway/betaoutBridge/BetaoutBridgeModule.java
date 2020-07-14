package com.opsway.betaoutBridge;

import android.os.Bundle;
import android.util.Log;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import com.betaout.sdk.app.BetaOut;
import com.betaout.sdk.model.BOProduct;
import com.betaout.sdk.model.BOCart;
import com.google.firebase.analytics.FirebaseAnalytics;

import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;

public class BetaoutBridgeModule extends ReactContextBaseJavaModule {
	private FirebaseAnalytics mFirebaseAnalytics;

    public BetaoutBridgeModule(ReactApplicationContext reactContext) {
        super(reactContext);
	    mFirebaseAnalytics = FirebaseAnalytics.getInstance(reactContext);
    }

    @Override
    public String getName() {
      return "BetaoutBridge";
    }

    @ReactMethod
    public void logout() {
        Log.d("BOBridge", "logout...");
        BetaOut.getInstance().explicitLogout();
	    mFirebaseAnalytics.logEvent("bo_logout", null);
    }

    @ReactMethod
    public void customerSetup(String customerId, String email, String phone) {
        Log.d("BOBridge", "customerSetup...");
        BetaOut.getInstance().setCustomerId(customerId);
        BetaOut.getInstance().setCustomerEmail(email);

        if (phone != null && !phone.isEmpty()) {
            BetaOut.getInstance().setCustomerPhone(phone);
        }

        Bundle params = new Bundle();
        params.putString("id", customerId);
        params.putString("email", email);
        params.putString("phone", phone);
        mFirebaseAnalytics.logEvent("bo_customer_setup", params);
    }

    @ReactMethod
    public void viewProduct(ReadableMap options) {
        Log.d("BOBridge", "viewProduct...");

        BOProduct product = BOProduct.create(options.getString("id"), options.getDouble("price"));
        product.setSku(options.getString("sku"));
        product.addCategoryToProduct(options.getString("groupID"), options.getString("groupName"), "0");
        product.setBrand(options.getString("brand"));
        product.setName(options.getString("name"));
        product.setProductImageUrl(options.getString("imageUrl"));
        product.setProductUrl(options.getString("url"));
        product.setQuantity(options.getInt("quantity"));

        BetaOut.getInstance().viewProductsWithProperties(product,null);

	    logFirebaseEvent("bo_view_product", options);
    }

    @ReactMethod
    public void addProduct(ReadableMap options) {
        Log.d("BOBridge", "addProduct...");
      BOProduct product = BOProduct.create(options.getString("productId"), options.getDouble("productPrice"));
      product.addCategoryToProduct(options.getString("productGroupID"), options.getString("productGroupName"), "0");
      product.setBrand(options.getString("productBrand"));
      product.setName(options.getString("productName"));
      product.setProductImageUrl(options.getString("productImageURL"));
      product.setProductUrl(options.getString("productURL"));
      product.setQuantity(options.getInt("productQuantity"));

      BOCart cart = BOCart.create(options.getDouble("cartTotal"), options.getDouble("cartRevenue"), options.getString("cartCurrency"));

      BetaOut.getInstance().addProductsToCartWithProperties(product, cart, null);
      logFirebaseEvent("bo_add_product", options);
    }

    @ReactMethod
    public void removeProduct(ReadableMap options) {
        Log.d("BOBridge", "removeProduct...");
        BOProduct product = BOProduct.create(options.getString("productId"), options.getDouble("productPrice"));
        product.addCategoryToProduct(options.getString("productGroupID"), options.getString("productGroupName"), "0");
        product.setBrand(options.getString("productBrand"));
        product.setName(options.getString("productName"));
        product.setProductImageUrl(options.getString("productImageURL"));
        product.setProductUrl(options.getString("productURL"));
        product.setQuantity(options.getInt("productQuantity"));

        BOCart cart = BOCart.create(options.getDouble("cartTotal"), options.getDouble("cartRevenue"), options.getString("cartCurrency"));

        BetaOut.getInstance().removeProductsForCartWithProperties(product, cart, null);
	    logFirebaseEvent("bo_remove_product", options);
    }

    @ReactMethod
    public void fullCartUpdate(ReadableMap options) {
        Log.d("BOBridge", "fullCartUpdate...");
        ReadableArray products = options.getArray("products");
        List<BOProduct> payloadProducts = new ArrayList<BOProduct>();

        for (int i = 0; i < products.size(); i++) {
            ReadableMap item = products.getMap(i);

            BOProduct product = BOProduct.create(item.getString("id"), item.getDouble("price"));
            product.addCategoryToProduct(item.getString("groupID"), item.getString("groupName"), "0");
            product.setBrand(item.getString("brand"));
            product.setName(item.getString("name"));
            product.setProductImageUrl(item.getString("imageUrl"));
            product.setProductUrl(item.getString("url"));
            product.setQuantity(item.getInt("quantity"));

            payloadProducts.add(product);
        }

        BetaOut.getInstance().updateProductsForCartWithProperties(payloadProducts, handleCart(options), null);
	    logFirebaseEvent("bo_cart_update", options);
    }

    @ReactMethod
    public void logEvent(String event, ReadableMap properties) {
        Log.d("BOBridge", "logEvent...");
        BetaOut.getInstance().logEventsWithProperties(event, convertMapToHashTable(properties));
	    logFirebaseEvent(event, properties);
    }

    @ReactMethod
    public void clearCart(ReadableMap options) {
        Log.d("BOBridge", "clearCart...");
        BetaOut.getInstance().clearCartWithProperties(handleCart(options), null);
	    logFirebaseEvent("bo_clear_cart", options);
    }

    @ReactMethod
    public void updateProperties(ReadableMap properties) {
        Log.d("BOBridge", "updateProperties...");
        BetaOut.getInstance().updateUserProperties(convertMapToHashTable(properties));
	    logFirebaseEvent("bo_update_properties", properties);
    }

    private BOCart handleCart(ReadableMap options) {
        ReadableMap cart = options.getMap("cart");

        return BOCart.create(cart.getDouble("total"), cart.getDouble("revenue"), cart.getString("currency"));
    }

    private void logFirebaseEvent(String event, ReadableMap options) {
	    Bundle params = new Bundle();
	    ReadableMapKeySetIterator iterator = options.keySetIterator();

	    while (iterator.hasNextKey()) {
		    String key = iterator.nextKey();
		    switch (options.getType(key)) {
			    case Null:
				    params.putString(key, "");
				    break;
			    case Boolean:
				    params.putBoolean(key, options.getBoolean(key));
				    break;
			    case Number:
				    params.putDouble(key, options.getDouble(key));
				    break;
			    case String:
				    params.putString(key, options.getString(key));
				    break;
		    }
	    }

	    mFirebaseAnalytics.logEvent(event, params);
    }

    private static Hashtable<String, String> toHashtable(ReadableMap readableMap) {
        Hashtable<String, String> hashtable = new Hashtable<>();
        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();

        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            hashtable.put(key, readableMap.getString(key));
        }

        return hashtable;
    }

    private static Hashtable convertMapToHashTable(ReadableMap readableMap) {
        Hashtable table = new Hashtable();
        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            switch (readableMap.getType(key)) {
                case Null:
                    table.put(key, "");
                    break;
                case Boolean:
                    table.put(key, readableMap.getBoolean(key));
                    break;
                case Number:
                    table.put(key, readableMap.getDouble(key));
                    break;
                case String:
                    table.put(key, readableMap.getString(key));
                    break;
                case Map:
                    table.put(key, convertMapToHashTable(readableMap.getMap(key)));
                    break;
                case Array:
                    table.put(key, convertArrayToHashtable(readableMap.getArray(key)));
                    break;
            }
        }
        return table;
    }

    private static Hashtable convertArrayToHashtable(ReadableArray readableArray) {
        Hashtable table = new Hashtable();
        for (int i = 0; i < readableArray.size(); i++) {
            switch (readableArray.getType(i)) {
                case Null:
                    break;
                case Boolean:
                    table.put(i, readableArray.getBoolean(i));
                    break;
                case Number:
                    table.put(i, readableArray.getDouble(i));
                    break;
                case String:
                    table.put(i, readableArray.getString(i));
                    break;
                case Map:
                    table.put(i, convertMapToHashTable(readableArray.getMap(i)));
                    break;
                case Array:
                    table.put(i, convertArrayToHashtable(readableArray.getArray(i)));
                    break;
            }
        }
        return table;
    }
}
