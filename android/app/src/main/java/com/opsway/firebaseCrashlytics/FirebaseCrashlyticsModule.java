package com.opsway.firebaseCrashlytics;

import com.crashlytics.android.Crashlytics;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;

public class FirebaseCrashlyticsModule extends ReactContextBaseJavaModule {

	FirebaseCrashlyticsModule(ReactApplicationContext reactContext) {
		super(reactContext);
	}

	@Override
	public String getName() {
		return "FirebaseCrashlytics";
	}

	@ReactMethod
	public void log(String event) {
		Crashlytics.log(event);
	}

	@ReactMethod
	public void setKeys(ReadableMap options) {
		ReadableMapKeySetIterator iterator = options.keySetIterator();

		while (iterator.hasNextKey()) {
			String key = iterator.nextKey();
			switch (options.getType(key)) {
				case Null:
					Crashlytics.setString(key, "");
					break;
				case Boolean:
					Crashlytics.setBool(key, options.getBoolean(key));
					break;
				case Number:
					Crashlytics.setDouble(key, options.getDouble(key));
					break;
				case String:
					Crashlytics.setString(key, options.getString(key));
					break;
			}
		}
	}

	@ReactMethod
	public void setUser(ReadableMap user) {
		if (user != null) {
			Crashlytics.setUserIdentifier(user.getString("id"));
			Crashlytics.setUserEmail(user.getString("email"));
			Crashlytics.setUserName(user.getString("name"));
		} else {
			Crashlytics.setUserIdentifier("");
			Crashlytics.setUserEmail("");
			Crashlytics.setUserName("");
		}
	}
}