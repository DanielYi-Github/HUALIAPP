import * as React from 'react';
import { View, StatusBar, Platform } from 'react-native';
import { createNavigatorFactory, NavigationHelpersContext, useNavigationBuilder, TabRouter, TabActions } from '@react-navigation/native';

import { Container, Header, Content, Icon, Thumbnail, connectStyle, Text } from 'native-base';
import BottomNavigation, { FullTab, ShiftingTab, IconTab, Badge } from 'react-native-material-bottom-navigation';
import { useSelector }from 'react-redux';

let renderIcon = (icon, iconIsImage, activeIconColor, inactiveIconColor) => ({ isActive }) => {  
  if (iconIsImage) {
    return isActive ?  
      <Thumbnail square style={{height:35, width: 35}} source={icon.active}/>
    :
      <Thumbnail square style={{height:35, width: 35}} source={icon.inactive}/>
  } else {
    return isActive ?  
      <Icon style={{color: activeIconColor}} name={icon.active} />
    :
      <Icon style={{color: inactiveIconColor}} name={icon.inactive} />
  }
  
}

function RenderTab(style, Message, { tab, isActive }){
  if (isActive) {
     return(
       <FullTab
          isActive   ={isActive}
          key        ={tab.key}
          label      ={tab.label}
          labelStyle ={{color:style.activeLabelColor}}
          renderIcon ={renderIcon(tab.icon, style.iconIsImage, style.activeIconColor, style.inactiveIconColor)}
          showBadge  ={tab.key === 'message'}
          renderBadge={() =>{
             if (Message.UnMessage.length == 0) {
               return null;
             } else {
               return <Badge>{Message.UnMessage.length}</Badge>
             }
            } 
           }
          style={{justifyContent: 'center', alignItems: 'center'}}

       />
     )
  } else {
     return(
       <FullTab
          isActive   ={isActive}
          key        ={tab.key}
          label      ={tab.label}
          labelStyle ={{color:style.inactiveLabelColor}}
          renderIcon ={renderIcon(tab.icon, style.iconIsImage, style.activeIconColor, style.inactiveIconColor)}
          showBadge  ={tab.key === 'message'}
          renderBadge={() =>{
             if (Message.UnMessage.length == 0) {
               return null;
             } else {
               return <Badge>{Message.UnMessage.length}</Badge>
             }
           }
          }
          style={{justifyContent: 'center', alignItems: 'center'}}
       />
     )
  }
}

function TabNavigator({ initialRouteName, children, screenOptions, tabBarStyle, contentStyle}) {
  let isThemeDone = useSelector(state => state.Theme.isThemeDone);
  let lang        = useSelector(state => state.Language.lang);
  let Message     = useSelector(state => state.Message);

  const { state, navigation, descriptors } = useNavigationBuilder( TabRouter, { children, screenOptions, initialRouteName });
  let tabss = [
    {
      label     : lang.MainPage.Home,
      barColor  : contentStyle.barColor_Home,
      pressColor: contentStyle.pressColor_Home,
      icon      : contentStyle.icon_Home,
    }, {
      label     : lang.MainPage.Find,
      barColor  : contentStyle.barColor_Find,
      pressColor: contentStyle.pressColor_Find,
      icon      : contentStyle.icon_Find,
    }, {
      label     : lang.MainPage.Message,
      barColor  : contentStyle.barColor_Message,
      pressColor: contentStyle.pressColor_Message,
      icon      : contentStyle.icon_Message,
    }, {
      label     : lang.MainPage.Mine,
      barColor  : contentStyle.barColor_Mine,
      pressColor: contentStyle.pressColor_Mine,
      icon      : contentStyle.icon_Mine,
    }
  ];

  let i=0;
  state.routes.map( (route) => {
    state.routes[i] = {...route, ...tabss[i++]}
  })

  return (
    <NavigationHelpersContext.Provider value={navigation}>
     <View style={[ { flex: 1 },  contentStyle ]}>
       {descriptors[state.routes[state.index].key].render()}
     </View>

      { 
        isThemeDone ? 
        <BottomNavigation
         activeTab  ={state.routes[state.index].key}
         onTabPress ={(tab, isActive) => {
            // 觸發當前畫面所使用的事件
            const event = navigation.emit({ type: 'tabPress', target: tab.key, canPreventDefault: true });

            if (!event.defaultPrevented) {
              navigation.dispatch({ ...TabActions.jumpTo(tab.name), target: state.key });
            }
          }}
          renderTab  ={RenderTab.bind(this, contentStyle, Message)}
          tabs       ={state.routes}
          style={{
            backgroundColor: 'rgba(0,0,0,0)'
          }}
        />
      : 
        null
      }
    </NavigationHelpersContext.Provider>

  );
  
}

export const createMyNavigator = createNavigatorFactory(TabNavigator);
