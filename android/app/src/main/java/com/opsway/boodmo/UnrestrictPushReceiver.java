package com.opsway.boodmo;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

/**
 * Created by toxa on 02/26/18.
 */

public class UnrestrictPushReceiver extends BroadcastReceiver{
    @Override
    public void onReceive(Context context, Intent intent) {
        // Store value and show prompt to user on any activity based on value stored in sharedPreferences
        SharedPreferences sharedPreferences = context.getSharedPreferences("shouldShowPrompt", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putBoolean("shouldShowPrompt", true);
        editor.commit();

    }
}