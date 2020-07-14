import React, {
  Component,
  PropTypes,
} from 'react';

import {
  View,
  ViewPropTypes,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  Text
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Collapsible from 'react-native-collapsible';
const Touchable = Platform.OS === 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableOpacity;
import * as Colors from '../../../constants/Colors';
import styles from '../styles';

const COLLAPSIBLE_PROPS = Object.keys(Collapsible.propTypes);
const VIEW_PROPS = Object.keys(ViewPropTypes);

class StepsAccordion extends Component {
    static propTypes = {
      sections: PropTypes.array.isRequired,
      renderContent: PropTypes.func.isRequired,
      onChange: PropTypes.func,
      align: PropTypes.oneOf(['top', 'center', 'bottom']),
      duration: PropTypes.number,
      easing: PropTypes.string,
      initiallyActiveSection: PropTypes.number,
      activeSection: PropTypes.oneOfType([
        PropTypes.bool, // if false, closes all sections
        PropTypes.number, // sets index of section to open
      ]),
      underlayColor: PropTypes.string,
    };

    static defaultProps = {
      underlayColor: 'black',
    };

    constructor(props) {
      super(props);

      // if activeSection not specified, default to initiallyActiveSection
      this.state = {
        activeSection: props.activeSection !== undefined ? props.activeSection : props.initiallyActiveSection,
      };
    }

    _toggleSection(section) {
      const activeSection = this.state.activeSection === section ? false : section;

      if (this.props.activeSection === undefined) {
        this.setState({activeSection});
      }
      if (this.props.onChange) {
        this.props.onChange(activeSection);
      }
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.activeSection !== undefined) {
        this.setState({
          activeSection: nextProps.activeSection,
        });
      }
    }

    render() {
      let viewProps = {};
      let collapsibleProps = {};
      Object.keys(this.props).forEach((key) => {
        if (COLLAPSIBLE_PROPS.indexOf(key) !== -1) {
          collapsibleProps[key] = this.props[key];
        } else if (VIEW_PROPS.indexOf(key) !== -1) {
          viewProps[key] = this.props[key];
        }
      });
      return (
        <View {...viewProps}>
          {this.props.sections.map((section, key) => (
            <View key={key}>
              <Touchable
                onPress={() => this._toggleSection(key)}
                underlayColor={this.props.underlayColor}
                disabled={section.disabled || (key == 0 && this.props.emailExists !== false) || this.state.activeSection === key || this.props.loading}>
                <View style={[
                  styles.stepHeader,
                  section.disabled ? styles.stepHeaderDisabled : null,
                  !section.disabled && this.state.activeSection != key ? styles.stepHeaderDone : null,
                  this.state.activeSection === key ? styles.stepHeaderSelected : null,
                ]}>
                  <View style={styles.stepHeaderInner}>
                    {
                      section.done && this.state.activeSection != key ?
                        <View style={styles.doneIcon}>
                          <Icon
                            name="check"
                            color={Colors.STEP_HEADER_DONE_TEXT}
                            size={16}/>
                        </View>
                        : null
                    }
                    <Text style={[
                      styles.stepHeaderLabel,
                      !section.disabled && this.state.activeSection != key ? styles.stepHeaderDoneLabel : null,
                    ]}>
                      {key + 1}. {section.done ? section.name : section.title}
                    </Text>
                  </View>
                  {
                    !section.disabled && this.state.activeSection != key && (key != 0 || (this.props.emailExists === false && key == 0)) ?
                      <View style={styles.goToStepButton}>
                        <Icon name="twitter-retweet" size={24} color={Colors.STEP_HEADER_BUTTON}/>
                      </View>
                      : null
                  }
                </View>
              </Touchable>
              <Collapsible collapsed={this.state.activeSection !== key} {...collapsibleProps}>
                {this.props.renderContent(section, key, this.state.activeSection === key)}
              </Collapsible>
            </View>
          ))}
        </View>
      );
    }
}

export default StepsAccordion;
