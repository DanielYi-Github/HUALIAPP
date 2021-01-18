// @flow
import variable from "../../variables/platform";

export default (variables /*: * */ = variable) => {
  const formPageTheme = {
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
    PageSize:variables.PageSize,
    Button:{
      width: '95%',
      borderRadius: 5,
      justifyContent: 'center',
      alignSelf:"center",
    },
    tabStyle:{
      backgroundColor:"transparent"
    },
    activeTabStyle:{
      backgroundColor:"transparent" 
    },
    backgroundColor: variable.containerBgColor,
    ExplainText:variables.ExplainText,
  };

  return formPageTheme;
};
