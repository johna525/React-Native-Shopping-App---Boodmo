package com.opsway.boodmo;

import android.app.Application;
import android.content.Context;
import android.support.multidex.MultiDex;

import com.evollu.react.fa.FIRAnalyticsPackage;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.react.ReactApplication;
import com.horcrux.svg.SvgPackage;
import com.microsoft.codepush.react.CodePush;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import io.xogus.reactnative.versioncheck.RNVersionCheckPackage;
import com.razorpay.rn.RazorpayPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.ianlin.RNFirebaseCrashReport.RNFirebaseCrashReportPackage;
import com.magus.fblogin.FacebookLoginPackage;
import com.zyu.ReactNativeWheelPickerPackage;

import com.betaout.sdk.app.BetaOut;
import com.betaout.sdk.app.BetaOutConfig;

import com.opsway.betaoutBridge.*;
import com.opsway.firebaseCrashlytics.*;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new SvgPackage(),
          new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
          new GoogleAnalyticsBridgePackage(),
          new FIRMessagingPackage(),
          new RNDeviceInfo(),
          new RNVersionCheckPackage(),
          new RazorpayPackage(),
          new ReactNativeWheelPickerPackage(),
          new FIRAnalyticsPackage(),
          new FacebookLoginPackage(),
          new RNFirebaseCrashReportPackage(),
          new BetaoutBridgePackage(),
		  new FirebaseCrashlyticsPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  protected void attachBaseContext(Context context) {
    super.attachBaseContext(context);
    MultiDex.install(this);
  }

  @Override
  public void onCreate() {
    super.onCreate();
    FacebookSdk.sdkInitialize(getApplicationContext());
    AppEventsLogger.activateApp(this);
    SoLoader.init(this, /* native exopackage */ false);
    BetaOutConfig config = BetaOutConfig.init("blgams44m2hashqo738h3h6hjhnlm97jy8whhjz8b1", "34589",
     "238199217113");
    BetaOut.init(config, this);
  }
}
