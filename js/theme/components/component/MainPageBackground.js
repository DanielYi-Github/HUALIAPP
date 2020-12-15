// @flow
import variable from "../../variables/platform";

export default (variables /*: * */ = variable) => {
  const mainPageBackground = {
	MainPageBackground  :variables.MainPageBackground,
	FunctionPageBannerBg:variables.MainPageBackground.backgroundColor,
	PageSize            :variables.PageSize,
	ButtonBgColor       :variables.inverseTextColor,
	ExplainTextBgColor  :variables.inverseTextColor,
  };

  return mainPageBackground;
};
