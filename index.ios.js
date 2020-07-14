import React, {Component} from 'react';
import {
    AppRegistry,
    NativeModules
} from 'react-native';
import { GoogleTagManager } from 'react-native-google-analytics-bridge';
import * as Config from './src/constants/Config';
import setup from './src/setup';

async function init() {
  await GoogleTagManager.openContainerWithId("GTM-NFZP474")
  .then((response) => {
    return response;
  }).then((responseJson) => {
      if (responseJson) console.log("GoogleTagManager: container NFZP474 was successfully opened");
    }
  ).catch(() => {});

  if (Config.BETAOUT_ACTIVE) {
    await NativeModules.BetaoutBridge.betaoutInit(Config.BETAOUT_APIKEY, Config.BETAOUT_PROJECT_ID.toString());
  }
};

init();

AppRegistry.registerComponent('boodmo', () => setup);
