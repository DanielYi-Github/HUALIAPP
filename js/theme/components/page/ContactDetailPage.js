// @flow
import variable from "../../variables/platform";

export default (variables /*: * */ = variable) => {
  const contactDetailPageTheme = {
		BigProfileImage      :variables.BigProfileImage,
		BigProfileImageBorder:variables.BigProfileImageBorder,
		EditBigProfileImage  :variables.EditBigProfileImage,
  		dynamicTitleColor    :variables.dynamicTitleColor,
  };

  return contactDetailPageTheme;
};
