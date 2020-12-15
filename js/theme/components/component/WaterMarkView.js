// @flow
import variable from "../../variables/platform";

export default (variables /*: * */ = variable) => {
  const waterMarkViewTheme = {
    watermarkTextStyle:variables.watermarkTextStyle,  
  };

  return waterMarkViewTheme;
};
