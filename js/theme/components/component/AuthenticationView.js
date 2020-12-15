// @flow
import variable from "../../variables/platform";

export default (variables /*: * */ = variable) => {
  const authenticationViewTheme = {
    SpinnerbackgroundColor:variables.SpinnerbackgroundColor,  
    SpinnerColor          :variables.SpinnerColor,            
    inputWithoutCardBg    :variables.inputWithoutCardBackground,  
  };

  return authenticationViewTheme;
};
