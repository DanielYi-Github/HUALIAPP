// @flow
import variable from "../../variables/platform";

export default (variables /*: * */ = variable) => {
  const inputWithoutCardBackground = {
    inputWithoutCardBg:variables.inputWithoutCardBackground,
    Button:{
		width: '95%',
		borderRadius: 5,
		justifyContent: 'center',
		alignSelf:"center",
	},
	CreateFormPageFiledItemWidth:variable.CreateFormPageFiledItemWidth,
	fixCreateFormPageFiledItemWidth:variable.fixCreateFormPageFiledItemWidth,
	PageSize:variable.PageSize,
	MyFormListFilterModalSelect:{
		borderBottomWidth: 1, 
		borderBottomColor: '#D9D5DC', 
		width: '90%', 
		alignItems: 'flex-start', 
		justifyContent: 'flex-start',
		marginTop: 15
	},
  };

  return inputWithoutCardBackground;
};
