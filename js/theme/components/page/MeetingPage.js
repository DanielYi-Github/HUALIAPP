import variable from "../../variables/platform";

export default (variables /*: * */ = variable) => {
  const meetingPageTheme = {
	containerBgColor:variable.containerBgColor,
	inputHeightBase :variable.inputHeightBase
  };

  return meetingPageTheme;
};
