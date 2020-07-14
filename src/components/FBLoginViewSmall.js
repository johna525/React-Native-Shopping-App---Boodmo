import React from 'react';
import {
    StyleSheet,
    TouchableHighlight,
    View
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
            <TouchableHighlight
                style={styles.socialButton}
                underlayColor="#3A4583"
                onPress={() => {
                    if (!this.context.isLoggedIn) {
                        this.context.login()
                    } else {
                        this.context.logout()
                    }
                }}>
                <View>
                    <Icon
                        name="facebook"
                        color="#fff"
                        size={18}/>
                </View>
            </TouchableHighlight>
        );
    }
}
const styles = StyleSheet.create({
    socialButton: {
        width: 30,
        height: 30,
        borderRadius: 2,
        backgroundColor: Colors.FACEBOOK,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default FBLoginView;
