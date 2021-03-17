// @flow
import variable from "../../variables/platform";
import { Platform } from 'react-native';

export default (variables /*: * */ = variable) => {
  const recruitItem = {
	CardStyle:{
		width:variables.deviceWidth*0.95,
		alignSelf: 'center',
	},
	CardItemStyle:{
		borderRadius: 10,
	},
  };

  return recruitItem;
};