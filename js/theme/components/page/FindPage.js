// @flow
import variable from "../../variables/platform";

export default (variables /*: * */ = variable) => {
  const findPageTheme = {
		Transparent       :variables.Transparent,
		ExplainText       :variables.ExplainText,
		HeaderTitleColor  :variables.inverseTextColor,
		dynamicTitleColor :variables.dynamicTitleColor,
		dashBackgroundColor:variables.DashBackgroundColor,
		iosSearchBarBackgroundColor:variables.iosSearchBarBackgroundColor
  };

  return findPageTheme;
};
