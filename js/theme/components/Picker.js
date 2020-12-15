// @flow

import variable from "./../variables/platform";

export default (variables /*: * */ = variable) => {
  const pickerTheme = {
    ".note": {
      color: variables.titleFontColor
      // color: "#FFF"
    },
    // width: 90,
    marginRight: -4,
    flexGrow: 1
  };

  return pickerTheme;
};
