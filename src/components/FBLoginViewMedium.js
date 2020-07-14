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
                style={styles.socialButton}
                onPress={() => {
                    if (!this.context.isLoggedIn) {
                        this.context.login()
                    } else {
                        this.context.logout()
                    }
                }}>
                FACEBOOK
            </Icon.Button>
        );
    }
}
const SCREEN_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
    socialButton: {

    },
});

export default FBLoginView;
