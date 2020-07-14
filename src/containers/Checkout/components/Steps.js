import React from 'react';
import {
  Text,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import StepsAccordion from './StepsAccordion';
import styles from '../styles';
import {EMAIL_STEP} from '../../../constants/Checkout';
const dismissKeyboard = require('dismissKeyboard');

import {metricsCheckoutContinueStepClick} from '../../../utils/metrics';

import EmailStep from './Email.Step';
import DeliveryStep from './Delivery.Step';
import ReviewStep from './Review.Step';
import PaymentStep from './Payment.Step';

class Steps extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedStep: EMAIL_STEP,
      oldStep: null
    };
    this.scroll = null;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedStep != this.state.selectedStep) {
      this.goToStep(nextProps.selectedStep, this.state.selectedStep);
    }
  }

    goToStep = (stepNumber, oldStep) => {
      this.setState({
        selectedStep: stepNumber,
        oldStep
      });
      if (!this.props.stepPaymentDone && this.scroll) {
        setTimeout(() => this.scroll.scrollToPosition(0, stepNumber * 60, true), 500);
      }
    };

    metricsContinueStepClick(step) {
      let products = [];

      if (this.props.products.length > 0) {
        this.props.products.map((p) => {
          products.push({
            id: p.product && p.product.id && p.product.id.toString(),
            name: p.product && p.product.part && p.product.part.name,
            category: p.product && p.product.part && p.product.part.family_name,
            dimension16: p.product && p.product.part && p.product.part.family_id && p.product.part.family_id.toString(),
            brand: p.product && p.product.part && p.product.part.brand_name,
            variant: p.product && p.product.part && p.product.part.brand_is_oem,
            price: p.product && p.product.price && p.product.price.amount,
            metric1: p.product && p.product.price && p.product.price.amount,
            quantity: p.product && p.product.requested_qty,
            step: this.props.selectedStep,
            option: this.props.paymentMethod || null
          });
        });
      }
      metricsCheckoutContinueStepClick({
        eventContext: this.props.steps && this.props.steps[this.props.selectedStep] && this.props.steps[this.props.selectedStep].name,
        ecommerce: {
          currencyCode: this.props.currentCurrency,
          checkout: {
            actionField: {},
            products
          }
        }
      });
    }

    onEmailStepSubmit(email, password = null) {
      this.metricsContinueStepClick(0);
      this.props.onEmailStepSubmit(email, password);
    }

    onDeliveryStepSubmit(deliveryInfo) {
      this.metricsContinueStepClick(1);
      this.props.onDeliveryStepSubmit(deliveryInfo);
    }

    onReviewStepSubmit() {
      this.metricsContinueStepClick(2);
      this.props.onReviewStepSubmit();
    }

    onPaymentStepSubmit(localPaymentMethod, crossboardPaymentMethod) {
      this.metricsContinueStepClick(3);
      this.props.onPaymentStepSubmit(localPaymentMethod, crossboardPaymentMethod);
    }

    onChangeEmail() {
      this.props.onChangeEmail();
    }

    saveDeliveryInfo(deliveryInfo) {
      this.props.saveDeliveryInfo(deliveryInfo);
    }

    changeCurrentStep(step) {
      this.props.changeCurrentStep(step);
    }

    getSteps() {
      const contents = [
        <EmailStep
          fbSignedIn={this.props.fbSignedIn}
          isFetching={this.props.isFetching}
          recoveryIsFetching={this.props.recoveryIsFetching}
          signedIn={this.props.signedIn}
          signedOut={this.props.signedOut}
          userEmail={this.props.userEmail}
          emailExists={this.props.emailExists}
          authError={this.props.authError}
          sentRecoveryMessage={this.props.sentRecoveryMessage}
          onSubmit={this.onEmailStepSubmit.bind(this)}
          onForgotPassword={this.props.onForgotPassword.bind(this)}
          onChangeEmail={this.props.onChangeEmail}
          clearErrors={this.props.clearErrors}
          signInFacebook={
            (userId, token) => {
              this.props.signInFacebook(userId, token);
            }
          }
        />,
        <DeliveryStep
          selectedStep={this.state.selectedStep}
          oldStep={this.state.oldStep}
          loadedDeliveryInfo={this.props.loadedDeliveryInfo}
          validatePin={this.props.validatePin}
          isFetching={this.props.isFetching}
          pinIsFetching={this.props.pinIsFetching}
          saveDeliveryInfo={this.saveDeliveryInfo.bind(this)}
          pinError={this.props.pinError}
          pinFetched={this.props.pinFetched}
          deliveryErrors={this.props.deliveryErrors}
          deliveryInfo={this.props.deliveryInfo}
          onSubmit={this.onDeliveryStepSubmit.bind(this)}/>,
        <ReviewStep
          reviewCart={this.props.reviewCart}
          navigator={this.props.navigator}
          isFetching={this.props.isFetching}
          localPayment={this.props.localPayment}
          crossboardPayment={this.props.crossboardPayment}
          onSubmit={this.onReviewStepSubmit.bind(this)}/>,
        <PaymentStep
          availablePaymentMethods={this.props.availablePaymentMethods}
          paymentMethod={this.props.paymentMethod}
          localPayment={this.props.localPayment}
          crossboardPayment={this.props.crossboardPayment}
          isFetching={this.props.isFetching}
          onSubmit={this.onPaymentStepSubmit.bind(this)}/>
      ];
      const steps = this.props.steps.map((step, key) => {
        if (step.name === 'DELIVERY' && step.done) {
          step.disabled = false;
        }
        step.content = contents[key] || <Text>{step.name}</Text>;

        return step;
      });

      return steps;
    }

    _renderContent(section) {
      return (
        <View style={styles.content}>
          {section.content}
        </View>
      );
    }

    render() {
      return (
        <KeyboardAwareScrollView
          ref={scroll => this.scroll = scroll}
          extraScrollHeight={this.props.platformOS === 'ios' ? 90 : 0}
          keyboardShouldPersistTaps="always"
          removeClippedSubviews={true}>
          <TouchableWithoutFeedback
            onPress={() => dismissKeyboard()}>
            <StepsAccordion
              initiallyActiveSection={this.props.selectedStep}
              loading={this.props.isFetching}
              emailExists={this.props.emailExists}
              sections={this.getSteps()}
              onChange={this.changeCurrentStep.bind(this)}
              activeSection={this.state.selectedStep}
              renderContent={this._renderContent}
            />
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
      );
    }
}


export default Steps;
