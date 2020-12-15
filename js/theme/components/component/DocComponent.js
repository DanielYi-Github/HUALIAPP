// @flow
import variable from "../../variables/platform";

export default (variables /*: * */ = variable) => {
  const DocComponentTheme = {
    CardItemStyle:{
      borderRadius: 10
    },
    //分隔線
    Separator:{
      height: 1, 
      backgroundColor: '#e6e6e6'
    },
    ItemHeight:variables.ItemHeight,
  };

  return DocComponentTheme;
};
