import React, {Component} from 'react';
import {
    AppRegistry
} from 'react-native';
import { GoogleTagManager } from 'react-native-google-analytics-bridge';
import setup from './src/setup';

GoogleTagManager.openContainerWithId("GTM-NRDF4BG")
.then((response) => {
  return response;
}).then((responseJson) => {
    if (responseJson) console.log("GoogleTagManager: container NRDF4BG was successfully opened");
  }
).catch(() => {});

AppRegistry.registerComponent('boodmo', () => setup);
