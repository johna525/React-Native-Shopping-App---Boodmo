import React from 'react';
import {TextInput, View, StyleSheet} from "react-native";

class CCTextInput extends React.Component {

    focus = () => this.refs.input.focus();

    _onChange = value => this.props.onChange(value);

    handleSubmitEditing() {
        if (this.props.onBlur) {
            this.props.onBlur();
        }
        if (this.props.onSubmit) {
            this.props.onSubmit();
        }
        this.refs.input.blur();
    }

    render() {
        const validColor = "", invalidColor = "red", placeholderColor = "gray";
        const {width, status, placeholder, value, keyboardType} = this.props;
        return (
            <View style={[s.containerStyle, {width: width}]}>
                <TextInput ref="input"
                           keyboardType={keyboardType}
                           autoCapitalise="none"
                           autoCorrect={false}
                           style={[
                               s.baseInputStyle,
                               ((validColor && status === 'valid') ? {color: validColor} :
                                   (invalidColor && status === 'invalid') ? {color: invalidColor} :
                                       {}),
                           ]}
                           underlineColorAndroid={"transparent"}
                           placeholderTextColor={placeholderColor}
                           placeholder={placeholder}
                           value={value}
                           onEndEditing={this.props.onBlur}
                           onSubmitEditing={this.handleSubmitEditing.bind(this)}
                           onChangeText={this._onChange}/>
            </View>
        );
    }
}
const s = StyleSheet.create({
    containerStyle: {
        paddingHorizontal: 5,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.15)',
        marginBottom: 10
    },
    baseInputStyle: {
        color: "black",
        height: 40,
    },
});

CCTextInput.defaultProps = {
    placeholder: '',
    value: '',
    valid: true
};

export default CCTextInput;
