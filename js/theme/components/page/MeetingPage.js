import variable from "../../variables/platform";

export default (variables /*: * */ = variable) => {
  const meetingPageTheme = {
	containerBgColor      :variables.containerBgColor,
	inputHeightBase       :variables.inputHeightBase,
	SpinnerbackgroundColor:variables.SpinnerbackgroundColor,
	SpinnerColor          :variables.SpinnerColor,
    InputFieldBackground  :variables.cardDefaultBg,
	
  };

  return meetingPageTheme;
};
