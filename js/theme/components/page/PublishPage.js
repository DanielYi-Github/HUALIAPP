// @flow
import variable from "../../variables/platform";

export default (variables /*: * */ = variable) => {
  const publishPageTheme = {
	cardDefaultBg         :variables.cardDefaultBg,
	SpinnerbackgroundColor:variables.SpinnerbackgroundColor,
	SpinnerColor          :variables.SpinnerColor,
	dynamicTitleColor     :variables.dynamicTitleColor
  };

  return publishPageTheme;
};
