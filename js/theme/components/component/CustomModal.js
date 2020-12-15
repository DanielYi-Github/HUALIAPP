// @flow
import variable from "../../variables/platform";

export default (variables /*: * */ = variable) => {
  const customModalTheme = {
		SpinnerbackgroundColor:variables.SpinnerbackgroundColor,
		SpinnerColor          :variables.SpinnerColor,
  };

  return customModalTheme;
};
