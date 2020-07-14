import React from 'react';
import {
  Text,
  TextInput,
  Switch,
  Modal,
  View,
  ScrollView,
  Dimensions
} from 'react-native';
import Button from 'boodmo/src/components/Button';
import styles from './styles';
import * as Colors from '../../constants/Colors';
import FormTextInput from "../FormTextInput";
import SelectInput from "../SelectInput";
import Icon from 'react-native-vector-icons/EvilIcons';
import { email, specNumber } from '../../utils/Validator';
import KeyboardSpacer from 'react-native-keyboard-spacer';

const SCREEN_WIDTH = Dimensions.get('window').width;

import LoadingIndicator from "../LoadingIndicator";

class SupportButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        email: '',
        emailErr: '',
        description: '',
        descriptionErr: 'Your description must contain at least 16 characters!',
        descPlaceholder: 'Description',
        sendLoading: false,
        sendLoaded: false,
        paramsValid: {},
        selectedType: '',
        selectedTypeErr: '',
        connected: true,
        types: []
    };
  }

  validateEmail = (text) => {
    ((text.length < 6 || !email(text)) && text.length > 0) ?
    this.setState({emailErr: 'Your email must contain at least 6 characters and be valid!'}) : this.setState({emailErr: ''});
  }

  validateDesc = (text) => {
    (text.length < 16 || text === '') ?
    this.setState({descriptionErr: 'Your description must contain at least 16 characters!'}) : this.setState({descriptionErr: ''});
  }

  validate = () => {
    var valid = false;
    if (this.state.paramsValid) {
      valid = true;
      let count1 = 0;
      let count2 = 0;
      for (let key in this.state.paramsValid) {
        count1++;
        if (!this.state.paramsValid[key]) { valid = false };
      };
      if (this.state.selectedType) {
        this.state.selectedType.params.map((item) => {
          if (item.required) { count2++ };
        });
        if (count1 != count2) { valid = false };
      }
    }

    return (this.state.emailErr.length == 0 && this.state.email.length > 0) &&
           (this.state.descriptionErr.length == 0 && this.state.description.length > 0) &&
           (valid) ?
           true : false;
  }

  sendFeedback = () => {
    if (this.state.selectedType.length === 0) {
      this.setState({ selectedTypeErr: 'This field is required!' })
    } else {
      this.setState({ selectedTypeErr: '' });
      let fields = {};
      this.state.selectedType.params.map((item) => {
        fields[item.freshdesk] = item.value.value ? item.value.value : item.value;
      });
      this.props.sendFeedback(this.state.email, this.state.selectedType.name, fields, this.state.description);
    };
  }

  successSendBack = () => {
    this.props.recover();
    this.setState({ email: '', description: '', selectedType: '' });
    this.props.fireFreshdeskModal();
  }

  componentWillReceiveProps(nextProps) {
    let types = [];
    for (var key in nextProps.ticketTypes) {
      let respK;
      if (SCREEN_WIDTH <= 320) {
        respK = key.length > 28 ? key.substr(0, 26) + '..' : key;
      } else if (SCREEN_WIDTH <= 768) {
        respK = key.length > 34 ? key.substr(0, 32) + '..' : key;
      } else if (SCREEN_WIDTH <= 1080) {
        respK = key.length > 40 ? key.substr(0, 38) + '..' : key;
      } else {
        respK = key;
      }
      types.push({
        name: key,
        value: respK,
        params: nextProps.ticketTypes[key]
      });
    }

    this.setState({ connected: nextProps.connected });

    if (nextProps.connected !== this.state.connected && nextProps.connected === true) {
      this.props.getTicketTypes();
    }

    if (nextProps.userEmail) {
      this.setState({ email: nextProps.userEmail });
    }

    this.setState({
      freshdeskErr: nextProps.freshdeskErr,
      sendLoading: nextProps.sendLoading,
      sendLoaded: nextProps.sendLoaded,
      types
    });
  }

  componentDidMount() {
    this.props.getTicketTypes();
  }

  render() {
    return (
      <View>
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.props.freshdeskModalVisible}
          style={{position: 'absolute'}}
          onRequestClose={this.props.fireFreshdeskModal}>
          <View style={styles.overlay}>
            <ScrollView style={{ alignSelf: 'center' }}>
              <View style={styles.modalBlock}>
                { this.state.freshdeskErr || !this.state.connected ?
                  <Button
                    style={{ backgroundColor: Colors.ALERT_DANGER }}
                    textStyle={{color: '#fff'}}
                    underlayColor='#f44337'
                    onPress={() => { this.props.getTicketTypes(); this.props.fireFreshdeskModal(); }}
                    title="Something went wrong, service unavailable rigth now.">
                    Something went wrong, service unavailable rigth now.
                  </Button> :
                  this.state.sendLoaded ?
                  <View>
                    <Text style={{ marginBottom: 10, textAlign: 'center', fontSize: 16 }}>Thank you, we will contact you soon</Text>
                    <Button
                      underlayColor='#1bb839'
                      onPress={this.successSendBack}
                      style={styles.thankYouForReview}
                      textStyle={{ color: '#fff' }}
                      title="Close">
                      Close
                    </Button>
                  </View> :
                  <View>
                    <FormTextInput
                      placeholder="Email"
                      underlineColorAndroid='rgba(0,0,0,0)'
                      error={this.state.emailErr.length > 0 ? true : false}
                      errorMessage={this.state.emailErr}
                      value={this.state.email}
                      onChangeText={(text) => { this.setState({ email: text }); this.validateEmail(text); }}
                      onChange={this.validate}
                      placeholderTextColor='#000'
                    />
                    <View style={{marginBottom: 20}}>
                      <SelectInput
                        pickerFontSize={20}
                        needBlack={true}
                        placeholder={'Type'}
                        data={this.state.types}
                        value={this.state.selectedType}
                        onValueChange={(type) => {
                          if (type) {
                            type.params.map((t) => {
                              t.value = t.type === "checkout" ? false : "";
                            });
                          }
                          this.setState({
                            selectedType: type,
                            selectedTypeErr: '',
                            paramsValid: {},
                            description: '',
                            descriptionErr: ''
                          });
                        }}
                        onClearClick={() => {
                          this.setState({ selectedType: '' });
                        }}
                        onSubmitClick={() => {
                          if (!this.state.selectedType) {
                            this.setState({ selectedType: this.state.types[0], selectedTypeErr: '' });
                          }
                        }}
                        viewStyle={(this.state.selectedTypeErr.length > 0) ?
                          [styles.selectInput, {borderColor: 'red'}] : styles.selectInput}
                        textStyle={styles.selectInputTextStyle}
                        iconStyle={styles.selectInputIconStyle}
                        iconName={'sort'}
                      />
                      {
                        this.state.selectedTypeErr.length > 0 ?
                          <Text style={styles.formGroupError}>{this.state.selectedTypeErr}</Text>
                          : null
                      }
                    </View>
                    {
                      this.state.selectedType ?
                        this.state.selectedType.params.map((p, key) => {
                          switch (p.type) {
                            case "selectInput":
                              return (
                                <View style={{marginBottom: 20}} key={key}>
                                  <SelectInput
                                    pickerFontSize={20}
                                    needBlack={true}
                                    placeholder={p.title}
                                    data={p.choices}
                                    value={this.state.selectedType.params[key].value}
                                    onValueChange={(t) => {
                                      let type = {...this.state.selectedType};
                                      type.params[key].value = t;
                                      this.setState({ selectedType: type });
                                      if (p.required) {
                                        let validParam = {...this.state.paramsValid};
                                        validParam[key] = true;
                                        this.setState({ paramsValid: validParam });
                                      }
                                    }}
                                    onClearClick={() => {
                                      let type = {...this.state.selectedType};
                                      type.params[key].value = '';
                                      this.setState({ selectedType: type });
                                      if (p.required) {
                                        let validParam = {...this.state.paramsValid};
                                        validParam[key] = false;
                                        this.setState({ paramsValid: validParam });
                                      }
                                    }}
                                    onSubmitClick={() => {
                                      let type = {...this.state.selectedType};
                                      if (!type.params[key].value) {
                                        type.params[key].value = p.choices[0];
                                        this.setState({ selectedType: type });
                                      }
                                    }}
                                    viewStyle={(p.required ? (this.state.selectedType.params[key].value.length < 1 ? true : false) : false) ?
                                      [styles.selectInput, {borderColor: 'red'}] : styles.selectInput}
                                    textStyle={styles.selectInputTextStyle}
                                    iconStyle={styles.selectInputIconStyle}
                                    iconName={'sort'}
                                  />
                                  {
                                    (p.required ? (this.state.selectedType.params[key].value.length < 1 ? true : false) : false) ?
                                      <Text style={styles.formGroupError}>This field is required!</Text>
                                      : null
                                  }
                                </View>
                              );
                            case "checkout":
                              return (
                                <View key={key} style={{ paddingBottom: 20, flexDirection:'row' }}>
                                  <Switch
                                    style={{ display: 'flex' }}
                                    value={!!this.state.selectedType.params[key].value}
                                    onValueChange={(value) => {
                                      let type = {...this.state.selectedType};
                                      type.params[key].value = value;
                                      this.setState({ selectedType: type });
                                    }}
                                  />
                                  <Text style={{ display: 'flex', alignSelf: 'center', marginLeft: 15, fontSize: 14 }}>{p.title}</Text>
                                </View>
                              );
                            case "textInput":
                              return (
                                <FormTextInput
                                  key={key}
                                  placeholder={p.title}
                                  onChangeText={((text) => {
                                    let type = {...this.state.selectedType};
                                    type.params[key].value = text;
                                    this.setState({ selectedType: type });
                                    if (p.required) {
                                      let validParam = {...this.state.paramsValid};
                                      if (this.state.selectedType.params[key].value.length > 0) {
                                        validParam[key] = true;
                                        this.setState({ paramsValid: validParam });
                                      } else {
                                        validParam[key] = false;
                                        this.setState({ paramsValid: validParam });
                                      }
                                    }
                                  })}
                                  value={this.state.selectedType.params[key].value}
                                  underlineColorAndroid='rgba(0,0,0,0)'
                                  error={p.required ? (this.state.selectedType.params[key].value.length < 1 || ((p.validation_type == "number") ? !specNumber(this.state.selectedType.params[key].value) : false) ? true : false) : false }
                                  errorMessage={p.validation_type == "number" ? "Required, this field must contain only numbers and dashes!" : "This field is required!"}
                                />
                              );
                            default:
                              return null;
                          }
                        })
                      : null
                    }
                    <View style={{marginBottom: 20}}>
                      <View style={(this.state.descriptionErr.length > 0) ?
                        [styles.descriptionWrapper, {borderColor: 'red'}] : styles.descriptionWrapper}>
                        <TextInput
                          value={this.state.description}
                          onChangeText={(text) => { this.setState({ description: text }); this.validateDesc(text); }}
                          onFocus={() => this.setState({ descPlaceholder: '' })}
                          onBlur={() => this.setState({ descPlaceholder: 'Description' })}
                          style={styles.descriptionInput}
                          multiline={true}
                          blurOnSubmit={true}
                          numberOfLines={3}
                          autoCorrect={false}
                          underlineColorAndroid="transparent"
                          placeholder={this.state.descPlaceholder}
                          placeholderTextColor={Colors.PLACEHOLDER}
                        />
                      </View>
                      {
                        this.state.descriptionErr.length > 0 ?
                          <Text style={styles.formGroupError}>{this.state.descriptionErr}</Text>
                          : null
                      }
                    </View>
                    <KeyboardSpacer/>
                    {
                      this.state.sendLoading ?
                      <LoadingIndicator
                          style={{marginBottom: 15}}
                          black
                          size="small"/> :
                      <Button
                        disabled={!this.validate()}
                        style={styles.submitButton}
                        textStyle={{color: '#fff'}}
                        onPress={this.sendFeedback}
                        title="Send">
                        Send
                      </Button>
                    }
                    <Button
                      onPress={() => {
                        this.props.recover(); this.setState({
                          email: '',
                          emailErr: '',
                          description: '',
                          descriptionErr: '',
                          paramsValid: {},
                          selectedType: '',
                          selectedTypeErr: '',
                          types: []
                        });
                        this.props.fireFreshdeskModal();
                        this.props.getTicketTypes();
                      }}
                      title="Close">
                      Close
                    </Button>
                  </View>
                }
              </View>
            </ScrollView>
          </View>
        </Modal>
        <View style={styles.supportWrapper}>
          <Icon.Button
            name="question" size={30} color="#fff"
            onPress={() => { this.props.fireFreshdeskModal(); }}
            backgroundColor={Colors.BUTTON_BLUE}
            paddingVertical={4}
            paddingHorizontal={10}
            textStyle={styles.supportButtonText}
            title="support">
            Contact support
          </Icon.Button>
        </View>
      </View>
    );
  }
}

export default SupportButton;
