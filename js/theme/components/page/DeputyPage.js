// @flow
import variable from "../../variables/platform";

export default (variables /*: * */ = variable) => {
  const deputyPageTheme = {
	inputBackgroundColor:variables.cardDefaultBg,
	fixCreateFormPageFiledItemWidth:variables.fixCreateFormPageFiledItemWidth,
	inputWithoutCardBg:variables.inputWithoutCardBackground	
  };

  return deputyPageTheme;
};
