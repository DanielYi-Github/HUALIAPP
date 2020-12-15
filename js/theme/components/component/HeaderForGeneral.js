// @flow
import variable from "../../variables/platform";

export default (variables /*: * */ = variable) => {
  const platform = variables.platform;
  const headerForGeneralTheme = {
    HeaderBackground:{
      // height:variables.HeaderForGeneral.height,
      height:platform === "android" ? variables.toolbarHeight:null,
    },
    HeaderBackgroundWithTransparent:{
      height:platform === "android" ? variables.toolbarHeight:null,
      // height:null,
      backgroundColor:'rgba(255,255,255,0)',
      borderWidth:0
    },
    color : variables.HeaderForGeneral.color,
    colorForTransparent:variables.HeaderForTransparent.color
  };

  return headerForGeneralTheme;
};
