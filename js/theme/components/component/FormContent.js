// @flow
import variable from "../../variables/platform";
import { Platform } from 'react-native';

export default (variables /*: * */ = variable) => {
  const formContent = {
    InputFieldBackground:variables.cardDefaultBg,
    textColor:variables.textColor,
    inverseTextColor:variables.inverseTextColor,
    PageSize:variables.PageSize,
    Separator:variables.Separator,
    CreateFormPageFiledItemWidth:{
		width:variables.deviceWidth*0.86, 
		borderWidth:0,
	},
	fixCreateFormPageFiledItemWidth: Platform.OS === "ios" ? {
		paddingTop:5,
		paddingBottom:5
	}:{
		paddingTop:5,
		paddingBottom:15
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
	labelColor:variables.LabelColor
  };

  return formContent;
};
