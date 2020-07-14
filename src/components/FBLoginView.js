import React from 'react';
import {
    StyleSheet,
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Colors from "../constants/Colors";

class FBLoginView extends React.Component {
    static contextTypes = {
        isLoggedIn: React.PropTypes.bool,
        login: React.PropTypes.func,
        logout: React.PropTypes.func,
        props: React.PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Icon.Button
                name="facebook"
                backgroundColor={Colors.FACEBOOK}
                onPress={() => {
                    if (!this.props.isSignedIn) {
                        this.context.login()
                    } else {
                        this.context.logout()
                    }
                }} borderRadius={3}>
                {this.props.isSignedIn ? "Log out" : "Log in with Facebook"}
            </Icon.Button>
        );
    }
}
const SCREEN_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
    socialButton: {
        width: (SCREEN_WIDTH - 50) / 2
    },
});

export default FBLoginView;
