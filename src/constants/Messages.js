module.exports = {
  offline: 'Cannot load data. Please check your network connection and try again',
  requestError: 'Something went wrong. Please try again later.',
  timeOut: 'We are sorry, but our servers are currently being overloaded. ' +
    'We are resolving this problem. Please try again later',
  sentRecoveryMessage: 'A new password has been sent to your e-mail address.',
  registeredSuccessfully: 'You have successfully registered',
  validation: {
    required: 'This field is required!',
    email: {
      required: 'This field is required! Enter email or login via facebook',
      invalid: 'Enter valid email address'
    },
    phone: {
      required: 'This field is required! Please enter at least 10 characters.'
    },
    pin: {
      unknown: 'Unknown PIN',
      tooShort: 'Please enter at least 6 characters. '
    },
    password: {
      required: 'This field is required!',
      tooShort: 'Please enter at least 6 characters.',
      doesNotMatch: 'Password does not match the confirm password.'
    },
    firstName: {
      invalid: 'Enter valid first name.'
    },
    lastName: {
      invalid: 'Enter valid last name.'
    }
  }
};
