// @flow
import variable from "../../variables/platform";
import { Platform } from 'react-native';

export default (variables /*: * */ = variable) => {
  const formContent = {
	MainPageBackground  :variables.MainPageBackground,
	InputFieldBackground:variables.cardDefaultBg,
	textColor           :variables.textColor,
	inverseTextColor    :variables.inverseTextColor,
	PageSize            :variables.PageSize,
	Separator           :variables.Separator,
    CreateFormPageFiledItemWidth:{
		width:variables.deviceWidth*0.86, 
		borderWidth:0,
	},
	fixCreateFormPageFiledItemWidth: Platform.OS === "ios" ? {
		paddingTop:0,
		paddingBottom:0
	}:{
		paddingTop:0,
		paddingBottom:0
	},
	CardStyle:{
		width:variables.deviceWidth*0.95,
		alignSelf: 'center',
	},
	CardItemStyle:{
		borderRadius: 10,
	},
	fixFormContentGridModalListWrapperCloseButton:{
		paddingTop: variables.isIphoneX ? 20 : null
	},
	labelColor:variables.LabelColor,
	HeaderBackground:{
	  height:Platform.OS === "android" ? variables.toolbarHeight:null,
	},
    color : variables.HeaderForGeneral.color,
    colorForTransparent:variables.HeaderForTransparent.color,
    inputWithoutCardBg    :variables.inputWithoutCardBackground,
    
  };

  return formContent;
};
