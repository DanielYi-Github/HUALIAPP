// @flow
import variable from "../../variables/platform";

export default (variables /*: * */ = variable) => {
  const homeRootPageTheme = {
    inverseTextColor:{
    	color:variables.inverseTextColor
    },
    SpinnerbackgroundColor:variables.SpinnerbackgroundColor,
    SpinnerColor          :variables.SpinnerColor,
    InputFieldBackground  :variables.cardDefaultBg,
    titleFontColor        :variables.titleFontColor,
    inputWithoutCardBg    :variables.inputWithoutCardBackground,
    color                 :variables.HeaderForGeneral.color,
    HeaderBackground:{
      height:variables.HeaderForGeneral.height,
    },
    Transparent       :variables.Transparent,
    TabBarUnderlineColor:variables.TabBarUnderlineColor,   
    title              :{
      color: variables.TabIsActiveColor.active,
      fontWeight: 'bold'
    },
    subtitle      :{
      color: variables.TabIsActiveColor.inactive
    },
    PageSize:variables.PageSize
  };

  return homeRootPageTheme;
};
