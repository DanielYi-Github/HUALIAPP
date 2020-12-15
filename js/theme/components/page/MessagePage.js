// @flow
import variable from "../../variables/platform";

export default (variables /*: * */ = variable) => {
  const messagePageTheme = {
		Transparent       :variables.Transparent,
		HeaderTitleColor  :variables.inverseTextColor,
		dropdownStyle: 		variables.dropdownStyle,
		TabBarUnderlineColor:variables.TabBarUnderlineColor,
		title              :{
			color: variables.TabIsActiveColor.active,
			fontWeight: 'bold'
		},
		subtitle      :{
			color: variables.TabIsActiveColor.inactive
		}
  };

  return messagePageTheme;
};
