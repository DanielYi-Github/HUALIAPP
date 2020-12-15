// @flow
import variable from "../../variables/platform";

export default (variables /*: * */ = variable) => {
  const noticeTabListTheme = {
	backgroundColor:variables.cardDefaultBg,
	separator      :variables.separator,
	ItemHeight:{
		height:variables.PageSize.height/10
	},
  };

  return noticeTabListTheme;
};
