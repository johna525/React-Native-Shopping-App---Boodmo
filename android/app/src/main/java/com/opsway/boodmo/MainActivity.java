package com.opsway.boodmo;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;

import com.betaout.sdk.app.BetaOut;
import com.crashlytics.android.Crashlytics;
import com.facebook.react.ReactActivity;
import com.uxcam.UXCam;

import io.fabric.sdk.android.Fabric;

public class MainActivity extends ReactActivity {

    final Context context = this;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // UXCam

        UXCam.startWithKey("9c72607c2d1d53a");

        // Crashlytics

        Fabric.with(this, new Crashlytics());

        // Deeplinks

        Intent appLinkIntent = getIntent();
        String appLinkAction = appLinkIntent.getAction();
        Uri appLinkData = appLinkIntent.getData();

        // Push notifications

        SharedPreferences sharedPreferences = getSharedPreferences("shouldShowPrompt",MODE_PRIVATE);

        if (sharedPreferences.getBoolean("shouldShowPrompt", false)) {
            SharedPreferences.Editor editor = sharedPreferences.edit();
            new AlertDialog.Builder(this)
                    .setIcon(android.R.drawable.ic_dialog_alert)
                    .setCancelable(false)
                    .setTitle("Enable Push Notifications")
                    .setNegativeButton("Deny", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {

                        }
                    })
                    .setMessage("Allowing this permission will help us improve your app experience. You can turn it off later at any time from Settings.")
                    .setPositiveButton("Allow", new DialogInterface.OnClickListener() {
                        public void onClick(DialogInterface dialog, int which) {
                            BetaOut.getInstance().enablePushNotifications(MainActivity.this);
                        }
                    }).show();

            editor.putBoolean("shouldShowPrompt", false);
            editor.apply();
        }
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "boodmo";
    }

    
}
