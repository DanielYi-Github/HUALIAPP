import variable from "../../variables/platform";

export default (variables /*: * */ = variable) => {
  const meetingPageTheme = {
	containerBgColor      :variables.containerBgColor,
	inputHeightBase       :variables.inputHeightBase,
	SpinnerbackgroundColor:variables.SpinnerbackgroundColor,
	SpinnerColor          :variables.SpinnerColor,
	InputFieldBackground  :variables.cardDefaultBg,
	textColor 			  :variables.textColor,

	// MeetingCalendar
	meetingCalendar:{
		backgroundColor                 : variables.containerBgColor, // 畫面主要的背景
		calendarBackground              : variables.cardDefaultBg, // 行事曆畫面的背景
		dayTextColor                    : variables.subtitleColor, //行日曆裡數字的顏色
		textDisabledColor               : variables.Separator.backgroundColor, //行日曆裡不可選的數字的顏色
		monthTextColor                  : variables.titleFontColor,
		textDayFontWeight               : 'bold',
		textMonthFontWeight             : 'bold',
	},
  };

  return meetingPageTheme;
};
