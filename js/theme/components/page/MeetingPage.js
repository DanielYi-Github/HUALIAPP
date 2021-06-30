import variable from "../../variables/platform";

export default (variables /*: * */ = variable) => {
  const meetingPageTheme = {
	containerBgColor:variable.containerBgColor,
	inputHeightBase :variable.inputHeightBase,
	SpinnerbackgroundColor:variables.SpinnerbackgroundColor,
	SpinnerColor          :variables.SpinnerColor,
  };

  return meetingPageTheme;
};
