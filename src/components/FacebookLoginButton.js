import React from 'react';
import {
  Platform
} from 'react-native';
import {FBLogin, FBLoginManager} from 'react-native-facebook-login';
import FBLoginView from './FBLoginView';
import * as Log from '../actions/Log';
import * as Events from '../constants/Events';

const LoginBehavior = {
  'ios': FBLoginManager.LoginBehaviors.Browser,
  'android': FBLoginManager.LoginBehaviors.Native
};

class FacebookLoginButton extends React.Component {

  handleLogin(e) {
    if (!this.props.signedIn) {
      let userId = e.credentials.userId;
      let token = e.credentials.token;
      if (this.props.signInFacebook) {
        Log.logEvent(Events.EVENT_SIGN_IN_FACEBOOK);
        this.props.signInFacebook(userId, token);
      }
    }
  }

  onLoginNotFound() {

  }

  render() {
    return (
      <FBLogin
        ref={(fbLogin) => { this.fbLogin = fbLogin; }}
        buttonView={<FBLoginView isSignedIn={this.props.fbSignedIn}/>}
        loginBehavior={LoginBehavior[Platform.OS]}
        permissions={['email', 'public_profile']}
        onLogin={this.handleLogin.bind(this)}
        onLoginFound={this.handleLogin.bind(this)}
        onLoginNotFound={this.onLoginNotFound.bind(this)}
      />
    );
  }
}

export default FacebookLoginButton;
