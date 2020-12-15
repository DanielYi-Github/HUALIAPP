// @flow
import variable from "../../variables/platform";

export default (variables /*: * */ = variable) => {
  const reportPageTheme = {
	ExplainText:variables.ExplainText,
	SpinnerColor:variables.SpinnerColor,
	tabBarUnderlineStyle:{
		backgroundColor:variables.TabIsActiveColorForBirthday.active
	},
	tabStyle:{
		backgroundColor:"transparent"
	},
	activeTabStyle:{
		backgroundColor:"transparent"	
	},
	title              :{
		color: variables.titleFontColor
	},
	subtitle      :{
		color: variables.subtitleColor
	},	
	HeaderTitle:{
		color: variables.TabIsActiveColorForBirthday.active
	},
	HeaderSubtitle      :{
		color: variables.TabIsActiveColorForBirthday.inactive
	},
	textColor:variables.textColor,
	iconColor:variables.HeaderForGeneral.iconColor,
	ItemHeight:variables.ItemHeight,
	PageSize:variables.PageSize
  };

  return reportPageTheme;
};
