// @flow
import variable from "../../variables/platform";

export default (variables /*: * */ = variable) => {
  variables = variables.CustomBottomNavigation;
  const customBottomNavigation = {
    iconIsImage          :variables.iconIsImage,
    icon_Home            :{
      active     :variables.icon_Home_active,
      inactive   :variables.icon_Home_inactive,
    },
    icon_Find:{
      active     :variables.icon_Find_active,
      inactive   :variables.icon_Find_inactive,
    },
    icon_Message:{
      active  :variables.icon_Message_active,
      inactive:variables.icon_Message_inactive,
    },
    icon_Mine:{
      active     :variables.icon_Mine_active,
      inactive   :variables.icon_Mine_inactive,
    },
    activeIconColor   :variables.activeIconColor,
    inactiveIconColor :variables.inactiveIconColor,
    activeLabelColor  :variables.activeLabelColor,
    inactiveLabelColor:variables.inactiveLabelColor,
    barColor          :variables.barColor,
    pressColor        :variables.pressColor,
    ToolbarStyle      :variables.ToolbarStyle,
    barColor_Home     :variables.barColor_Home,
    barColor_Find     :variables.barColor_Find,
    barColor_Message  :variables.barColor_Message,
    barColor_Mine     :variables.barColor_Mine,
    pressColor_Home   :variables.pressColor_Home,
    pressColor_Find   :variables.pressColor_Find,
    pressColor_Message:variables.pressColor_Message,
    pressColor_Mine   :variables.pressColor_Mine,
  };

  return customBottomNavigation;
};
