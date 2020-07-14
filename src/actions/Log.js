import {NativeModules} from 'react-native';
import FirebaseCrash from 'react-native-firebase-crash-report';

const Analytics = require('react-native-firebase-analytics');
const {FirebaseCrashlytics} = NativeModules;

export function logEvent(event, parameter) {
  Analytics.logEvent(event, parameter);
}

export function crashlyticsLog(event) {
  FirebaseCrashlytics.log(event);
}

export function crashlyticsSetKeys(properties) {
  FirebaseCrashlytics.setKeys(properties);
}

export function crashlyticsSetUser(user) {
  FirebaseCrashlytics.setUser(user);
}

export function logCrash(error, body) {
  body = JSON.stringify(body);
  console.log(error + '\n' + body);
  FirebaseCrash.log(error + '\n' + body);
}
