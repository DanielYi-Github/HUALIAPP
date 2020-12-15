// @flow
import variable from "../../variables/platform";

export default (variables /*: * */ = variable) => {
  const homePageTheme = {
    HeaderBackground:{
      height:variables.deviceHeight,
    },
	Separator:{
		height: 1, 
		backgroundColor:'#DCDCDC'
	},
	SpinnerbackgroundColor:variables.SpinnerbackgroundColor,
	SpinnerColor          :variables.SpinnerColor,
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
    iconColor:variables.HeaderForGeneral.color,
    ItemHeight:variables.ItemHeight,
	inputWithoutCardBg:variables.inputWithoutCardBackground,
	flastBgColor:variables.cardDefaultBg
  };

  return homePageTheme;
};
