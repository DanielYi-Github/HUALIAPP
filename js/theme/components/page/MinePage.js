// @flow
import variable from "../../variables/platform";

export default (variables /*: * */ = variable) => {
  const minePageTheme = {
	Transparent       :variables.Transparent,
	ExplainText:variables.ExplainText,
	HeaderTitleColor:variables.inverseTextColor
  };

  return minePageTheme;
};
