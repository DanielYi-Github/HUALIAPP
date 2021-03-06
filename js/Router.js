import React, { useState, useRef } from 'react';
import { View, Platform, Alert, NativeModules, AppState } from 'react-native';
import { Icon, Text, StyleProvider, Root, Thumbnail, connectStyle} from 'native-base';
import { connect, useSelector, useDispatch}from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AppInitAction from './redux/actions/AppInitAction';
import * as HomeAction    from './redux/actions/HomeAction';
import * as ThemeAction   from './redux/actions/ThemeAction';
import * as CommonAction  from './redux/actions/CommonAction';
import * as LoginAction   from './redux/actions/LoginAction';
import * as MessageAction from './redux/actions/MessageAction';
import * as MeetingAction from './redux/actions/MeetingAction';

import { SafeAreaProvider, SafeAreaView }     from 'react-native-safe-area-context';
import { NavigationContainer, useIsFocused }  from '@react-navigation/native';
import { createStackNavigator, TransitionSpecs, CardStyleInterpolators, TransitionPresets } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { withSecurityView }     from './components/WithSecurityView';
import { navigationRef }        from './utils/NavigationService';
import DeviceStorageUtil        from './utils/DeviceStorageUtil';

import SplashPage                from './pages/SplashPage';
import IntroductionDrawerContent from './components/IntroductionDrawerContent';
import IntroductionPage          from './pages/Introduction/IntroductionPage';
import RecruitPage               from './pages/Introduction/RecruitPage';
import RecruitDetailPage         from './pages/Introduction/RecruitDetailPage';
import ContactUsPage             from './pages/Introduction/ContactUsPage';
import ShoseIntroducePage        from './pages/Introduction/ShoseIntroducePage';
import OfficialWebsitePage       from './pages/Introduction/OfficialWebsitePage';

import LoginPage           from './pages/Authentication/LoginPage';
import InitialPasswordPage from './pages/Authentication/InitialPasswordPage';
import SmsCheckPage        from './pages/Authentication/SmsCheckPage';
import LoginByBiosPage     from './pages/Authentication/LoginByBiosPage';
import SignPage            from './pages/Authentication/SignPage';

import HomePage           from './pages/Home/HomePage';
import NoticePage         from './pages/Common/NoticePage';
import FindPage           from './pages/Home/FindPage';
import FindDetailListPage from './pages/Common/FindDetailListPage';
import MessagesPage       from './pages/Home/MessagesPage';
import MessageDetailPage  from './pages/Common/MessageDetailPage';
import MinePage           from './pages/Home/MinePage';
import MineDetailPage     from './pages/Mine/MineDetailPage';
import MineDetailEditPage from './pages/Mine/MineDetailEditPage';

import ContactPage           from './pages/Common/Contact/ContactPage';
import ContactDetailPage     from './pages/Common/Contact/ContactDetailPage';
import CarsPage              from './pages/Common/CarsPage';
import FormTypeListPage      from './pages/Common/Form/FormTypeListPage';
import FormListPage          from './pages/Common/Form/FormListPage';
import FormPage              from './pages/Common/Form/FormPage';
import FormOrigionalFormPage from './pages/Common/Form/FormOrigionalFormPage';
import FormDrawSignPage      from './pages/Common/Form/FormDrawSignPage';
import FormAllowAddPage      from './pages/Common/Form/FormAllowAddPage';
import MyFormListPage        from './pages/Common/Form/MyFormListPage';
import MyFormPage            from './pages/Common/Form/MyFormPage';
import CreateFormPage                    from './pages/Common/Form/CreateFormPage'; 
import FormInputContentGridPage          from './components/Form/FormInputContentGridPage';
import FormContentTextWithActionPage     from './components/Form/FormContentTextWithActionPage';
import FormContentTextWithTagsPage       from './components/Form/FormContentTextWithTagsPage';
import FormContentChkWithActionPage      from './components/Form/FormContentChkWithActionPage';
import FormContentGridDataTablePage      from './components/Form/FormContentGridDataTablePage';
import FormInputContentGridPageForDeputy from './components/Form/FormInputContentGridPageForDeputy';

import SalaryPage              from './pages/Common/Salary/SalaryPage';
import SurveyPage              from './pages/Common/Survey/SurveyPage';

import PublishPage             from './pages/Common/Publish/PublishPage';
import PublishEditPage         from './pages/Common/Publish/PublishEditPage';
import PublishSubmitPage       from './pages/Common/Publish/PublishSubmitPage';
import PublishSubmitSelectPage from './pages/Common/Publish/PublishSubmitSelectPage';

import DeputyPage         from './pages/Mine/DeputyPage';
import MeetingSettingPage from './pages/Mine/MeetingSettingPage';
import AdvicesPage        from './pages/Mine/AdvicesPage';
import AboutPage          from './pages/Mine/AboutPage';
import AccountSafePage    from './pages/Mine/AccountSafePage';
import UpdatePasswordPage from './pages/Mine/UpdatePasswordPage';
import ChangeAccountPage  from './pages/Mine/ChangeAccountPage';
import ClearCachePage     from "./pages/Mine/ClearCachePage";

import ViewFilePage       from './pages/Common/ViewFilePage';
import AuthenticationView from './components/AuthenticationView';

import DocumentCategoriesPage   from './pages/Common/Document/DocumentCategoriesPage';
import DocumentContentPage      from './pages/Common/Document/DocumentContentPage';
import DocumentDetailPage       from './pages/Common/Document/DocumentDetailPage';
import DocumentNewsContentPage  from './pages/Common/Document/DocumentNewsContentPage';
import ManageDocumentPage       from './pages/Common/ManageDocument/ManageDocumentPage';

import BirthdayWeekPage         from './pages/Common/Birthday/BirthdayWeekPage';
import BirthdayDetailPage       from './pages/Common/Birthday/BirthdayDetailPage';

import KPIDetailPage           from './pages/Common/Report/KPI/KPIDetailPage';
import KPICategoryPage         from './pages/Common/Report/KPI/KPICategoryPage';

import CreateWebViewPage       from './pages/Common/CreateWebViewPage';

import MeetingSearchPage                     from './pages/Common/Meeting/MeetingSearchPage';
import MeetingSearchWithTagsPage             from './pages/Common/Meeting/MeetingSearchWithTagsPage';
import MeetingTimeForSearchPage              from './pages/Common/Meeting/MeetingTimeForSearchPage';
import MeetingListPage                       from './pages/Common/Meeting/MeetingListPage2';
import MeetingInsertPage                     from './pages/Common/Meeting/MeetingInsertPage';
import MeetingInsertChairpersonPage          from './pages/Common/Meeting/MeetingInsertChairpersonPage';
import MeetingInsertWithTagsPage             from './pages/Common/Meeting/MeetingInsertWithTagsPage';
import MeetingInsertWithTagsByPositionPage   from './pages/Common/Meeting/MeetingInsertWithTagsByPositionPage';
import MeetingInsertWithTagsByOrganizePage   from './pages/Common/Meeting/MeetingInsertWithTagsByOrganizePage';
import MeetingInsertWithTagsForSelectPage    from './pages/Common/Meeting/MeetingInsertWithTagsForSelectPage';
import MeetingInsertWithRegularPage          from './pages/Common/Meeting/MeetingInsertWithRegularPage';
import MeetingInsertWithRegularCustomizePage from './pages/Common/Meeting/MeetingInsertWithRegularCustomizePage';

import MeetingTimeForPersonPage    from './pages/Common/Meeting/MeetingTimeForPersonPage';
import MeetingAttendeesReorderPage from './pages/Common/Meeting/MeetingAttendeesReorderPage';

import DailyOralEnglishPage       from "./pages/Common/DailyOralEnglish/DailyOralEnglishPage";
import DailyOralEnglishDetailPage from "./pages/Common/DailyOralEnglish/DailyOralEnglishDetailPage";

import CompanyDocumentPage from "./pages/Common/CompanyDocument/CompanyDocumentPage";
import CompanyDocumentDetailPage from "./pages/Common/CompanyDocument/CompanyDocumentDetailPage";

import MeetingSettingAssistantPage from "./pages/Mine/MeetingSettingAssistantPage";

function ShowSplashPage(props){
  const isFocused = useIsFocused();
  return <SplashPage {...props} isFocused={isFocused}/>
}

const Drawer = createDrawerNavigator();
function IntroductionDrawer(props) {
  const [preventGoback, setPreventGoback] = useState(false);
  const IntroductionDrawerPages = useSelector(state => state.Common.IntroductionDrawerPages)
  const lang                    = useSelector(state => state.Language.lang)
  const LabelColor              = useSelector(state => state.Theme.theme.variables.noticePageTextColor)
  const state                   = useSelector(state => state)

  // ???????????????????????????????????????????????????????????????????????????
  if (useIsFocused() && state.Login.enableAppInitialFunction) {
    if (!preventGoback) {
      props.navigation.addListener('beforeRemove', (e) => {
        e.preventDefault(); // Prevent default behavior of leaving the screen
        Alert.alert(        // Prompt the user before leaving the screen
          lang.Common.Alert,
          lang.Common.LeaveAppAlert,
          [
            { text: lang.Common.Cancel, style: 'cancel', onPress: () => {} },
            {
              text: lang.Common.Comfirm, style: 'destructive',
              onPress: () => NativeModules.ExitApp.exit()
            },
          ]
        );
        
      })
      setPreventGoback(true);
    }
  } else {
    if (preventGoback) {
      props.navigation.removeListener('beforeRemove');
      setPreventGoback(false);
    }
  }

  return (
    <Drawer.Navigator 
      initialRouteName ="Introduction" 
      drawerContent    ={ props => <IntroductionDrawerContent {...props} lang={lang}/>}
      drawerContentOptions = {{ inactiveTintColor:LabelColor }}
    >
      {
        IntroductionDrawerPages.map( page => {
          switch (page.paramcode) {
            case "Introduction":
              return <Drawer.Screen 
                      name      ={page.paramcode} 
                      component ={IntroductionPage} 
                      options   ={{ drawerLabel:lang.SideBar.CompanyInformation }} />
            case "Recruitment":
              return <Drawer.Screen 
                      name      ={page.paramcode} 
                      component ={RecruitPage} 
                      options   ={{ drawerLabel:lang.RecruitDetailPage.RecruitInfo  }}/>
            case "Message":
              return <Drawer.Screen 
                      name      ={page.paramcode} 
                      component ={ContactUsPage} 
                      options   ={{ drawerLabel:lang.ContactUsPage.ContactUs  }}/>
            case "ShoesIntroduction":
              return <Drawer.Screen 
                      name      ={page.paramcode} 
                      component ={ShoseIntroducePage} 
                      options   ={{ drawerLabel:lang.ShoseIntroducePage.ShoemakingInstroduce}}/>
            case "OfficialWebsite":
              return <Drawer.Screen 
                      name      ={page.paramcode} 
                      component ={OfficialWebsitePage} 
                      options   ={{ drawerLabel:lang.OfficialWebsitePage.Title}}/>
          }
        })
      }
    </Drawer.Navigator>
  );
}

const Stack  = createStackNavigator();
function AuthStack(){
  return(
    <Stack.Navigator headerMode="none" initialRouteName="Login">
      <Stack.Screen name ="Login"       component={LoginPage} />
      <Stack.Screen 
        name ="InitialPassword" 
        component={InitialPasswordPage} 
        options={{
          cardStyleInterpolator: Platform.OS == 'ios' ? CardStyleInterpolators.forModalPresentationIOS : CardStyleInterpolators.forFadeFromBottomAndroid,
          cardOverlayEnabled: true
        }}
      />
      <Stack.Screen 
        name ="SmsCheck" 
        component={SmsCheckPage} 
        options={{
          cardStyleInterpolator: Platform.OS == 'ios' ? CardStyleInterpolators.forModalPresentationIOS : CardStyleInterpolators.forFadeFromBottomAndroid,
          cardOverlayEnabled: true
        }}
      />
      <Stack.Screen name ="LoginByBios" component={LoginByBiosPage} />
      <Stack.Screen name ="Sign" component={SignPage} />
    </Stack.Navigator>
  )
}

const Tab = createBottomTabNavigator();
function HomeTabNavigator(props) {
  const [preventGoback, setPreventGoback] = useState(false);
  let state         = useSelector(state => state);
  let theme         = state.Theme.theme['Component.BottomNavigation'];
  let mainPage_lang = state.Language.lang.MainPage;
  let dispatch      = useDispatch();

  // ????????????????????????????????????????????????????????????????????????
  if ( useIsFocused() && state.Login.enableAppInitialFunction ){
    if (!preventGoback) {
      props.navigation.addListener('beforeRemove', (e) => {
        e.preventDefault();   // Prevent default behavior of leaving the screen
        Alert.alert(          // Prompt the user before leaving the screen
          state.Language.lang.Common.Alert,
          state.Language.lang.Common.LeaveAppAlert,
          [
            { text: state.Language.lang.Common.Cancel, style: 'cancel', onPress: () => {} },
            {
              text: state.Language.lang.Common.Comfirm, style: 'destructive',
              onPress: () => NativeModules.ExitApp.exit()
            },
          ]
        );
      })
      setPreventGoback(true);
    }
  } else {
    if (preventGoback) {
      props.navigation.removeListener('beforeRemove');
      setPreventGoback(false);
    }
  }

  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      //??????????????????????????????
      if ( state.Common.isAuthenticateApprove && state.Common.navigatePage !== null ) {
        dispatch(HomeAction.navigateFunctionPage(state.Common.navigatePage));
      }
    });
    return unsubscribe;
  }, [state]);

  return (
      <Tab.Navigator
        screenOptions = {{ 
          headerShown            :false, 
          tabBarActiveTintColor  :theme.activeLabelColor,
          tabBarInactiveTintColor:theme.inactiveLabelColor,
          tabBarStyle            :{backgroundColor: theme.barColor}
        }}
      >
        <Tab.Screen 
          name="Home"      
          component={HomePage} 
          options={{
            tabBarLabelStyle : {fontSize: 16},
            tabBarLabel: mainPage_lang.Home,
            tabBarIcon: ({ focused , color }) => {
              if ( theme.iconIsImage ) {
                return focused ?  
                  <Thumbnail square style={{height:35, width: 35}} source={theme.icon_Home.active}/>
                :
                  <Thumbnail square style={{height:35, width: 35}} source={theme.icon_Home.inactive}/>
              } else {
                return focused ?  
                  <Icon style={{color: color}} name={theme.icon_Home.active}/>
                :
                  <Icon style={{color: color}} name={theme.icon_Home.inactive}/>
              }
            }
          }}
        />
        <Tab.Screen 
          name="Find"      
          component={FindPage}
          options={{
            tabBarLabelStyle : {fontSize: 16},
            tabBarLabel: mainPage_lang.Find,
            tabBarIcon: ({ focused , color }) => {
              if ( theme.iconIsImage ) {
                return focused ?  
                  <Thumbnail square style={{height:35, width: 35}} source={theme.icon_Find.active}/>
                :
                  <Thumbnail square style={{height:35, width: 35}} source={theme.icon_Find.inactive}/>
              } else {
                return focused ?  
                  <Icon style={{color: color}} name={theme.icon_Find.active}/>
                :
                  <Icon style={{color: color}} name={theme.icon_Find.inactive}/>
              }
            }
          }}
        />
        <Tab.Screen 
          name="Messages"  
          component={MessagesPage}
          options={{
            tabBarLabelStyle : {fontSize: 16},
            tabBarLabel: mainPage_lang.Message,
            tabBarBadge: state.Message.UnMessage.length ? state.Message.UnMessage.length : null,
            tabBarIcon: ({ focused , color }) => {
              if ( theme.iconIsImage ) {
                return focused ?  
                  <Thumbnail square style={{height:35, width: 35}} source={theme.icon_Message.active}/>
                :
                  <Thumbnail square style={{height:35, width: 35}} source={theme.icon_Message.inactive}/>
              } else {
                return focused ?  
                  <Icon style={{color: color}} name={theme.icon_Message.active}/>
                :
                  <Icon style={{color: color}} name={theme.icon_Message.inactive}/>
              }
            }
          }}
        />
        <Tab.Screen 
          name="Mine"      
          component={MinePage} 
          options={{
            tabBarLabelStyle : {fontSize: 16},
            tabBarLabel: mainPage_lang.Mine,
            tabBarIcon: ({ focused , color }) => {
              if ( theme.iconIsImage ) {
                return focused ?  
                  <Thumbnail square style={{height:35, width: 35}} source={theme.icon_Mine.active}/>
                :
                  <Thumbnail square style={{height:35, width: 35}} source={theme.icon_Mine.inactive}/>
              } else {
                return focused ?  
                  <Icon style={{color: color}} name={theme.icon_Mine.active}/>
                :
                  <Icon style={{color: color}} name={theme.icon_Mine.inactive}/>
              }
            }
          }}
        />
      </Tab.Navigator>
  );
}

const AppStack  = createStackNavigator();
function MainStack(props){
  return(
    <AppStack.Navigator headerMode="none">

      <AppStack.Screen name ="Splash"               component={ShowSplashPage}/>
      <AppStack.Screen name ="IntroductionDrawer"   component={IntroductionDrawer}
        options={{ ...TransitionPresets.ScaleFromCenterAndroid }} 
      />
      <AppStack.Screen name ="RecruitDetail"        component={RecruitDetailPage}/>
      <AppStack.Screen name ="AuthStack"            component={AuthStack} />
      <AppStack.Screen name ="HomeTabNavigator"     component={HomeTabNavigator}/>

       <AppStack.Screen name ="Notice"              component={NoticePage} />
       <AppStack.Screen name ="FindDetailList"      component={FindDetailListPage} />
       <AppStack.Screen name ="MessageDetail"       component={MessageDetailPage} />
       <AppStack.Screen name ="MineDetail"          component={MineDetailPage} />
       <AppStack.Screen name ="MineDetailEdit"      component={MineDetailEditPage} />

      <AppStack.Screen name ="Contact"              component={ContactPage} />
      <AppStack.Screen name ="ContactDetail"        component={ContactDetailPage} />
      <AppStack.Screen name ="Car"                  component={CarsPage} />

      <AppStack.Screen name ="FormTypeList"         component={FormTypeListPage} />
      <AppStack.Screen name ="FormList"             component={FormListPage} />
      <AppStack.Screen name ="Form"                 component={FormPage} />
      <AppStack.Screen name ="FormOrigionalForm"    component={FormOrigionalFormPage} />
      <AppStack.Screen name ="FormDrawSign"         component={FormDrawSignPage} />
      <AppStack.Screen name ="FormAllowAdd"         component={FormAllowAddPage} />
      <AppStack.Screen name ="MyFormList"           component={MyFormListPage} />
      <AppStack.Screen name ="MyForm"               component={MyFormPage} />
      <AppStack.Screen name ="CreateForm"           component={CreateFormPage} />
      <AppStack.Screen name ="FormInputContentGridPage"     component={FormInputContentGridPage} />
      <AppStack.Screen name ="FormContentTextWithAction"    component={FormContentTextWithActionPage} />
      <AppStack.Screen name ="FormContentTextWithTags"      component={FormContentTextWithTagsPage} />
      <AppStack.Screen name ="FormContentChkWithAction"     component={FormContentChkWithActionPage} />
      <AppStack.Screen name ="FormContentGridDataTable"     component={FormContentGridDataTablePage} />
      <AppStack.Screen name ="FormInputContentGridPageForDeputy"  component={FormInputContentGridPageForDeputy} />
      <AppStack.Screen name ="Salary"               component={SalaryPage} />
      <AppStack.Screen name ="Survey"               component={SurveyPage} />

      <AppStack.Screen name ="Publish"              component={PublishPage} />
      <AppStack.Screen name ="PublishEdit"          component={PublishEditPage} />
      <AppStack.Screen name ="PublishSubmit"        component={PublishSubmitPage} />
      <AppStack.Screen name ="PublishSubmitSelect"  component={PublishSubmitSelectPage} />

      <AppStack.Screen name ="Deputy"           component={DeputyPage} />
      <AppStack.Screen name ="MeetingSetting"   component={MeetingSettingPage} />
      <AppStack.Screen name ="Advices"          component={AdvicesPage} />
      <AppStack.Screen name ="About"            component={AboutPage} />
      <AppStack.Screen name ="AccountSafe"      component={AccountSafePage} />
      <AppStack.Screen name ="UpdatePassword"   component={UpdatePasswordPage} />
      <AppStack.Screen name ="ChangeAccount"    component={ChangeAccountPage} />
      <AppStack.Screen name ="ClearCache"       component={ClearCachePage} />

      <AppStack.Screen name ="ManageDocument"    component={ManageDocumentPage} />
      <AppStack.Screen name ="ViewFile"    component={ViewFilePage} />

      <AppStack.Screen name ="DocumentCategories"    component={DocumentCategoriesPage} />
      <AppStack.Screen name ="DocumentContent"    component={DocumentContentPage} />
      <AppStack.Screen name ="DocumentDetail"    component={DocumentDetailPage} />
      <AppStack.Screen name ="DocumentNewsContent"    component={DocumentNewsContentPage} />

      <AppStack.Screen name ="BirthdayWeek"    component={BirthdayWeekPage}/>
      <AppStack.Screen name ="BirthdayDetail"  component={BirthdayDetailPage} />

      <AppStack.Screen name ="KPIDetail"    component={KPIDetailPage} />
      <AppStack.Screen name ="KPICategory"  component={KPICategoryPage} />

      <AppStack.Screen name ="CreateWebView"  component={CreateWebViewPage} />

      <AppStack.Screen name ="DailyOralEnglish" component={DailyOralEnglishPage}/>
      <AppStack.Screen name ="DailyOralEnglishDetail" component={DailyOralEnglishDetailPage}/>

      <AppStack.Screen name ="MeetingList"                      component={MeetingListPage} />
      <AppStack.Screen name ="MeetingSearch"                    component={MeetingSearchPage} />
      <AppStack.Screen name ="MeetingSearchWithTags"            component={MeetingSearchWithTagsPage} />
      <AppStack.Screen name ="MeetingInsert"                    component={MeetingInsertPage} />
      <AppStack.Screen name ="MeetingInsertWithTags"            component={MeetingInsertWithTagsPage} />
      <AppStack.Screen name ="MeetingInsertWithTagsByPosition"  component={MeetingInsertWithTagsByPositionPage} />
      <AppStack.Screen name ="MeetingInsertWithTagsByOrganize"  component={MeetingInsertWithTagsByOrganizePage} />
      <AppStack.Screen name ="MeetingInsertWithTagsForSelect"   component={MeetingInsertWithTagsForSelectPage} />

      <AppStack.Screen name ="MeetingInsertWithRegular"         component={MeetingInsertWithRegularPage} />
      <AppStack.Screen name ="MeetingInsertWithRegularCustomize" component={MeetingInsertWithRegularCustomizePage} />
      
      <AppStack.Screen name ="MeetingInsertChairperson" component={MeetingInsertChairpersonPage} />
      <AppStack.Screen name ="MeetingTimeForPerson"     component={MeetingTimeForPersonPage} />
      <AppStack.Screen name ="MeetingAttendeesReorder"  component={MeetingAttendeesReorderPage}         
        options={{
          cardStyleInterpolator: Platform.OS == 'ios' ? CardStyleInterpolators.forModalPresentationIOS : CardStyleInterpolators.forFadeFromBottomAndroid,
          cardOverlayEnabled: true
        }}
      />
      <AppStack.Screen name ="MeetingTimeForSearch" component={MeetingTimeForSearchPage} />
      <AppStack.Screen name = "CompanyDocument" component = {CompanyDocumentPage} />
      <AppStack.Screen name = "CompanyDocumentDetail" component = {CompanyDocumentDetailPage} />
      <AppStack.Screen name = "MeetingSettingAssistant" component = {MeetingSettingAssistantPage} />
    </AppStack.Navigator>
  )
}

const RootStack = createStackNavigator();
const showSecurityScreenFromAppState = appState =>['background', 'inactive'].includes(appState)
class Router extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialActiveCount:0 //????????????2??????????????????
    }
  }

  componentDidMount () {
    AppState.addEventListener('change', this.onChangeAppState)
    DeviceStorageUtil.set('isColdActive', true); // ????????????????????????
  }
  
  componentWillUnmount () {
    AppState.removeEventListener('change', this.onChangeAppState)
  }

  onChangeAppState = async nextAppState => {
    this.setState({ initialActiveCount: this.state.initialActiveCount+1 });
    // ??????????????????????????????????????????????????????????????????????????????APP?????????user????????????
    if ( 
      this.props.state.Network.networkStatus && 
      this.state.initialActiveCount > 3 && 
      !showSecurityScreenFromAppState(nextAppState) 
    ) {
      let user = await DeviceStorageUtil.get('User');
      if (user !== "") {
        this.props.actions.appHotInit(this.props.actions);
      }
    }
  }  
  
  render() {
    let theme = this.props.state.Theme.theme
    return (  
          <Root>
            <StyleProvider style={theme}>
              <SafeAreaProvider>
                <NavigationContainer 
                  ref={navigationRef}
                  onStateChange={async () => {
                    this.props.actions.isEnableOrientation(navigationRef.current.getCurrentRoute().name);
                  }}
                >
                {
                  Platform.OS == 'ios' ?
                    <RootStack.Navigator headerMode="none" mode="modal" >
                      <RootStack.Screen name="Main" component={MainStack} options={{ headerShown: false }}/>
                      <RootStack.Screen name="Authentication" component={AuthenticationView} />
                    </RootStack.Navigator>
                  :
                    <SafeAreaView style={{flex: 1}}>
                      <RootStack.Navigator headerMode="none" mode="modal" >
                        <RootStack.Screen name="Main" component={MainStack} options={{ headerShown: false }}/>
                        <RootStack.Screen name="Authentication" component={AuthenticationView} />
                      </RootStack.Navigator>
                    </SafeAreaView>
                }
                </NavigationContainer>
              </SafeAreaProvider>
            </StyleProvider>
          </Root>
        );
  }
}

const appRouter = connect(
  (state) => ({
    state: { ...state }
  }),
  (dispatch) => ({
    actions: bindActionCreators({
      ...AppInitAction,
      ...HomeAction,
      ...ThemeAction,
      ...CommonAction,
      ...LoginAction,
      ...MessageAction,
      ...MeetingAction
    }, dispatch)
  })
)(Router);

export default appRouter;
// export default withSecurityView(appRouter);