import React from 'react';
import * as Colors from '../constants/Colors';
import Button from './Button';

const ButtonSecondary = (props) => {
  const {children, style} = props;
  const ButtonStyle = {
    borderWidth: 2,
    borderColor: Colors.PRIMARY_LIGHT,
    borderRadius: 3,
    backgroundColor: 'transparent',
  };

  return (
    <Button
      {...props}
      style={[ButtonStyle, style]}
      textStyle={{
        fontSize: 15,
      }}
      textColor={Colors.PRIMARY_LIGHT}
    >
      {children.toUpperCase()}
    </Button>
  );
};

export default ButtonSecondary;
