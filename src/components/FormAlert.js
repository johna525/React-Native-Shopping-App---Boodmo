import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform,
    TouchableNativeFeedback,
    TouchableHighlight
} from 'react-native';
import * as Colors from '../constants/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as _ from "lodash";
var Touchable = Platform.OS == 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableHighlight;

class FormAlert extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showAlert: false,
            message: null,
            messages: [],
            type: 'info',
            icon: 'info'
        }
    }

    showAlert(options) {
        let {message, type} = options;
        let icon = null;
        switch (type) {
            case 'warning':
                icon = 'exclamation-triangle';
                break;
            case 'success':
                icon = 'check';
                break;
            case 'info':
                icon = 'info';
                break;
            case 'danger':
                icon = 'exclamation-triangle';
                break;
        }
        let messages = [];
        if (_.isArray(message)) {
            messages = message;
            message = null;
        }
        this.setState({
            showAlert: true,
            message,
            messages,
            type,
            icon
        })
    }

    hideAlert() {
        this.setState({
            showAlert: false
        })
    }

    clearAlert() {
        this.setState({
            showAlert: false,
            message: null,
            messages: [],
        })
    }

    render() {
        return (
            <View>
                {
                    this.state.showAlert ?
                        <View style={[
                            styles.alert,
                            this.state.type ? styles[this.state.type] : styles.warning,
                            this.props.style
                            ]}>
                            <View style={styles.content}>
                                {
                                    this.state.icon ?
                                        <Icon
                                            style={styles.alertIcon}
                                            size={20}
                                            color="#fff"
                                            name={this.state.icon}/>
                                        : null
                                }
                                {
                                    this.state.message ?
                                        <Text style={styles.alertMessage}>
                                            {this.state.message}
                                        </Text>
                                        : null
                                }
                                {
                                    this.state.messages.length ?
                                        <View>
                                            {this.state.messages.map((message, key) => (
                                                <Text style={[styles.alertMessage, styles.alertMessageMargin]}
                                                      key={key}>
                                                    {message}
                                                </Text>
                                            ))}
                                        </View>
                                        : null
                                }
                            </View>
                            <View style={styles.roundButton}>
                                <Touchable
                                    underlayColor="rgba(0,0,0, 0.2)"
                                    style={styles.roundButton}
                                    onPress={this.hideAlert.bind(this)}>
                                    <View style={styles.roundButton}>
                                        <Icon name="times" size={22} color="rgba(0,0,0, 0.3)"/>
                                    </View>
                                </Touchable>
                            </View>
                        </View>
                        : null
                }
            </View>
        );
    }
}
const styles = StyleSheet.create({
    alert: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        marginBottom: 20,
    },
    warning: {
        backgroundColor: Colors.ALERT_WARNING
    },
    success: {
        backgroundColor: Colors.ALERT_SUCCESS
    },
    danger: {
        backgroundColor: Colors.ALERT_DANGER
    },
    info: {
        backgroundColor: Colors.ALERT_INFO
    },
    alertIcon: {
        marginRight: 10
    },
    content: {
        padding: 10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    alertMessage: {
        color: '#fff',
        fontSize: 14,
        flex: 1
    },
    alertMessageMargin: {
        marginBottom: 5
    },
    roundButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    }
});

export default FormAlert;
