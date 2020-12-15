// @flow
import variable from "../../variables/platform";

export default (variables /*: * */ = variable) => {
  const carsPageTheme = {
    HeaderBackground:{
      height:variables.HeaderForGeneral.height,
    },
    iconColor:variables.HeaderForGeneral.color
  };

  return carsPageTheme;
};
